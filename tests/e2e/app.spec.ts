import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { parseVtt } from '../../src/model';

test('@claim:isolated-demo opens a complete sample in its separate storage namespace', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Filter this sample');
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
  await page.getByRole('button', { name: 'Open an empty viewer' }).click();
  await page.waitForURL('/');
  await expect(page.locator('#demo-banner')).toBeHidden();
  await expect(page.getByText('No captions yet')).toBeVisible();
});

test('@claim:drag-drop opens a dropped local video and WebVTT file together', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('6 cues')).toBeVisible();
  await page.evaluate(async () => {
    const [videoResponse, captionsResponse] = await Promise.all([
      fetch('/assets/harbor-dialogue-demo.webm'),
      fetch('/assets/harbor-dialogue-demo.vtt'),
    ]);
    const transfer = new DataTransfer();
    transfer.items.add(new File([await videoResponse.blob()], 'dropped-harbor.webm', { type: 'video/webm' }));
    transfer.items.add(new File([await captionsResponse.blob()], 'dropped-captions.vtt', { type: 'text/vtt' }));
    window.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: transfer }));
  });
  await expect(page.getByText('dropped-harbor.webm')).toBeVisible();
  await expect(page.getByText('dropped-captions.vtt')).toBeVisible();
  await expect(page.getByText('6 cues')).toBeVisible();
  await expect(page.locator('#video')).toBeVisible();
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

test('@claim:cue-classification labels common environmental cues and keeps corrections editable', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('6 cues')).toBeVisible();
  await expect(page.locator('#cue-summary')).toContainText('3 dialogue');
  await expect(page.locator('#cue-summary')).toContainText('3 environmental');
  await expect(page.locator('.effect-row .cue-copy').first()).toHaveText('[WAVES AGAINST THE PIER]');

  await page.getByRole('button', { name: 'Mark cue as dialogue' }).first().click();
  await expect(page.locator('#cue-summary')).toContainText('4 dialogue');
  await expect(page.locator('#cue-summary')).toContainText('2 environmental');
});

test('@claim:seekable-transcript seeks the local video from a timed caption', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('6 cues')).toBeVisible();
  await page.getByRole('button', { name: /Seek to 0:01: Did the ferry/ }).click();
  await expect.poll(() => page.locator('#video').evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThanOrEqual(1.5);
  expect(await page.locator('#video').evaluate((element: HTMLVideoElement) => element.currentTime)).toBeLessThan(2.2);
});

test('@claim:line-replay plays one selected line and stops at its cue end', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('6 cues')).toBeVisible();
  await page.getByRole('button', { name: 'Practice line' }).first().click();
  await page.getByRole('button', { name: 'Replay line' }).click();
  await expect.poll(() => page.locator('#video').evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(1.4);
  await expect(page.getByRole('status')).toContainText('Practice line finished', { timeout: 5000 });
  expect(await page.locator('#video').evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
});

test('@claim:refresh-persistence restores sample cue changes after a refresh', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('6 cues')).toBeVisible();
  await page.getByRole('button', { name: 'Mark cue as dialogue' }).first().click();
  await expect(page.locator('#cue-summary')).toContainText('4 dialogue');
  await page.getByLabel('Dialogue only').check();
  await page.getByRole('button', { name: 'Practice line' }).first().click();
  await page.getByRole('button', { name: 'Mark complete' }).click();
  await page.waitForTimeout(400);
  await page.reload();
  await expect(page.locator('#cue-summary')).toContainText('4 dialogue');
  await expect(page.getByLabel('Dialogue only')).toBeChecked();
  await expect(page.getByRole('button', { name: 'Practiced ✓' }).first()).toBeVisible();
});

test('@claim:caption-size-limit rejects caption files larger than 5 MB with recovery guidance', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('6 cues')).toBeVisible();
  await page.locator('#caption-input').setInputFiles({
    name: 'too-large.vtt',
    mimeType: 'text/vtt',
    buffer: Buffer.alloc((5 * 1024 * 1024) + 1, 'a'),
  });
  await expect(page.getByRole('status')).toContainText('over 5 MB');
  await expect(page.getByRole('status')).toContainText('Choose a smaller WebVTT file');
});

