import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import dotenv from 'dotenv';
import yaml from 'js-yaml';
import {
	configureCloudinary,
	insertCloudinaryTransformation,
	isImageFile,
	readJsonFile,
	toPosix,
	uploadImage,
	walkImages,
	writeJsonFile,
} from './lib/cloudinary-images.mjs';

dotenv.config({ quiet: true });

const execFileAsync = promisify(execFile);
const { load, dump } = yaml;

const projectRoot = process.cwd();
const userProfile = process.env.USERPROFILE || process.env.HOME || projectRoot;
const interviewsRoot = path.resolve(projectRoot, 'src', 'content', 'interviews');
const imagesRoot = path.resolve(projectRoot, 'images');
const interviewWorkingRoot = path.resolve(imagesRoot, 'interviews');
const canonicalOriginalsRoot = process.env.INTERVIEW_ORIGINALS_ROOT?.trim()
	? path.resolve(process.env.INTERVIEW_ORIGINALS_ROOT)
	: path.resolve(userProfile, 'Pictures', 'nimdvir.github.io-personalsite-images', 'portfolio', 'interviews');
const cachePath = path.resolve(projectRoot, '.cloudinary-upload-cache.json');
const manifestPath = path.resolve(projectRoot, 'src', 'data', 'cloudinary-images.json');
const monthPattern = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2}, \d{4}$/;
const portraitTransform = 'f_auto,q_auto,w_300,h_300,c_thumb,g_face,r_max';
const heroTransform = 'f_auto,q_auto,w_1600';
const portraitNamePattern = /(portrait|thumb|avatar|profile|headshot)/i;
const heroNamePattern = /(hero|cover|feature|landscape|wide|banner)/i;
const questionLinePattern = /^\*\*.+\?\*\*(?:\s+.+)?$/;
const inlineAnswerPattern = /^\*\*.+\?\*\*\s+.+$/;

const usage = [
	'Usage:',
	'  node scripts/interview-publish.mjs check <markdown-path> [--source <path-or-url>] [--portrait <path-or-url>] [--hero <path-or-url>]',
	'  node scripts/interview-publish.mjs publish <markdown-path> [--source <path-or-url>] [--portrait <path-or-url>] [--hero <path-or-url>] [--move] [--no-build]',
].join('\n');

const normalizePath = (inputPath) => path.resolve(inputPath).replace(/\\/g, '/').toLowerCase();

const pathExists = async (candidatePath) => {
	try {
		await fs.access(candidatePath);
		return true;
	} catch {
		return false;
	}
};

const assertInside = (candidatePath, rootPath, label) => {
	const relative = path.relative(rootPath, candidatePath);
	if (relative.startsWith('..') || path.isAbsolute(relative)) {
		throw new Error(`${label} must be inside ${rootPath}`);
	}
};

const parseArgs = (argv) => {
	const [mode, markdownArg, ...optionArgs] = argv;
	if (!mode || !markdownArg || !new Set(['check', 'publish']).has(mode)) {
		throw new Error(usage);
	}

	const options = {
		source: null,
		portrait: null,
		hero: null,
		move: false,
		build: true,
	};

	for (let index = 0; index < optionArgs.length; index += 1) {
		const current = optionArgs[index];
		if (current === '--move') {
			options.move = true;
			continue;
		}
		if (current === '--no-build') {
			options.build = false;
			continue;
		}
		if (!current.startsWith('--')) {
			throw new Error(`Unexpected argument: ${current}`);
		}

		const nextValue = optionArgs[index + 1];
		if (!nextValue || nextValue.startsWith('--')) {
			throw new Error(`Missing value for ${current}`);
		}

		if (current === '--source') {
			options.source = nextValue;
		} else if (current === '--portrait') {
			options.portrait = nextValue;
		} else if (current === '--hero') {
			options.hero = nextValue;
		} else {
			throw new Error(`Unknown option: ${current}`);
		}

		index += 1;
	}

	return {
		mode,
		markdownPath: path.resolve(projectRoot, markdownArg),
		options,
	};
};

