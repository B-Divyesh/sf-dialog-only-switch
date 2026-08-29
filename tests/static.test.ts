import { readFile } from 'node:fs/promises';
import { expect, test } from 'vitest';

const read = (path: string) => readFile(new URL(path, import.meta.url), 'utf8');

test('ships a declared claim contract with one executable browser regression per claim', async () => {
  const claims = JSON.parse(await read('../.factory/claims.json')) as Array<{ id: string; test: string }>;
  const browserTests = await read('./e2e/app.spec.ts');
  expect(claims.map(({ id }) => id)).toEqual([
    'isolated-demo',
    'drag-drop',
    'reversible-filter',
    'cue-classification',
    'seekable-transcript',
    'line-replay',
    'refresh-persistence',
    'local-only',
    'video-not-saved',
    'session-export-import',
    'caption-size-limit',
    'supplied-captions-only',
    'offline-reload',
    'free-use',
  ]);
  for (const claim of claims) {
    expect(claim.test).toBe(`npm run test:e2e -- --grep @claim:${claim.id}`);
    expect(browserTests.match(new RegExp(`@claim:${claim.id}`, 'g'))).toHaveLength(1);
  }
});

test('builds the production app before every declared browser claim command', async () => {
  const packageJson = JSON.parse(await read('../package.json')) as { scripts: Record<string, string> };
  expect(packageJson.scripts['test:e2e']).toMatch(/^npm run build && playwright test$/);
  expect(packageJson.scripts.test).toContain('npm run test:e2e');
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
  expect(manifestText).toContain('"start_url": "/?v=3"');
});

test('ships the complete landing skeleton, 44px target rules, and no nested complementary landmark', async () => {
  const [app, styles] = await Promise.all([read('../src/main.ts'), read('../src/styles.css')]);
  expect(app).toContain('Try it with sample data');
  expect(app).toContain('aria-label="Product facts"');
  expect(app).toContain('id="how-title">How it works');
  expect(app).toContain('id="limits-title">Limits and privacy');
  expect(app).toContain('Build ${BUILD_ID}');
  expect(app).not.toContain('<aside');
  expect(styles).toMatch(/\.brand \{ min-height: 44px/);
  expect(styles).toMatch(/\.mini-button \{ min-height: 44px/);
});

test('ships route-specific canonical, social, and favicon metadata', async () => {
  const [root, privacy, terms, notFound, app] = await Promise.all([
    read('../index.html'),
    read('../public/privacy/index.html'),
    read('../public/terms/index.html'),
    read('../public/404.html'),
    read('../src/main.ts'),
  ]);
  for (const html of [root, privacy, terms, notFound]) {
    expect(html).toContain('rel="canonical"');
    expect(html).toContain('rel="icon" href="/favicon.svg"');
    expect(html).toContain('rel="apple-touch-icon" href="/apple-touch-icon.png"');
    expect(html).toContain('property="og:title"');
    expect(html).toContain('property="og:url"');
    expect(html).toContain('name="twitter:title"');
    expect(html).toContain('name="twitter:description"');
  }
  expect(app).toContain("const canonical = 'https://dialog-only-switch.sociobot.in/demo'");
});

test('records a complete landing-page copy audit with no word-count or banned-word flags', async () => {
  const audit = await read('../.factory/copy-audit.md');
  expect(audit).toContain('## Landing page — complete sentence inventory');
  expect(audit).toContain('Dynamic status and error copy');
  expect(audit).toContain('Flagged sentences: **0**');
  expect(audit).not.toMatch(/\|\s*(?:Over 22 words|Banned word)\s*\|/i);
  expect((audit.match(/\| Pass \|/g) ?? []).length).toBeGreaterThanOrEqual(30);
});

test('declares no Azure Static Web Apps route hidden by an earlier wildcard', async () => {
  const config = JSON.parse(await read('../public/staticwebapp.config.json')) as {
    routes: Array<{ route: string }>;
  };

  for (const [laterIndex, later] of config.routes.entries()) {
    const earlierRoutes = config.routes.slice(0, laterIndex);
    const shadowingRoute = earlierRoutes.find(({ route }) => {
      if (!route.endsWith('*')) return route === later.route;
      return later.route.startsWith(route.slice(0, -1));
    });

    expect(
      shadowingRoute,
      `${later.route} is unreachable behind earlier route ${shadowingRoute?.route}`,
    ).toBeUndefined();
  }
});
