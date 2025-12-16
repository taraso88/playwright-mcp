import { defineConfig } from '@playwright/test';
import type { TestOptions } from './tests/fixtures';

export default defineConfig<TestOptions>({
  testDir: './tests/pumb-company-tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'tests/pumb-company-tests/test-results/results.xml' }],
  ],

  projects: [
    { name: 'chrome' },
    ...process.env.MCP_IN_DOCKER ? [{
      name: 'chromium-docker',
      grep: /browser_navigate|browser_click/,
      use: {
        mcpBrowser: 'chromium',
        mcpMode: 'docker' as const,
      },
    }] : [],
  ],
});
