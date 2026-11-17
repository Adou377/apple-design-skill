#!/usr/bin/env node
'use strict';
/**
 * Runs axe-core in a real Chrome against all six shipped pages.
 * Zero violations is the gate.
 *
 * CHROME_PATH=/path/to/chrome node scripts/test-a11y.js
 */
const fs = require('fs');
const http = require('http');
const path = require('path');
const puppeteer = require('puppeteer-core');

const root = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT || 8139);
const pages = [
  'reference.html',
  'examples/account.html',
  'examples/wallet.html',
  'examples/toolbar.html',
  'examples/sidebar.html',
  'examples/liquid-controls.html'
];
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp'
};

function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const cache = '/root/.cache/puppeteer/chrome';
  if (fs.existsSync(cache)) {
    for (const version of fs.readdirSync(cache)) {
      const candidate = path.join(cache, version, 'chrome-linux64', 'chrome');
      if (fs.existsSync(candidate)) return candidate;
    }
  }
  throw new Error('Chrome not found — set CHROME_PATH');
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const file = path.join(root, urlPath === '/' ? 'index.html' : urlPath);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404);
    res.end('not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
  const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
  const browser = await puppeteer.launch({
    executablePath: chromePath(),
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
    headless: true
  });

  let total = 0;
  const summary = [];
  for (const file of pages) {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(`http://127.0.0.1:${PORT}/${file}`, { waitUntil: 'load' });
    await page.evaluate(axeSource);
    const result = await page.evaluate(
      async (tags) => await axe.run(document, { runOnly: { type: 'tag', values: tags } }),
      TAGS
    );
    for (const violation of result.violations) {
      total += violation.nodes.length;
      console.error(`\n${file} — ${violation.id} (${violation.impact}) ${violation.nodes.length} node(s)`);
      for (const node of violation.nodes.slice(0, 10)) {
        console.error(`  · ${node.target.join(' ')}`);
      }
    }
    if (errors.length) {
      total += errors.length;
      console.error(`\n${file} — JS errors: ${errors.join(' | ')}`);
    }
    summary.push(`${result.violations.length === 0 ? 'PASS' : 'FAIL'}  ${file}`);
    await page.close();
  }

  await browser.close();
  await new Promise((resolve) => server.close(resolve));

  console.log('\n' + summary.join('\n'));
  if (total > 0) {
    console.error(`\n${total} accessibility/JS violation(s).`);
    process.exit(1);
  }
  console.log('\naxe: 0 violations across all pages.');
})().catch((error) => {
  console.error(error);
  server.close();
  process.exit(1);
});
