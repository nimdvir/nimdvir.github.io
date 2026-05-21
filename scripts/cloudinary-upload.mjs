import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createHash } from 'node:crypto';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const projectRoot = process.cwd();
const imagesRoot = path.resolve(projectRoot, 'images');
const cachePath = path.resolve(projectRoot, '.cloudinary-upload-cache.json');
const manifestPath = path.resolve(projectRoot, 'src', 'data', 'cloudinary-images.json');
const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif']);
const folderPrefix = process.env.CLOUDINARY_FOLDER?.trim() || 'nimdvir-site';

if (!process.env.CLOUDINARY_URL) {
	console.error('CLOUDINARY_URL is missing. Add it to a local .env file.');
	process.exit(1);
}

const parseCloudinaryUrl = (cloudinaryUrl) => {
	try {
		const parsed = new URL(cloudinaryUrl);
		if (parsed.protocol !== 'cloudinary:') {
			return null;
		}

		const apiKey = decodeURIComponent(parsed.username || '');
		const apiSecret = decodeURIComponent(parsed.password || '');
		const cloudName = decodeURIComponent(parsed.hostname || '');

		if (!apiKey || !apiSecret || !cloudName) {
			return null;
		}

		return {
			api_key: apiKey,
			api_secret: apiSecret,
			cloud_name: cloudName,
			secure: true
		};
	} catch {
		return null;
	}
};

const cloudinaryConfig = parseCloudinaryUrl(process.env.CLOUDINARY_URL);
if (!cloudinaryConfig) {
	console.error('Invalid CLOUDINARY_URL format. Use cloudinary://<api_key>:<api_secret>@<cloud_name>');
	process.exit(1);
}

cloudinary.config(cloudinaryConfig);

const toPosix = (inputPath) => inputPath.replace(/\\/g, '/');

const getHash = async (filePath) => {
	const fileBuffer = await fs.readFile(filePath);
	return createHash('sha256').update(fileBuffer).digest('hex');
};

const isImageFile = (filePath) => allowedExtensions.has(path.extname(filePath).toLowerCase());

const getRelativeImagePath = (filePath) => {
	const absoluteFile = path.resolve(filePath);
	const relative = path.relative(imagesRoot, absoluteFile);
	if (relative.startsWith('..') || path.isAbsolute(relative)) {
		return null;
	}
	return toPosix(relative);
};

const makePublicId = (relativeImagePath) => {
	const withoutExt = relativeImagePath.replace(/\.[^.]+$/, '');
	return `${folderPrefix}/${withoutExt}`;
};

const readJsonFile = async (filePath, fallbackValue) => {
	try {
		const raw = await fs.readFile(filePath, 'utf8');
		return JSON.parse(raw);
	} catch {
		return fallbackValue;
	}
};

const walkImages = async (dirPath) => {
	const dirEntries = await fs.readdir(dirPath, { withFileTypes: true });
	const files = [];
	for (const entry of dirEntries) {
		const fullPath = path.join(dirPath, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await walkImages(fullPath)));
			continue;
		}
		if (entry.isFile() && isImageFile(fullPath)) {
			files.push(fullPath);
		}
	}
	return files;
};

const uploadImage = async (filePath, cache, manifest) => {
	const relativeImagePath = getRelativeImagePath(filePath);
	if (!relativeImagePath || !isImageFile(filePath)) {
		return { uploaded: false, skipped: true, reason: 'not an image in /images' };
	}

	const fileHash = await getHash(filePath);
	const cached = cache[relativeImagePath];
	if (cached?.hash === fileHash && cached?.url) {
		manifest[relativeImagePath] = cached.url;
		return { uploaded: false, skipped: true, reason: 'unchanged' };
	}

	const publicId = makePublicId(relativeImagePath);
	const result = await cloudinary.uploader.upload(filePath, {
		public_id: publicId,
		overwrite: true,
		invalidate: true,
		resource_type: 'image'
	});

	cache[relativeImagePath] = {
		hash: fileHash,
		url: result.secure_url,
		publicId: result.public_id,
		updatedAt: new Date().toISOString()
	};
	manifest[relativeImagePath] = result.secure_url;

	return { uploaded: true, skipped: false, reason: 'uploaded', url: result.secure_url };
};

const inputArg = process.argv[2];

const run = async () => {
	const cache = await readJsonFile(cachePath, {});
	const manifest = await readJsonFile(manifestPath, {});

	let filesToUpload = [];
	if (inputArg) {
		const candidate = path.resolve(projectRoot, inputArg);
		filesToUpload = [candidate];
	} else {
		filesToUpload = await walkImages(imagesRoot);
	}

	if (filesToUpload.length === 0) {
		console.log('No images found to upload.');
		return;
	}

	let uploadedCount = 0;
	let skippedCount = 0;

	for (const filePath of filesToUpload) {
		try {
			const result = await uploadImage(filePath, cache, manifest);
			if (result.uploaded) {
				uploadedCount += 1;
				console.log(`Uploaded: ${toPosix(path.relative(projectRoot, filePath))}`);
			} else if (result.skipped) {
				skippedCount += 1;
				console.log(`Skipped (${result.reason}): ${toPosix(path.relative(projectRoot, filePath))}`);
			}
		} catch (error) {
			console.error(`Failed: ${toPosix(path.relative(projectRoot, filePath))}`);
			console.error(error instanceof Error ? error.message : String(error));
		}
	}

	await fs.mkdir(path.dirname(cachePath), { recursive: true });
	await fs.writeFile(cachePath, JSON.stringify(cache, null, 2));
	await fs.mkdir(path.dirname(manifestPath), { recursive: true });
	await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

	console.log(`Cloudinary upload complete: ${uploadedCount} uploaded, ${skippedCount} skipped.`);
};

run().catch((error) => {
	console.error(error instanceof Error ? error.message : String(error));
	process.exit(1);
});
