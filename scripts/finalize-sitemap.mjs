import { copyFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.dirname(scriptDir);
const distDir = path.join(rootDir, 'dist');
const aliasPath = path.join(distDir, 'sitemap.xml');
const indexPath = path.join(distDir, 'sitemap-index.xml');

const entries = await readdir(distDir);
const sitemapChunks = entries
	.filter((entry) => /^sitemap-\d+\.xml$/.test(entry))
	.sort();

const sourceFile = sitemapChunks.length === 1
	? path.join(distDir, sitemapChunks[0])
	: indexPath;

await copyFile(sourceFile, aliasPath);

console.log(`Created sitemap alias from ${path.basename(sourceFile)} to sitemap.xml`);