test('@claim:supplied-captions-only uses supplied WebVTT without transcription or caption services', async ({ page }) => {
  const requested: string[] = [];
  page.on('request', (request) => requested.push(request.url()));
  await page.goto('/demo');
  await expect(page.getByText('6 cues')).toBeVisible();
  await expect(page.getByText('The viewer does not transcribe video or retrieve captions from other services.')).toBeVisible();
  expect(requested.some((url) => new URL(url).pathname.endsWith('/harbor-dialogue-demo.vtt'))).toBe(true);
  expect(requested.every((url) => url.startsWith('data:') || new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
});

test('@claim:free-use runs the complete sample without an account or payment step', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('Free to use')).toBeVisible();
  await expect(page.getByText('6 cues')).toBeVisible();
  await page.getByLabel('Dialogue only').check();
  await expect(page.getByText('Environmental cue hidden').first()).toBeVisible();
  await expect(page.getByText(/buy|subscribe|payment/i)).toHaveCount(0);
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

test('operates skip navigation, the sample link, caption mode, and reveal control by keyboard', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();

  await page.getByRole('link', { name: 'Try it with sample data' }).focus();
  await page.keyboard.press('Enter');
  await page.waitForURL('/?demo=1');
  await expect(page.getByText('6 cues')).toBeVisible();

  const dialogueMode = page.getByLabel('Dialogue only');
  await dialogueMode.focus();
  await page.keyboard.press('Space');
  await expect(dialogueMode).toBeChecked();
  const reveal = page.getByRole('button', { name: /Hold to reveal/ });
  await reveal.focus();
  await page.keyboard.down('Space');
  await expect(page.locator('#transcript-list').getByText('[WAVES AGAINST THE PIER]', { exact: true })).toBeVisible();
  await page.keyboard.up('Space');
  await expect(page.getByText('Environmental cue hidden').first()).toBeVisible();
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

test('@claim:webvtt-export downloads parseable corrected and Dialogue only caption files', async ({ page }, testInfo) => {
  await page.goto('/?demo=1');
  await expect(page.getByText('6 cues')).toBeVisible();
  await page.getByRole('button', { name: 'Mark cue as dialogue' }).first().click();
  await expect(page.locator('#cue-summary')).toContainText('4 dialogue');

  const dialogueDownloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export Dialogue only VTT' }).click();
  const dialogueDownload = await dialogueDownloadPromise;
  expect(dialogueDownload.suggestedFilename()).toBe('harbor-dialogue-demo.dialogue-only.vtt');
  const dialoguePath = testInfo.outputPath(dialogueDownload.suggestedFilename());
  await dialogueDownload.saveAs(dialoguePath);

  const correctedDownloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export corrected VTT' }).click();
  const correctedDownload = await correctedDownloadPromise;
  expect(correctedDownload.suggestedFilename()).toBe('harbor-dialogue-demo.corrected.vtt');
  const correctedPath = testInfo.outputPath(correctedDownload.suggestedFilename());
  await correctedDownload.saveAs(correctedPath);

  const dialogue = parseVtt(await readFile(dialoguePath, 'utf8')).cues;
  const corrected = parseVtt(await readFile(correctedPath, 'utf8')).cues;
  expect(dialogue).toHaveLength(4);
  expect(dialogue.some((cue) => cue.text === '[WAVES AGAINST THE PIER]')).toBe(true);
  expect(dialogue.some((cue) => cue.text === '[GULLS CRY IN THE DISTANCE]')).toBe(false);
  expect(corrected).toHaveLength(6);
  expect(corrected.map((cue) => ({ start: cue.start, end: cue.end, rawText: cue.rawText })))
    .toEqual(expect.arrayContaining([
      { start: 0, end: 1.5, rawText: '[WAVES AGAINST THE PIER]' },
      { start: 1.6, end: 3.8, rawText: 'Did the ferry leave already?' },
    ]));
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

test('has no automated accessibility violations in the ready state', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'One axe scan is enough; mobile layout is covered separately.');
  await page.goto('/demo');
  await expect(page.getByText('6 cues')).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('has no automated accessibility violations on the other public routes', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Desktop scans cover static routes; mobile layout has dedicated checks.');
  for (const route of ['/', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, `${route} axe violations`).toEqual([]);
  }
});

test('fits the 390px mobile viewport without horizontal overflow', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile project only.');
  await page.goto('/demo');
  const widths = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.client);
  await expect(page.getByText('6 cues')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Transcript' })).toBeVisible();
});

test('keeps the sample action and three facts in the first 390px mobile screen', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', '390px mobile project only.');
  await page.goto('/');
  const sampleAction = page.getByRole('link', { name: 'Try it with sample data' });
  await expect(sampleAction).toBeVisible();
  const box = await sampleAction.boundingBox();
  expect(box).not.toBeNull();
  expect((box?.y ?? 844) + (box?.height ?? 0)).toBeLessThanOrEqual(844);
  await expect(page.getByRole('list', { name: 'Product facts' })).toContainText('Free to use');
  await expect(page.getByRole('list', { name: 'Product facts' })).toContainText('Files stay in your browser');
  await expect(page.getByRole('list', { name: 'Product facts' })).toContainText('Works offline after the first visit');
});

test('opens the working sample in the first viewport after one click', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await page.waitForURL('/?demo=1');
  await expect(page.getByText('6 cues')).toBeVisible();
  const video = await page.locator('#video').boundingBox();
  expect(video).not.toBeNull();
  expect(video?.y).toBeLessThan(testInfo.project.name === 'mobile' ? 844 : 900);
  await expect(page.locator('.mode-desk')).toBeInViewport();
});

test('allows real pointer clicks on every desktop header link', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Desktop pointer regression only.');
  for (const [label, expected] of [['Demo', '/?demo=1'], ['Privacy', '/privacy/'], ['Terms', '/terms/']] as const) {
    await page.goto('/');
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: label }).click();
    await page.waitForURL(expected);
  }
});