const parseMarkdownDocument = (rawDocument) => {
	if (!rawDocument.startsWith('---\n') && !rawDocument.startsWith('---\r\n')) {
		throw new Error('Interview markdown must start with a YAML frontmatter block.');
	}

	const match = rawDocument.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	if (!match) {
		throw new Error('Invalid frontmatter block.');
	}

	const data = load(match[1]) || {};
	if (typeof data !== 'object' || Array.isArray(data)) {
		throw new Error('Frontmatter must resolve to an object.');
	}

	return {
		data: { ...data },
		body: match[2].trim(),
	};
};

const orderInterviewData = (data) => {
	const ordered = {
		title: data.title,
		interviewee: data.interviewee,
		date: data.date,
		tags: data.tags,
		summary: data.summary,
	};

	if (data.image) {
		ordered.image = data.image;
	}
	if (data.imageAlt) {
		ordered.imageAlt = data.imageAlt;
	}
	if (data.imageCaption) {
		ordered.imageCaption = data.imageCaption;
	}
	if (data.source) {
		ordered.source = data.source;
	}
	if (data.sourceUrl) {
		ordered.sourceUrl = data.sourceUrl;
	}
	if (data.heroImage) {
		ordered.heroImage = data.heroImage;
	}
	if (data.heroImageAlt) {
		ordered.heroImageAlt = data.heroImageAlt;
	}
	if (data.heroImageCaption) {
		ordered.heroImageCaption = data.heroImageCaption;
	}

	for (const [key, value] of Object.entries(data)) {
		if (!(key in ordered)) {
			ordered[key] = value;
		}
	}

	return ordered;
};

const serializeMarkdownDocument = (data, body) => {
	const frontmatter = dump(orderInterviewData(data), {
		lineWidth: -1,
		noRefs: true,
		quotingType: '"',
		forceQuotes: true,
	});

	return `---\n${frontmatter.trimEnd()}\n---\n\n${body.trim()}\n`;
};

const findQuestionLines = (body) => body.split(/\r?\n/).map((line) => line.trim()).filter((line) => questionLinePattern.test(line));

const validateQuestionAnswerFormatting = (body) => {
	const errors = [];
	const lines = body.split(/\r?\n/).map((line) => line.trim());
	const questionIndexes = [];

	for (let index = 0; index < lines.length; index += 1) {
		if (questionLinePattern.test(lines[index])) {
			questionIndexes.push(index);
		}
	}

	if (questionIndexes.length === 0) {
		errors.push('Body must include at least one bold interview question that ends with a question mark.');
		return errors;
	}

	for (const questionIndex of questionIndexes) {
		let nextContent = null;
		for (let lineIndex = questionIndex + 1; lineIndex < lines.length; lineIndex += 1) {
			if (!lines[lineIndex]) {
				continue;
			}
			nextContent = lines[lineIndex];
			break;
		}

		if (!nextContent) {
			if (inlineAnswerPattern.test(lines[questionIndex])) {
				continue;
			}
			errors.push(`Question is missing an answer: ${lines[questionIndex]}`);
			continue;
		}

		if (inlineAnswerPattern.test(lines[questionIndex])) {
			continue;
		}

		if (/^\*\*.+\*\*$/.test(nextContent) || /^##\s+/.test(nextContent)) {
			errors.push(`Question must be followed by regular answer text: ${lines[questionIndex]}`);
		}
	}

	return errors;
};

