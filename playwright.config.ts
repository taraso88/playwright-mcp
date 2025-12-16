import { defineConfig } from '@playwright/test';
import type { TestOptions } from './tests/fixtures';

export default defineConfig<TestOptions>({
  testDir: './tests',  // Шукаємо ВСІ тести
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list']],
  projects: [{ name: 'chrome' }],
});
