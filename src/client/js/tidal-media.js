import generateCrossPlatformLink from './helpers/generateCrossPlatformLink.js';
import generateShareURL from './helpers/generateShareURL.js';

/**
 * @typedef PlaybackInfoPrePaywallResponse
 * @prop {number} videoId
 * @prop {'PREVIEW'|'FULL'} assetPresentation
 * @prop {'LOW'|'HIGH'} videoQuality
 * @prop {string} manifestMimeType
 * @prop {string} manifest
 * @prop {{ preRollManifestMimeType: string, preRollManifests: string[] }} adInfo
 */

/**
 * @typedef {'video' | 'track'} TidalMediaType
 */

/**
 * @typedef {string} TidalMediaId
 */

/**
 * Basic object to hold the data we need for
 * requesting preview url on the client.
 *
 * @class TidalMedia
 */
class TidalMedia {
  /**
   * Creates an instance of TidalMedia.
   *
   * @param {!TidalMediaType} type - Type of the media item
   * @param {!TidalMediaId} id - ID of the media item
   * @constructor
   */
  constructor(type, id) {
    this.type = type;
    this.id = id;
  }

  /**
   * Compares the media type and id of the instanced object
   * with the passed in TidalMedia instace.
   *
   * @param {!TidalMedia} anotherTidalMedia - TidalMedia instance to match against.
   * @returns {boolean}
   *
   * @memberof TidalMedia
   */
  matches(anotherTidalMedia) {
    return (
      this.id === anotherTidalMedia.id && this.type === anotherTidalMedia.type
    );
  }

  get countryCode() {
    // @ts-expect-error - Global set by Lambda.
    return String(window.tidalCountryCode) || 'US';
  }

  get crossPlatformLink() {
    return generateCrossPlatformLink(this.type, this.id);
  }

  get shareURL() {
    return generateShareURL(this.type, this.id);
  }

  get tidalProtocolURL() {
    return `tidal://${this.type}/${this.id}`;
  }
}

export default TidalMedia;
