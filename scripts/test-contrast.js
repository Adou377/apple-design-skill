#!/usr/bin/env node
'use strict';
/**
 * WCAG contrast checks for every text/surface pair defined in tokens.json.
 * Normal text needs 4.5:1, large text and non-text UI need 3.0:1.
 */
const fs = require('fs');
const path = require('path');

const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'tokens.json'), 'utf8'));

function parseColor(input) {
  const value = String(input).trim().toLowerCase();
  const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/);
  if (hex) {
    const raw = hex[1].length === 3 ? hex[1].split('').map((c) => c + c).join('') : hex[1];
    return { r: parseInt(raw.slice(0, 2), 16), g: parseInt(raw.slice(2, 4), 16), b: parseInt(raw.slice(4, 6), 16), a: 1 };
  }
  const rgb = value.match(/^rgba?\(([^)]+)\)$/);
  if (rgb) {
    const parts = rgb[1].split(',').map((n) => parseFloat(n));
    return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
  }
  throw new Error('Unsupported color: ' + input);
}

function over(fg, bg) {
  if (fg.a === 1) return fg;
  return {
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1
  };
}

function luminance(c) {
  const channel = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b);
}

function contrast(fg, bg) {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const pairs = [
  // [foreground, background, minimum ratio, label]
  ['text', 'bg', 4.5, '正文 / 页面底色'],
  ['text', 'surface', 4.5, '正文 / 表面'],
  ['text-body', 'bg', 4.5, '长正文 / 页面底色'],
  ['text-body', 'surface', 4.5, '长正文 / 表面'],
  ['text-2', 'bg', 4.5, '次级 / 页面底色'],
  ['text-2', 'surface', 4.5, '次级 / 表面'],
  ['text-caption', 'bg', 4.5, '说明文字 / 页面底色'],
  ['text-caption', 'surface', 4.5, '说明文字 / 表面'],
  ['accent-link', 'surface', 4.5, '链接文字 / 表面'],
  ['accent-link', 'bg', 4.5, '链接文字 / 页面底色'],
  ['danger-fg', 'surface', 4.5, '破坏性文字 / 表面'],
  ['danger-fg', 'bg', 4.5, '破坏性文字 / 页面底色'],
  ['text-3', 'surface', 3.0, '三级（仅大号）/ 表面'],
  ['text-3', 'bg', 3.0, '三级（仅大号）/ 页面底色'],
  ['link', 'surface', 3.0, '链接（大号/非文本）/ 表面'],
  ['accent', 'surface', 3.0, '主操作 / 焦点环（非文本/大字）']
];

const layeredPairs = [
  ['success-fg', 'success-bg', 4.5, '成功文字 / 成功浅底'],
  ['heat-ink', 'heat-bg', 4.5, '热度文字 / 热度浅底']
];

const failures = [];
const rows = [];

function run(mode) {
  // dark mode inherits any token it does not override
  const t = { ...tokens.light, ...tokens[mode] };
  const base = { surface: parseColor(t.surface), bg: parseColor(t.bg) };
  const seen = new Set();
  for (const [fgName, bgName, min, label] of pairs) {
    if (seen.has(label)) continue;
    seen.add(label);
    const fg = parseColor(t[fgName]);
    const bg = parseColor(t[bgName]);
    const ratio = contrast(over(fg, bg), bg);
    rows.push([mode, label, ratio.toFixed(2), min]);
    if (ratio < min) failures.push(`${mode}: ${label} = ${ratio.toFixed(2)}:1 (< ${min}:1)`);
  }
  for (const [fgName, bgToken, min, label] of layeredPairs) {
    const bg = over(parseColor(t[bgToken]), base.surface);
    const ratio = contrast(over(parseColor(t[fgName]), bg), bg);
    rows.push([mode, label, ratio.toFixed(2), min]);
    if (ratio < min) failures.push(`${mode}: ${label} = ${ratio.toFixed(2)}:1 (< ${min}:1)`);
  }
}

run('light');
run('dark');

for (const [mode, label, ratio, min] of rows) {
  console.log(`${ratio.padStart(5)}:1  min ${min.toFixed(1)}  [${mode}] ${label}`);
}

if (failures.length) {
  console.error('\nContrast failures:');
  failures.forEach((f) => console.error('  - ' + f));
  process.exit(1);
}
console.log(`\nAll ${rows.length} token contrast pairs pass.`);
