import singularType from './singularType.js';
// import isOnMobileWithTouchScreen from './isOnMobileWithTouchScreen.js';

/**
 * @param {AnyTypeSingularOrPlural} type
 * @param {string} id
 * @returns {string}
 */
export default function generateCrossPlatformLink(type, id) {
  type = singularType(type);

  return `https://listen.tidal.com/${type}/${id}`;
}
