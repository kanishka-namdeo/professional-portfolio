// playwright.config.ts
// NOTE: webServer uses the next binary directly instead of `pnpm dev` because
// pnpm's verify-deps-before-run hook (auto `pnpm install`) fails in this
// environment on ignored build scripts (esbuild/sharp). Same dev server, just
// invoked directly.
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:3457' },
  webServer: { command: 'npx next dev --port 3457', port: 3457, reuseExistingServer: true, timeout: 60_000 },
});
