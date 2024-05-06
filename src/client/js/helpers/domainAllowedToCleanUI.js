/**
 * Wether or not to "clean UI" (hide logo and text initially for videos and grids).
 * Return true if in dev mode and tidal.com exists in location hash or if on tidal.com domain that is not embed.stage.
 */
export default function domainAllowedToCleanUI() {
  // eslint-disable-next-line no-restricted-globals
  const parentUrl = parent !== window ? document.referrer : '';
  const domainShardMatchesParentUrl = domainShard =>
    parentUrl.indexOf(domainShard) !== -1;

  return ['tidal.com', 'localhost', '0.0.0.0']
    .map(domainShardMatchesParentUrl)
    .some(Boolean);
}
