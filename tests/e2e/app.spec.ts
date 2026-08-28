import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('loads sample captions, filters cues, and supports practice', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Hear the line');
  await page.getByRole('button', { name: 'Try sample captions' }).click();
  await expect(page.getByText('4 cues')).toBeVisible();
  await expect(page.locator('#transcript-list').getByText('[WAVES BREAKING]', { exact: true })).toBeVisible();

  await page.getByLabel('Dialogue only').check();
  await expect(page.getByText('Environmental cue hidden').first()).toBeVisible();
  await page.keyboard.down('r');
  await expect(page.locator('#transcript-list').getByText('[WAVES BREAKING]', { exact: true })).toBeVisible();
  await page.keyboard.up('r');

  await page.getByRole('button', { name: 'Practice line' }).first().click();
  await expect(page.getByRole('heading', { name: 'Selected dialogue' })).toBeVisible();
  await page.getByRole('button', { name: 'Mark complete' }).click();
  await expect(page.getByRole('button', { name: 'Practiced ✓' }).first()).toBeVisible();
});

test('opens a real browser-generated local video file', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'The local-media path is verified once in Chromium.');
  await page.goto('/');
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
  await page.getByRole('button', { name: 'Try sample captions' }).click();
  await page.waitForTimeout(400);
  await page.reload();
  await expect(page.getByText('4 cues')).toBeVisible();
  await expect(page.getByRole('status')).toContainText('Restored sample-coast.vtt');
});

test('has no serious accessibility violations in the ready state', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'One axe scan is enough; mobile layout is covered separately.');
  await page.goto('/');
  await page.getByRole('button', { name: 'Try sample captions' }).click();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});

test('fits the 390px mobile viewport without horizontal overflow', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile project only.');
  await page.goto('/');
  const widths = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.client);
  await page.getByRole('button', { name: 'Try sample captions' }).click();
  await expect(page.getByRole('heading', { name: 'Transcript' })).toBeVisible();
});

test('reloads from the service worker while offline', async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Offline shell is verified once in Chromium.');
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Hear the line');
  await expect(page.getByText('Offline-ready')).toBeVisible();
  await context.setOffline(false);
});
