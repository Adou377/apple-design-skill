#!/usr/bin/env node
'use strict';
/**
 * Verifies that every local href/src in the shipped HTML resolves to a real
 * file, and that in-page anchors point at an existing id/name.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const files = ['reference.html', ...fs.readdirSync(path.join(root, 'examples'))
  .filter((f) => f.endsWith('.html'))
  .map((f) => 'examples/' + f)];

const problems = [];
let checked = 0;

for (const file of files) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const attr = /\s(?:href|src)="([^"]+)"/g;
  let match;
  while ((match = attr.exec(source))) {
    const raw = match[1].trim();
    if (!raw || /^(?:[a-z]+:|\/\/)/i.test(raw)) continue; // external / mailto / data
    checked++;

    let target = raw;
    let hash = '';
    const hashIndex = target.indexOf('#');
    if (hashIndex !== -1) {
      hash = target.slice(hashIndex + 1);
      target = target.slice(0, hashIndex);
    }
    const queryIndex = target.indexOf('?');
    if (queryIndex !== -1) target = target.slice(0, queryIndex);
    if (!target && !hash) continue;

    const rel = target ? decodeURIComponent(target) : file;
    const resolved = path.resolve(path.dirname(path.join(root, file)), rel);
    if (!fs.existsSync(resolved)) {
      problems.push(`${file}: missing ${raw}`);
      continue;
    }
    if (hash && resolved.endsWith('.html')) {
      const text = fs.readFileSync(resolved, 'utf8');
      const id = new RegExp('(?:id|name)="' + hash.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"');
      if (!id.test(text)) problems.push(`${file}: anchor #${hash} not found in ${rel}`);
    }
  }
}

if (problems.length) {
  console.error(`Link check failed (${problems.length}):`);
  problems.forEach((p) => console.error('  - ' + p));
  process.exit(1);
}
console.log(`Link check passed (${checked} local references across ${files.length} pages).`);
