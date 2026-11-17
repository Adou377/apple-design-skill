#!/usr/bin/env node
'use strict';
/**
 * Keeps tokens.json, tokens.css and the reference.html DATA palette in sync.
 *
 *   node scripts/sync-tokens.js          rewrite reference.html DATA from tokens.json
 *   node scripts/sync-tokens.js --check  verify only; exit 1 when anything drifted
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const jsonPath = path.join(root, 'tokens.json');
const cssPath = path.join(root, 'tokens.css');
const refPath = path.join(root, 'reference.html');

const tokens = JSON.parse(fs.readFileSync(jsonPath, 'utf8').replace(/^\uFEFF/, ''));
const css = fs.readFileSync(cssPath, 'utf8');
const checkOnly = process.argv.includes('--check');

const normalize = (value) => String(value).toLowerCase().replace(/\s+/g, '');

const problems = [];
const darkStart = css.indexOf('@media (prefers-color-scheme: dark)');
if (darkStart === -1) problems.push('tokens.css has no dark-mode block');

// 1. every token in tokens.json must exist in tokens.css with the same value
for (const mode of ['light', 'dark']) {
  const scope = mode === 'dark' ? css.slice(darkStart) : css.slice(0, darkStart);
  for (const [name, value] of Object.entries(tokens[mode])) {
    const match = scope.match(new RegExp('--' + name + '\\s*:\\s*([^;]+);'));
    if (!match) {
      problems.push(`tokens.css (${mode}) is missing --${name}`);
    } else if (normalize(match[1]) !== normalize(value)) {
      problems.push(`--${name} (${mode}): tokens.json=${value} tokens.css=${match[1].trim()}`);
    }
  }
}

// 2. generate the DATA block for reference.html
const jsString = (value) => "'" + String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
const list = (pairs) =>
  pairs.map(([token, label]) => `    { name: ${jsString(label)}, hex: ${jsString(tokens.light[token])} }`).join(',\n');
const gradientList = (pairs) =>
  pairs.map(([token, label]) => `    { name: ${jsString(label)}, css: ${jsString(tokens.light[token])} }`).join(',\n');
const radiusList = (pairs) =>
  pairs.map(([token, label]) => `    { label: ${jsString(label)}, value: ${jsString(tokens.light[token])} }`).join(',\n');
const shadowList = (pairs) =>
  pairs.map(([token, label]) => `    { label: ${jsString(label)}, value: ${jsString(tokens.light[token])} }`).join(',\n');
const typeList = () =>
  tokens.reference.typeScale
    .map(
      (t) =>
        `    { spec: ${jsString(t.spec)}, size: ${jsString(t.size)}, weight: ${jsString(t.weight)}, tracking: ${jsString(t.tracking)}, lh: ${jsString(t.lh)}, sample: ${jsString(t.sample)} }`
    )
    .join(',\n');

const generated = `// <tokens:begin> — generated from tokens.json by scripts/sync-tokens.js; do not edit by hand
const DATA = {
  neutrals: [
${list(tokens.reference.neutrals)}
  ],
  accents: [
${list(tokens.reference.accents)}
  ],
  gradients: [
${gradientList(tokens.reference.gradients)}
  ],
  typeScale: [
${typeList()}
  ],
  radii: [
${radiusList(tokens.reference.radii)}
  ],
  shadows: [
${shadowList(tokens.reference.shadows)}
  ]
};
// <tokens:end>`;

const ref = fs.readFileSync(refPath, 'utf8');
const startMarker = '// <tokens:begin>';
const endMarker = '// <tokens:end>';
const start = ref.indexOf(startMarker);
const end = ref.indexOf(endMarker);

if (start === -1 || end === -1) {
  problems.push('reference.html is missing the // <tokens:begin> / <tokens:end> markers');
} else {
  const current = ref.slice(start, end + endMarker.length);
  const updated = ref.slice(0, start) + generated + ref.slice(end + endMarker.length);
  if (current !== generated) {
    if (checkOnly) {
      problems.push('reference.html DATA is out of date — run `npm run tokens:sync`');
    } else {
      fs.writeFileSync(refPath, updated);
      console.log('reference.html DATA regenerated from tokens.json');
    }
  }
}

if (problems.length) {
  console.error('Token check failed:');
  problems.forEach((p) => console.error('  - ' + p));
  process.exit(1);
}

console.log(checkOnly ? 'Tokens in sync (tokens.json ↔ tokens.css ↔ reference.html).' : 'Tokens synced.');
