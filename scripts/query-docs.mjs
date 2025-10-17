#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INDEX_JSON = path.resolve(__dirname, '..', 'knowledge', 'ydb-docs.index.json');

function norm(s) {
  return s.toLowerCase();
}

function score(text, terms) {
  const t = norm(text);
  let s = 0;
  for (const term of terms) {
    const n = (t.match(new RegExp(term, 'g')) || []).length;
    s += n * term.length;
  }
  return s;
}

async function main() {
  const query = process.argv.slice(2).join(' ').trim();
  if (!query) {
    console.error('Usage: node scripts/query-docs.mjs <query>');
    process.exit(1);
  }
  const terms = norm(query).split(/\s+/).filter(Boolean);
  const data = JSON.parse(await fs.readFile(INDEX_JSON, 'utf8'));
  const results = data
    .map((r) => ({...r, score: score(r.text, terms)}))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  for (const r of results) {
    console.log(`file: ${r.file}#${r.chunkId} score=${r.score}`);
    console.log(r.text.slice(0, 300).replace(/\n/g, ' '));
    console.log('---');
  }
}

main().catch((e) => {console.error(e); process.exit(1);});