const validateBodyImages = (body) => {
	const errors = [];
	if (/!\[[^\]]*\]\([^)]*\)/.test(body)) {
		errors.push('Body images must use <figure> with <figcaption>; markdown image syntax is not allowed.');
	}

	const figureMatches = [...body.matchAll(/<figure\b[\s\S]*?<\/figure>/gi)];
	const figureRanges = figureMatches.map((match) => ({
		start: match.index ?? 0,
		end: (match.index ?? 0) + match[0].length,
		markup: match[0],
	}));

	for (const figure of figureRanges) {
		if (!/<img\b/i.test(figure.markup) || !/<figcaption\b[\s\S]*?<\/figcaption>/i.test(figure.markup)) {
			errors.push('Every <figure> in the interview body must contain an <img> and a <figcaption>.');
		}
	}

	for (const imageMatch of body.matchAll(/<img\b/gi)) {
		const imageIndex = imageMatch.index ?? 0;
		const wrapped = figureRanges.some((figure) => imageIndex >= figure.start && imageIndex <= figure.end);
		if (!wrapped) {
			errors.push('Inline <img> tags must be wrapped in <figure> with a <figcaption>.');
			break;
		}
	}

	return errors;
};

const validateInterview = async ({ markdownPath, slug, data, body, options, canonicalOriginalsDir }) => {
	const errors = [];

	if (!markdownPath.endsWith('.md')) {
		errors.push('Interview file must use the .md extension.');
	}
	if (!data.title || typeof data.title !== 'string') {
		errors.push('Missing required frontmatter field: title');
	}
	if (!data.interviewee || typeof data.interviewee !== 'string') {
		errors.push('Missing required frontmatter field: interviewee');
	}
	if (!data.date || typeof data.date !== 'string' || !monthPattern.test(data.date)) {
		errors.push('Date must use the format Mon DD, YYYY, for example Mar 28, 2019.');
	}
	if (!Array.isArray(data.tags) || !data.tags.includes('Interview')) {
		errors.push('Tags must be an array that includes Interview.');
	}
	if (!data.summary || typeof data.summary !== 'string') {
		errors.push('Missing required frontmatter field: summary');
	}
	if (Boolean(data.source) !== Boolean(data.sourceUrl)) {
		errors.push('source and sourceUrl must either both be present or both be absent.');
	}
	if (!data.imageAlt || typeof data.imageAlt !== 'string') {
		errors.push('Missing required frontmatter field: imageAlt');
	}
	if (!data.imageCaption || typeof data.imageCaption !== 'string') {
		errors.push('Missing required frontmatter field: imageCaption');
	}
	if ((data.heroImage || options.hero) && (!data.heroImageAlt || !data.heroImageCaption)) {
		errors.push('heroImageAlt and heroImageCaption are required when a hero image is present.');
	}
	if (!body || body.length < 200) {
		errors.push('Interview body is too short or empty.');
	}

	errors.push(...validateQuestionAnswerFormatting(body));
	errors.push(...validateBodyImages(body));

	const siblingPath = path.resolve(interviewsRoot, `${slug}.md`);
	if (normalizePath(siblingPath) !== normalizePath(markdownPath) && (await pathExists(siblingPath))) {
		errors.push(`Another interview already uses the slug ${slug}.`);
	}

	const canonicalExists = await pathExists(canonicalOriginalsDir);
	const alternateSourceProvided = Boolean(options.source || options.portrait || options.hero);
	if (!canonicalExists && !alternateSourceProvided && !data.image) {
		errors.push(`No raw originals were found in ${canonicalOriginalsDir}. Save the originals there or provide --source, --portrait, or --hero.`);
	}

	const questionLines = findQuestionLines(body);
	if (questionLines.length === 0) {
		errors.push('Interview body must include at least one bold question line.');
	}

	return errors;
};

const printReminder = (canonicalOriginalsDir) => {
	console.log(`Reminder: save raw originals in ${canonicalOriginalsDir}`);
};

const makeCanonicalDir = async (canonicalOriginalsDir) => {
	await fs.mkdir(canonicalOriginalsDir, { recursive: true });
};

const isRemoteInput = (candidate) => /^https?:\/\//i.test(candidate);

const fileNameFromUrl = (url, fallbackBaseName) => {
	try {
		const parsed = new URL(url);
		const parsedName = path.basename(parsed.pathname);
		if (parsedName && parsedName !== '/') {
			return parsedName;
		}
	} catch {
		return fallbackBaseName;
	}
	return fallbackBaseName;
};

