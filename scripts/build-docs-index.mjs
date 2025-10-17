#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_ROOT = path.resolve(__dirname, '..', 'knowledge', 'ydb-docs');
const OUT_JSON = path.resolve(__dirname, '..', 'knowledge', 'ydb-docs.index.json');

function* chunkText(text, max = 1600, overlap = 200) {
  let i = 0;
  while (i < text.length) {
    const end = Math.min(text.length, i + max);
    yield text.slice(i, end);
    if (end === text.length) break;
    i = end - overlap;
  }
}

async function listFiles(dir) {
  const ents = await fs.readdir(dir, {withFileTypes: true});
  const files = [];
  for (const e of ents) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await listFiles(p)));
    else files.push(p);
  }
  return files;
}

function toRel(p) {return path.relative(DOCS_ROOT, p);}

async function main() {
  const files = (await listFiles(DOCS_ROOT)).filter((p) => /\.(md|markdown|mdx|txt|yaml|yml|json)$/i.test(p));
  const index = [];
  for (const f of files) {
    const rel = toRel(f);
    const content = await fs.readFile(f, 'utf8');
    let chunkId = 0;
    for (const chunk of chunkText(content)) {
      index.push({file: rel, chunkId: chunkId++, text: chunk});
    }
  }
  await fs.writeFile(OUT_JSON, JSON.stringify(index), 'utf8');
  console.log('Index written:', OUT_JSON, 'chunks:', index.length);
}

main().catch((e) => {console.error(e); process.exit(1);});


