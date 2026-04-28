import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const loadEnvFile = (fileName: string) => {
  const envFile = path.resolve(__dirname, fileName);
  if (!fs.existsSync(envFile)) return;

  fs.readFileSync(envFile, 'utf-8')
    .split('\n')
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eq = trimmed.indexOf('=');
      if (eq === -1) return;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim();
      if (key && !(key in process.env)) process.env[key] = val;
    });
};

// Load the primary e2e env first, then backfill any missing vars from the
// legacy auth/rating test env so older specs still have the credentials they expect.
loadEnvFile('.env.test');
loadEnvFile('.env.testRatingAuth');

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 0,
  timeout: 30000,
  use: {
    baseURL: process.env.TEST_BASE_URL ?? 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
