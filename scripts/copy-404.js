import { copyFile, access } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');
const indexHtml = path.join(distDir, 'index.html');
const notFoundHtml = path.join(distDir, '404.html');

async function run() {
  try {
    await access(indexHtml);
  } catch {
    throw new Error('Build output not found. Run `npm run build` first.');
  }

  await copyFile(indexHtml, notFoundHtml);
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
