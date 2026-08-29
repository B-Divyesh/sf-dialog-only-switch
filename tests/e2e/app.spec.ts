import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('@claim:isolated-demo opens a complete sample in its separate storage namespace', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Focus on dialogue');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByText('6 cues')).toBeVisible();
  await expect(page.locator('#video')).toBeVisible();
  await page.waitForTimeout(350);
  const records = await page.evaluate(async () => new Promise<{ demo: unknown; real: unknown }>((resolve, reject) => {
    const request = indexedDB.open('dialog-only-switch');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const transaction = request.result.transaction('sessions', 'readonly');
      const store = transaction.objectStore('sessions');
      const demo = store.get('demo:current');
      const real = store.get('current');
      transaction.oncomplete = () => { request.result.close(); resolve({ demo: demo.result, real: real.result }); };
    };
  }));
  expect(records.demo).toMatchObject({ vttName: 'harbor-dialogue-demo.vtt' });
  expect(records.real).toBeUndefined();
  await page.getByLabel('Dialogue only').check();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByLabel('All cues')).toBeChecked();
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.waitForURL('/');
  await expect(page.locator('#demo-banner')).toBeHidden();
  await expect(page.getByText('No captions yet')).toBeVisible();
});

test('@claim:reversible-filter suppresses environmental cues and reveals them while held', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('6 cues')).toBeVisible();
  await expect(page.locator('#transcript-list').getByText('[WAVES AGAINST THE PIER]', { exact: true })).toBeVisible();

  await page.getByLabel('Dialogue only').check();
  await expect(page.getByText('Environmental cue hidden').first()).toBeVisible();
  await page.keyboard.down('r');
  await expect(page.locator('#transcript-list').getByText('[WAVES AGAINST THE PIER]', { exact: true })).toBeVisible();
  await page.keyboard.up('r');

  await page.getByRole('button', { name: 'Practice line' }).first().click();
  await expect(page.getByRole('heading', { name: 'Selected dialogue' })).toBeVisible();
  await page.getByRole('button', { name: 'Mark complete' }).click();
  await expect(page.getByRole('button', { name: 'Practiced ✓' }).first()).toBeVisible();
});

test('@claim:local-only keeps the sample flow on the product origin', async ({ page }) => {
  const requested: string[] = [];
  page.on('request', (request) => requested.push(request.url()));
  await page.goto('/demo');
  await expect(page.getByText('6 cues')).toBeVisible();
  await page.getByLabel('Dialogue only').check();
  await page.getByRole('button', { name: 'Practice line' }).first().click();
  const origins = requested.filter((url) => !url.startsWith('data:')).map((url) => new URL(url).origin);
  expect(origins).not.toHaveLength(0);
  expect([...new Set(origins)]).toEqual(['http://127.0.0.1:4173']);
});

test('operates the demo reset control with the keyboard', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('6 cues')).toBeVisible();
  await page.getByLabel('Dialogue only').check();
  const reset = page.getByRole('button', { name: 'Reset demo' });
  await reset.focus();
  await expect(reset).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('All cues')).toBeChecked();
});

test('@claim:session-export-import downloads and restores the editable session', async ({ page }, testInfo) => {
  await page.goto('/demo');
  await expect(page.getByText('6 cues')).toBeVisible();
  await page.getByLabel('Dialogue only').check();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export session' }).click();
  const download = await downloadPromise;
  const output = testInfo.outputPath('sample.dialog-switch.json');
  await download.saveAs(output);
  const session = JSON.parse(await readFile(output, 'utf8')) as { vttText: string; mode: string };
  expect(session.vttText).toContain('Did the ferry leave already?');
  expect(session.mode).toBe('dialogue');
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Clear saved session' }).click();
  await expect(page.getByText('No captions yet')).toBeVisible();
  await page.locator('#import-input').setInputFiles(output);
  await expect(page.getByText('6 cues')).toBeVisible();
  await expect(page.getByRole('status')).toContainText('Imported');
});

test('@claim:video-not-saved opens a real browser-generated local video without storing it', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'The local-media path is verified once in Chromium.');
  await page.goto('/demo');
  await expect(page.getByText('6 cues')).toBeVisible();
  await page.evaluate(async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 96;
    canvas.height = 54;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas unavailable');
    context.fillStyle = '#17383b';
    context.fillRect(0, 0, canvas.width, canvas.height);
    const stream = canvas.captureStream(10);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks: Blob[] = [];
    recorder.ondataavailable = (event) => chunks.push(event.data);
    const stopped = new Promise<void>((resolve) => { recorder.onstop = () => resolve(); });
    recorder.start();
    context.fillStyle = '#e9ad55';
    context.fillRect(30, 15, 36, 24);
    await new Promise((resolve) => setTimeout(resolve, 350));
    recorder.stop();
    await stopped;
    stream.getTracks().forEach((track) => track.stop());
    const file = new File(chunks, 'classroom-clip.webm', { type: 'video/webm' });
    const transfer = new DataTransfer();
    transfer.items.add(file);
    const input = document.querySelector<HTMLInputElement>('#video-input');
    if (!input) throw new Error('Video input unavailable');
    input.files = transfer.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await expect(page.getByText('classroom-clip.webm')).toBeVisible();
  await expect(page.locator('#video')).toBeVisible();
  await expect(page.getByRole('status')).toContainText('Video ready');
  await page.waitForTimeout(350);
  const session = await page.evaluate(async () => new Promise<unknown>((resolve, reject) => {
    const request = indexedDB.open('dialog-only-switch');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const transaction = request.result.transaction('sessions', 'readonly');
      const record = transaction.objectStore('sessions').get('demo:current');
      transaction.oncomplete = () => { request.result.close(); resolve(record.result); };
    };
  }));
  expect(JSON.stringify(session)).not.toContain('classroom-clip.webm');
});

test('reports invalid captions and restores a saved session', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Persistence and validation are verified once in Chromium.');
  await page.goto('/');
  await page.locator('#caption-input').setInputFiles({
    name: 'wrong-format.vtt',
    mimeType: 'text/vtt',
    buffer: Buffer.from('1\n00:00:00,000 --> 00:00:01,000\nNot WebVTT'),
  });
  await expect(page.getByRole('status')).toContainText('does not begin with WEBVTT');
  await page.goto('/demo');
  await expect(page.getByText('6 cues')).toBeVisible();
  await page.waitForTimeout(400);
  await page.reload();
  await expect(page.getByText('6 cues')).toBeVisible();
  await expect(page.getByRole('status')).toContainText('Demo ready');
});

test('has no serious accessibility violations in the ready state', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'One axe scan is enough; mobile layout is covered separately.');
  await page.goto('/demo');
  await expect(page.getByText('6 cues')).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});

test('fits the 390px mobile viewport without horizontal overflow', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile project only.');
  await page.goto('/demo');
  const widths = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.client);
  await expect(page.getByText('6 cues')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Transcript' })).toBeVisible();
});

test('@claim:offline-reload reloads the complete demo from the service worker while offline', async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Offline shell is verified once in Chromium.');
  await page.goto('/demo');
  await expect(page.getByText('6 cues')).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Focus on dialogue');
  await expect(page.getByText('6 cues')).toBeVisible();
  await expect(page.locator('#video')).toBeVisible();
  await expect(page.getByText('Offline-ready')).toBeVisible();
  await context.setOffline(false);
});
