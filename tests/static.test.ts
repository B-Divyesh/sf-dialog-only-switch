import { readFile } from 'node:fs/promises';
import { expect, test } from 'vitest';

const read = (path: string) => readFile(new URL(path, import.meta.url), 'utf8');

test('ships a declared claim contract with one executable browser regression per claim', async () => {
  const claims = JSON.parse(await read('../.factory/claims.json')) as Array<{ id: string; test: string }>;
  const browserTests = await read('./e2e/app.spec.ts');
  expect(claims.length).toBeGreaterThan(0);
  for (const claim of claims) {
    expect(claim.test).toContain(`@claim:${claim.id}`);
    expect(browserTests.match(new RegExp(`@claim:${claim.id}`, 'g'))).toHaveLength(1);
  }
});

test('ships demo documentation, media, and static-host response policy artifacts', async () => {
  const [demo, vtt, configText, robots, sitemap, notFound, manifestText] = await Promise.all([
    read('../.factory/demo.md'),
    read('../public/assets/harbor-dialogue-demo.vtt'),
    read('../public/staticwebapp.config.json'),
    read('../public/robots.txt'),
    read('../public/sitemap.xml'),
    read('../public/404.html'),
    read('../public/manifest.webmanifest'),
  ]);
  const config = JSON.parse(configText) as { globalHeaders: Record<string, string>; routes: Array<{ route: string; headers?: Record<string, string> }>; mimeTypes: Record<string, string> };
  expect(demo).toContain('demo:current');
  expect(vtt).toContain('WEBVTT');
  expect(config.globalHeaders['Content-Security-Policy']).toContain("frame-ancestors 'none'");
  expect(config.routes.some((route) => route.route === '/assets/*' && route.headers?.['Cache-Control']?.includes('immutable'))).toBe(true);
  expect(config.mimeTypes['.webmanifest']).toBe('application/manifest+json');
  expect(robots).toContain('Sitemap:');
  expect(sitemap).toContain('/demo');
  expect(notFound).toContain('<h1>');
  expect(manifestText).toContain('"start_url": "/?v=2"');
});
