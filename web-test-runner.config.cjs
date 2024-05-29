const testRunner = require('@web/test-runner-playwright');

module.exports = {
  browsers: [testRunner.playwrightLauncher({ product: 'chromium', launchOptions: { executablePath: '/home/runner/.cache/ms-playwright/chromium-1117/chrome-linux/chrome' } })],
};
