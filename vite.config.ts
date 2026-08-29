import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
    sourcemap: true,
    // Only Vite-generated files live here. Their filenames include a content
    // hash, so the static host can safely cache this directory indefinitely.
    assetsDir: 'assets/v5',
  },
});
