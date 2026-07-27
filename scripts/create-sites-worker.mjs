import {copyFile, mkdir} from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('dist/server');

await mkdir(outDir, {recursive: true});
await copyFile(path.resolve('sites-worker/index.js'), path.join(outDir, 'index.js'));
