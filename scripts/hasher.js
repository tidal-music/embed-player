// @ts-check
/* eslint-disable no-console */
/* eslint-disable compat/compat */
/* eslint-env node */
import { hashFile } from 'hasha';
import { createWriteStream, createReadStream } from 'fs';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const buildText = '🔖 Hashing files for S3 bucket';

console.debug(buildText + '...');
console.time(buildText);

async function hashIt (relativeFilePath) {
  const filePath = fileURLToPath(new URL('../src/client/' + relativeFilePath, import.meta.url));

  const hash = await hashFile(filePath, { algorithm: 'md5' });

  const obj = {};

  obj[relativeFilePath] = getRelativeDistPath(relativeFilePath, hash);

  await copyFileAndSaveWithHash(filePath, hash);

  return obj;
}

function getRelativeDistPath (relativeFilePath, hash) {
  const ext = path.extname(relativeFilePath);
  const baseName = path.basename(relativeFilePath, ext);
  const dirName = path.dirname(relativeFilePath);

  if (dirName && dirName !== '.') {
    return `${dirName}/${baseName}.${hash}${ext}`;
  }

  return `${baseName}.${hash}${ext}`;
}

async function getDistPath (srcFilePath, hash) {
  const ext = path.extname(srcFilePath);
  const baseName = path.basename(srcFilePath, ext);
  const dirName = path
    .dirname(srcFilePath)
    .replace('/src', '/dist');

  const distFilePath = path.resolve(`${dirName}/${baseName}.${hash}${ext}`);

  await mkdir(path.dirname(distFilePath), { recursive: true }).catch(console.error);

  return distFilePath;
}

async function copyFileAndSaveWithHash (srcFilePath, hash) {
  const distFilePath = await getDistPath(srcFilePath, hash);

  createReadStream(srcFilePath).pipe(createWriteStream(distFilePath));
}

async function updateHashTable (newData) {
  const rawCurrentHashTable = await readFile('dist/hash-table.json', 'utf8');
  const currentHashTable = JSON.parse(rawCurrentHashTable);
  const updatedHashTable = Object.assign({}, currentHashTable, newData);

  return await writeFile('dist/hash-table.json', JSON.stringify(updatedHashTable), 'utf-8');
}

const additionsText = await readFile('additions.json', 'utf8');
const additions = JSON.parse(additionsText);

const filesToHash = [
  'img/error-background-image.jpg',
  'img/loader.svg',
  'img/icons.svg',
  ...additions.staticFiles
]

Promise.all(filesToHash.map(hashIt))
  .then(values => {
    const hashTable = values.reduce(
      (ak, kur) => Object.assign(ak, kur) /* ...at 🇳🇴 */
    );

    updateHashTable(hashTable);
  })
  .catch(error => console.error(error))
  .finally(() => console.timeEnd(buildText));
/* eslint-enable no-console */