test('moves focus to the new h1 after forward and back route navigation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await page.waitForURL('/?demo=1');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#route-announcer')).toContainText('Focus on dialogue');
});

test('gives every mobile interactive control at least a 44px touch target', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', '390px mobile project only.');
  await page.goto('/demo');
  await expect(page.getByText('6 cues')).toBeVisible();
  const targets = await page.locator('a, button, label.file-button, label.import-button, input[type="radio"] + span').evaluateAll((elements) => elements.map((element) => {
    const box = element.getBoundingClientRect();
    return { label: element.textContent?.trim(), width: box.width, height: box.height };
  }));
  expect(targets.length).toBeGreaterThan(1);
  for (const target of targets.filter((target) => target.label && target.width > 0 && target.height > 0)) {
    expect(target.height, `${target.label} height`).toBeGreaterThanOrEqual(44);
    expect(target.width, `${target.label} width`).toBeGreaterThanOrEqual(44);
  }
});

test('ships the required landing sections and build identifier', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'How it works' })).toBeVisible();
  await expect(page.locator('.step-list > li')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: 'Limits and privacy' })).toBeVisible();
  await expect(page.locator('footer')).toContainText('Built by Param Factory');
  await expect(page.locator('footer')).toContainText('Build 2026.08.29.4');
});

test('sets complete metadata for the demo route', async ({ page }) => {
  await page.goto('/demo');
  await expect(page).toHaveTitle('Demo — Dialog Only Switch');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://dialog-only-switch.sociobot.in/demo');
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://dialog-only-switch.sociobot.in/demo');
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', 'Demo — Dialog Only Switch');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg');
});

test('@claim:offline-reload reloads the complete demo from the service worker while offline', async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Offline shell is verified once in Chromium.');
  await page.goto('/demo');
  await expect(page.getByText('6 cues')).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Filter this sample');
  await expect(page.getByText('6 cues')).toBeVisible();
  await expect(page.locator('#video')).toBeVisible();
  await expect(page.getByText('Offline-ready')).toBeVisible();
  await context.setOffline(false);
});