const ensureUniquePath = async (candidatePath) => {
	if (!(await pathExists(candidatePath))) {
		return candidatePath;
	}

	const directory = path.dirname(candidatePath);
	const extension = path.extname(candidatePath);
	const baseName = path.basename(candidatePath, extension);
	let suffix = 1;
	while (true) {
		const nextCandidate = path.join(directory, `${baseName}-${suffix}${extension}`);
		if (!(await pathExists(nextCandidate))) {
			return nextCandidate;
		}
		suffix += 1;
	}
};

const downloadFile = async (url, destinationPath) => {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
	}

	const arrayBuffer = await response.arrayBuffer();
	await fs.writeFile(destinationPath, Buffer.from(arrayBuffer));
	return destinationPath;
};

const copyOrMoveFile = async (sourcePath, destinationPath, move) => {
	if (move) {
		await fs.mkdir(path.dirname(destinationPath), { recursive: true });
		await fs.rename(sourcePath, destinationPath);
		return destinationPath;
	}

	await fs.mkdir(path.dirname(destinationPath), { recursive: true });
	await fs.copyFile(sourcePath, destinationPath);
	return destinationPath;
};

const migrateInputToCanonical = async ({ input, canonicalOriginalsDir, move, preferredBaseName }) => {
	if (!input) {
		return [];
	}

	await makeCanonicalDir(canonicalOriginalsDir);

	if (isRemoteInput(input)) {
		const fallbackName = preferredBaseName ? `${preferredBaseName}.jpg` : 'downloaded-image.jpg';
		const destinationName = fileNameFromUrl(input, fallbackName);
		const destinationPath = await ensureUniquePath(path.join(canonicalOriginalsDir, destinationName));
		await downloadFile(input, destinationPath);
		return [destinationPath];
	}

	const absoluteInput = path.resolve(projectRoot, input);
	if (!(await pathExists(absoluteInput))) {
		throw new Error(`Image source not found: ${absoluteInput}`);
	}

	const stats = await fs.stat(absoluteInput);
	if (stats.isDirectory()) {
		const sourceFiles = (await walkImages(absoluteInput)).sort();
		const migratedFiles = [];
		for (const sourceFile of sourceFiles) {
			const destinationPath = await ensureUniquePath(path.join(canonicalOriginalsDir, path.basename(sourceFile)));
			migratedFiles.push(await copyOrMoveFile(sourceFile, destinationPath, move));
		}
		return migratedFiles;
	}

	if (!isImageFile(absoluteInput)) {
		throw new Error(`Not a supported image file: ${absoluteInput}`);
	}

	const extension = path.extname(absoluteInput);
	const destinationName = preferredBaseName ? `${preferredBaseName}${extension}` : path.basename(absoluteInput);
	const destinationPath = await ensureUniquePath(path.join(canonicalOriginalsDir, destinationName));
	return [await copyOrMoveFile(absoluteInput, destinationPath, move)];
};

const selectWorkingImages = async (canonicalOriginalsDir) => {
	if (!(await pathExists(canonicalOriginalsDir))) {
		return { portraitSource: null, heroSource: null, availableFiles: [] };
	}

	const availableFiles = (await walkImages(canonicalOriginalsDir)).sort();
	if (availableFiles.length === 0) {
		return { portraitSource: null, heroSource: null, availableFiles };
	}

	const namedPortrait = availableFiles.find((filePath) => portraitNamePattern.test(path.basename(filePath)));
	const namedHero = availableFiles.find((filePath) => heroNamePattern.test(path.basename(filePath)));

	let portraitSource = namedPortrait || null;
	let heroSource = namedHero || null;

	if (!portraitSource && availableFiles.length === 1) {
		portraitSource = availableFiles[0];
	}

	if (!portraitSource && availableFiles.length >= 2) {
		const withSizes = await Promise.all(availableFiles.map(async (filePath) => ({
			filePath,
			size: (await fs.stat(filePath)).size,
		})));
		withSizes.sort((left, right) => left.size - right.size);
		portraitSource = withSizes[0].filePath;
		heroSource = heroSource || withSizes[withSizes.length - 1].filePath;
	}

	if (!heroSource && availableFiles.length >= 2) {
		const remaining = availableFiles.filter((filePath) => filePath !== portraitSource);
		heroSource = remaining[remaining.length - 1] || null;
	}

	if (heroSource && portraitSource && heroSource === portraitSource) {
		heroSource = null;
	}

	return { portraitSource, heroSource, availableFiles };
};

