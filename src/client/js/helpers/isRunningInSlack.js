import URLOptions from '../url-options.js';

/**
 * Detects if the embed player is running in a Slack context where overlays are prohibited.
 * Checks for explicit URL parameter or Slack referrer domain.
 *
 * @returns {boolean} True if running in Slack context
 */
export default function isRunningInSlack() {
  // Check if hideOverlays or context=slack parameter is set
  if (URLOptions.hideOverlays || URLOptions.context === 'slack') {
    return true;
  }

  // Fallback: Check if parent frame is from Slack domain
  // eslint-disable-next-line no-restricted-globals
  const parentUrl = parent !== window ? document.referrer : '';

  return parentUrl.includes('slack.com');
}
