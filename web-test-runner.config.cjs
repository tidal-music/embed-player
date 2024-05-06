const testRunner = require('@web/test-runner-playwright');

module.exports = {
  browsers: [testRunner.playwrightLauncher({ product: 'chromium' })],
};
