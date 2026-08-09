import path from 'node:path';
import process from 'node:process';
import dotenv from 'dotenv';
import {
	configureCloudinary,
	readJsonFile,
	uploadImage,
	toPosix,
	walkImages,
	writeJsonFile,
} from './lib/cloudinary-images.mjs';

dotenv.config({ quiet: true });

const projectRoot = process.cwd();
const imagesRoot = path.resolve(projectRoot, 'images');
const cachePath = path.resolve(projectRoot, '.cloudinary-upload-cache.json');
const manifestPath = path.resolve(projectRoot, 'src', 'data', 'cloudinary-images.json');
const folderPrefix = process.env.CLOUDINARY_FOLDER?.trim() || 'nimdvir-site';

if (!process.env.CLOUDINARY_URL) {
	console.error('CLOUDINARY_URL is missing. Add it to a local .env file.');
	process.exit(1);
}

try {
	configureCloudinary(process.env.CLOUDINARY_URL);
} catch (error) {
	console.error(error instanceof Error ? error.message : String(error));
	process.exit(1);
}

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
			const result = await uploadImage(filePath, {
				imagesRoot,
				folderPrefix,
				cache,
				manifest,
			});
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

	await writeJsonFile(cachePath, cache);
	await writeJsonFile(manifestPath, manifest);

	console.log(`Cloudinary upload complete: ${uploadedCount} uploaded, ${skippedCount} skipped.`);
};

run().catch((error) => {
	console.error(error instanceof Error ? error.message : String(error));
	process.exit(1);
});
