const { test, expect } = require('@playwright/test');

const pages = [
  'reference.html',
  'examples/account.html',
  'examples/wallet.html',
  'examples/toolbar.html',
  'examples/sidebar.html',
  'examples/liquid-controls.html'
];

const slug = (file) => file.replace(/\.html$/, '').replace(/\//g, '-');

for (const file of pages) {
  test(`${file} — desktop 1280`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/' + file, { waitUntil: 'load' });
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot(`${slug(file)}-desktop.png`, { fullPage: true });
  });
}

test('wallet — mobile 375', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/examples/wallet.html', { waitUntil: 'load' });
  await page.waitForTimeout(400);
  await expect(page).toHaveScreenshot('wallet-mobile.png', { fullPage: true });
});

test('sidebar — collapsed at 375', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/examples/sidebar.html', { waitUntil: 'load' });
  await page.waitForTimeout(200);
  await expect(page).toHaveScreenshot('sidebar-mobile.png', { fullPage: false });
});
