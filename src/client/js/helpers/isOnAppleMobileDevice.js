/**
 * Returns true if user agents (first argument or default to navigator.userAgent)
 * are on iOS.
 *
 * @param {string} userAgent
 * @returns {boolean}
 */
export default function isOnAppleMobileDevice(userAgent = navigator.userAgent) {
  const iPad = /iPad/i.exec(userAgent);
  const iPhone = /iPhone/i.exec(userAgent);

  return Boolean(iPad || iPhone);
}