const copyWorkingImages = async ({ slug, portraitSource, heroSource }) => {
	const workingDir = path.join(interviewWorkingRoot, slug);
	await fs.rm(workingDir, { recursive: true, force: true });
	await fs.mkdir(workingDir, { recursive: true });

	const copied = {
		workingDir,
		portraitPath: null,
		heroPath: null,
	};

	if (portraitSource) {
		const portraitExtension = path.extname(portraitSource);
		copied.portraitPath = path.join(workingDir, `portrait${portraitExtension}`);
		await fs.copyFile(portraitSource, copied.portraitPath);
	}

	if (heroSource) {
		const heroExtension = path.extname(heroSource);
		copied.heroPath = path.join(workingDir, `hero${heroExtension}`);
		await fs.copyFile(heroSource, copied.heroPath);
	}

	return copied;
};

const optimizeWorkingImages = async (workingDir) => {
	const optimizeTarget = `${toPosix(path.relative(projectRoot, workingDir))}/**/*.{jpg,jpeg,png,gif,svg}`;
	const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
	await execFileAsync(command, [
		'imagemin',
		optimizeTarget,
		'--out-dir',
		toPosix(path.relative(projectRoot, workingDir)),
		'--plugin=mozjpeg',
		'--plugin=pngquant',
		'--plugin=gifsicle',
		'--plugin=svgo',
	], { cwd: projectRoot });
};

const buildSite = async () => {
	const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
	await execFileAsync(command, ['run', 'build'], { cwd: projectRoot });
};

const uploadWorkingImages = async ({ portraitPath, heroPath }) => {
	if (!process.env.CLOUDINARY_URL) {
		throw new Error('CLOUDINARY_URL is missing. Add it to a local .env file.');
	}

	configureCloudinary(process.env.CLOUDINARY_URL);

	const cache = await readJsonFile(cachePath, {});
	const manifest = await readJsonFile(manifestPath, {});
	const folderPrefix = process.env.CLOUDINARY_FOLDER?.trim() || 'nimdvir-site';

	const result = {
		portrait: null,
		hero: null,
	};

	if (portraitPath) {
		result.portrait = await uploadImage(portraitPath, {
			imagesRoot,
			folderPrefix,
			cache,
			manifest,
		});
	}

	if (heroPath) {
		result.hero = await uploadImage(heroPath, {
			imagesRoot,
			folderPrefix,
			cache,
			manifest,
		});
	}

	await writeJsonFile(cachePath, cache);
	await writeJsonFile(manifestPath, manifest);

	return result;
};

const buildFrontmatterUpdates = ({ data, uploadResult }) => {
	const updates = { ...data };
	if (uploadResult.portrait?.url) {
		updates.image = insertCloudinaryTransformation(uploadResult.portrait.url, portraitTransform);
	}
	if (uploadResult.hero?.url) {
		updates.heroImage = insertCloudinaryTransformation(uploadResult.hero.url, heroTransform);
	}
	return updates;
};

const resolveBuildOutput = (slug) => path.resolve(projectRoot, 'dist', 'interviews', slug, 'index.html');

