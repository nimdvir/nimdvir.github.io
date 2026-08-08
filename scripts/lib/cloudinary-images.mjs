import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { v2 as cloudinary } from 'cloudinary';

const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif']);

export const toPosix = (inputPath) => inputPath.replace(/\\/g, '/');

export const parseCloudinaryUrl = (cloudinaryUrl) => {
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
			secure: true,
		};
	} catch {
		return null;
	}
};

export const configureCloudinary = (cloudinaryUrl) => {
	const cloudinaryConfig = parseCloudinaryUrl(cloudinaryUrl);
	if (!cloudinaryConfig) {
		throw new Error('Invalid CLOUDINARY_URL format. Use cloudinary://<api_key>:<api_secret>@<cloud_name>');
	}

	cloudinary.config(cloudinaryConfig);
	return cloudinaryConfig;
};

export const isImageFile = (filePath) => allowedExtensions.has(path.extname(filePath).toLowerCase());

export const getHash = async (filePath) => {
	const fileBuffer = await fs.readFile(filePath);
	return createHash('sha256').update(fileBuffer).digest('hex');
};

export const readJsonFile = async (filePath, fallbackValue) => {
	try {
		const raw = await fs.readFile(filePath, 'utf8');
		return JSON.parse(raw);
	} catch {
		return fallbackValue;
	}
};

export const writeJsonFile = async (filePath, value) => {
	await fs.mkdir(path.dirname(filePath), { recursive: true });
	await fs.writeFile(filePath, JSON.stringify(value, null, 2));
};

export const walkImages = async (dirPath) => {
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

export const getRelativeImagePath = (filePath, imagesRoot) => {
	const absoluteFile = path.resolve(filePath);
	const relative = path.relative(imagesRoot, absoluteFile);
	if (relative.startsWith('..') || path.isAbsolute(relative)) {
		return null;
	}
	return toPosix(relative);
};

export const makePublicId = (relativeImagePath, folderPrefix) => {
	const withoutExt = relativeImagePath.replace(/\.[^.]+$/, '');
	return `${folderPrefix}/${withoutExt}`;
};

export const insertCloudinaryTransformation = (url, transformation) => {
	if (!url || !transformation) {
		return url;
	}

	const marker = '/upload/';
	if (!url.includes(marker)) {
		return url;
	}

	return url.replace(marker, `${marker}${transformation}/`);
};

export const uploadImage = async (filePath, options) => {
	const {
		imagesRoot,
		folderPrefix,
		cache,
		manifest,
	} = options;

	const relativeImagePath = getRelativeImagePath(filePath, imagesRoot);
	if (!relativeImagePath || !isImageFile(filePath)) {
		return { uploaded: false, skipped: true, reason: 'not an image in /images' };
	}

	const fileHash = await getHash(filePath);
	const cached = cache[relativeImagePath];
	if (cached?.hash === fileHash && cached?.url) {
		manifest[relativeImagePath] = cached.url;
		return { uploaded: false, skipped: true, reason: 'unchanged', url: cached.url };
	}

	const publicId = makePublicId(relativeImagePath, folderPrefix);
	const result = await cloudinary.uploader.upload(filePath, {
		public_id: publicId,
		overwrite: true,
		invalidate: true,
		resource_type: 'image',
	});

	cache[relativeImagePath] = {
		hash: fileHash,
		url: result.secure_url,
		publicId: result.public_id,
		updatedAt: new Date().toISOString(),
	};
	manifest[relativeImagePath] = result.secure_url;

	return { uploaded: true, skipped: false, reason: 'uploaded', url: result.secure_url };
};