const run = async () => {
	const { mode, markdownPath, options } = parseArgs(process.argv.slice(2));
	assertInside(markdownPath, interviewsRoot, 'Interview markdown');

	const rawMarkdown = await fs.readFile(markdownPath, 'utf8');
	const { data, body } = parseMarkdownDocument(rawMarkdown);
	const slug = path.basename(markdownPath, '.md');
	const canonicalOriginalsDir = path.join(canonicalOriginalsRoot, slug);

	printReminder(canonicalOriginalsDir);

	const validationErrors = await validateInterview({
		markdownPath,
		slug,
		data,
		body,
		options,
		canonicalOriginalsDir,
	});

	if (validationErrors.length > 0) {
		console.error('Interview validation failed:');
		for (const error of validationErrors) {
			console.error(`- ${error}`);
		}
		process.exit(1);
	}

	if (mode === 'check') {
		console.log(`Interview check passed for ${toPosix(path.relative(projectRoot, markdownPath))}`);
		console.log(`Canonical originals folder: ${canonicalOriginalsDir}`);
		console.log(`Final HTML will be generated at ${resolveBuildOutput(slug)}`);
		return;
	}

	const migrationReport = [];
	const migratedPortrait = await migrateInputToCanonical({
		input: options.portrait,
		canonicalOriginalsDir,
		move: options.move,
		preferredBaseName: 'portrait',
	});
	if (migratedPortrait.length > 0) {
		migrationReport.push(`Migrated portrait source to ${canonicalOriginalsDir}`);
	}

	const migratedHero = await migrateInputToCanonical({
		input: options.hero,
		canonicalOriginalsDir,
		move: options.move,
		preferredBaseName: 'hero',
	});
	if (migratedHero.length > 0) {
		migrationReport.push(`Migrated hero source to ${canonicalOriginalsDir}`);
	}

	const migratedSource = await migrateInputToCanonical({
		input: options.source,
		canonicalOriginalsDir,
		move: options.move,
		preferredBaseName: 'source-image',
	});
	if (migratedSource.length > 0) {
		migrationReport.push(`Migrated alternate source images to ${canonicalOriginalsDir}`);
	}

	const selectedImages = await selectWorkingImages(canonicalOriginalsDir);
	if (!selectedImages.portraitSource && !data.image) {
		throw new Error(`No portrait image could be resolved from ${canonicalOriginalsDir}. Add a portrait image there or pass --portrait.`);
	}

	const workingImages = await copyWorkingImages({
		slug,
		portraitSource: selectedImages.portraitSource,
		heroSource: selectedImages.heroSource,
	});

	if (workingImages.portraitPath || workingImages.heroPath) {
		await optimizeWorkingImages(workingImages.workingDir);
	}

	const uploadResult = await uploadWorkingImages({
		portraitPath: workingImages.portraitPath,
		heroPath: workingImages.heroPath,
	});

	const updatedData = buildFrontmatterUpdates({ data, uploadResult });
	await fs.writeFile(markdownPath, serializeMarkdownDocument(updatedData, body));

	if (options.build) {
		await buildSite();
	}

	console.log(`Interview publish complete for ${toPosix(path.relative(projectRoot, markdownPath))}`);
	console.log(`Canonical originals folder: ${canonicalOriginalsDir}`);
	if (migrationReport.length > 0) {
		for (const line of migrationReport) {
			console.log(line);
		}
		console.log('If the originals were saved elsewhere first, continue using the canonical originals folder next time.');
	}
	console.log(`Optimized working folder: ${workingImages.workingDir}`);
	if (updatedData.image) {
		console.log(`Portrait image URL: ${updatedData.image}`);
	}
	if (updatedData.heroImage) {
		console.log(`Hero image URL: ${updatedData.heroImage}`);
	}
	if (options.build) {
		console.log(`Final HTML output: ${resolveBuildOutput(slug)}`);
	}
	if (selectedImages.availableFiles.length > 2) {
		console.log('Reminder: extra originals were detected in the canonical folder. Only the selected portrait and hero images were uploaded.');
	}
};

run().catch((error) => {
	console.error(error instanceof Error ? error.message : String(error));
	process.exit(1);
});