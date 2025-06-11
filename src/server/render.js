/* eslint-env node */
import singularType from '../client/js/helpers/singularType.js';

import { getStaticFileLink } from './static-file-helper.js';

/**
 * Get the SVG string for a specific icon type.
 * @param {('close' | 'explicit' | 'explicitBadge' | 'facebook' | 'link' | 'liveBadge' | 'maximize' | 'messenger' | 'minimize' | 'next' | 'pause' | 'play' | 'previous' | 'replay' | 'share' | 'threeDots' | 'tidalLogo' | 'tidalLongLogo' | 'twitter' | 'videoBadge' | 'upload')} type - The type of the icon.
 * @returns {string} - The SVG string for the icon.
 */
export function generateSVG(type) {
  const pathToIconsSVG = getStaticFileLink('img/icons.svg');

  return `<svg xmlns="http://www.w3.org/2000/svg"><use href="${pathToIconsSVG}#${type}" /></svg>`;
}

const trackJSCode =
  process.env.TRACK_JS_TOKEN && process.env.TRACK_JS_APPLICATION
    ? `
    <script>window._trackJs = {token:'${process.env.TRACK_JS_TOKEN}',application:'${process.env.TRACK_JS_APPLICATION}'}</script>
    <script src=https://cdn.trackjs.com/releases/current/tracker.js></script>
    `.trim()
    : '';

/**
 * @typedef {('playlists' | 'videos' | 'tracks' | 'albums' | 'mix' | 'upload')} TidalItemType
 */

/**
 * @typedef {('playlistsSquare' | 'playlists' | 'videos' | 'tracks' | 'albums')} TidalImageType
 */

/**
 * @typedef {('USER' | 'PUBLIC' | 'EDITORIAL' | 'ARTIST')} PlaylistType
 */

/**
 * @typedef {{ src: string, srcset: string, poster: string, sizes: string }} ImageSet
 */

/**
 * Rakes the `creator` field from a playlist response and gives the string
 * to display in the markup.
 * @param {({ name: String })} creatorObject
 * @param {PlaylistType} playlistType
 * @returns {String}
 */
function getPlaylistCreator(creatorObject, playlistType) {
  function generateArtistString() {
    return creatorObject?.name ?? 'Artist';
  }

  /* eslint default-case: 0 */
  switch (playlistType) {
    case 'EDITORIAL':
      return 'TIDAL';
    case 'PUBLIC':
    case 'USER':
      return 'User';
    case 'ARTIST':
    default:
      return generateArtistString();
  }
}

function escapeHTML(string) {
  const entityMap = {
    '"': '&quot;',
    '&': '&amp;',
    "'": '&#39;',
    '/': '&#x2F;',
    '<': '&lt;',
    '=': '&#x3D;',
    '>': '&gt;',
    '`': '&#x60;',
  };

  return String(string).replace(/[&<>"'`=\/]/g, s => entityMap[s]); // eslint-disable-line no-useless-escape
}

/** @typedef MixImage
 *  @prop {string} url
 *  @prop {number} width
 *  @prop {number} height
 */

/**
 * @param {{ SMALL: MixImage, MEDIUM: MixImage, LARGE: MixImage }} imageObject
 * @returns {ImageSet} - Object with src and srcset
 */
function generateImageSourceAndSourceSetForMix(imageObject) {
  const srcset = [
    `${imageObject.SMALL.url} ${imageObject.SMALL.width}w`,
    `${imageObject.MEDIUM.url} ${imageObject.MEDIUM.width}w`,
    `${imageObject.LARGE.url} ${imageObject.LARGE.width}w`,
  ].join(', ');

  const src = srcset[0];
  const poster = imageObject.LARGE.url;
  const sizes = '100vh';

  return { poster, sizes, src, srcset };
}

/** * @param {String} imageUrl
 * * @returns {ImageSet} - Object with src and srcset
 * */
function generateImageSourceAndSourceSetForUpload(imageUrl) {
  const url = imageUrl ?? 'https://tidal.com/assets/cover-1400-BHdJoN8L.jpg'; // Fallback URL if no imageUrl is provided
  const src = url;
  const poster = url;
  const sizes = '100vh';

  // For uploads, we only have one size?
  const srcset = `${url} 640w`;

  return { poster, sizes, src, srcset };
}

/**
 * @param {String} imageId
 * @param {TidalImageType} type
 * @returns {ImageSet} - Object with src and srcset
 */
function generateImageSourceAndSourceSet(imageId, type) {
  type = type === 'tracks' ? 'albums' : type;

  const SIZES = {
    albums: ['80x80', '160x160', '320x320', '640x640', '1280x1280'], // 1:1
    playlists: [
      '160x107',
      '320x214',
      '480x320',
      '640x428',
      '750x500',
      '1080x720',
    ], // 3:2
    playlistsSquare: [
      '160x160',
      '320x320',
      '480x480',
      '640x640',
      '750x750',
      '1080x1080',
    ], // 1:1
    videos: ['160x90', '320x180', '480x270', '640x360', '800x450', '1280x720'], // 16:9
  };

  // Image size for src, used by browsers not supporting srcset (IE)
  const imgSizeForSrc = 3;

  const imagePath = imageId.replace(/-/g, '/');
  const baseUrl = 'https://resources.tidal.com/images/';
  const src = `${baseUrl}${imagePath}/${SIZES[type][imgSizeForSrc]}.jpg`;
  const sources = Array.from(SIZES[type]).map(size => {
    return `${baseUrl}${imagePath}/${size}.jpg ${size.split('x')[0]}w`;
  });
  const srcset = sources.join(',');
  const poster = sources[sources.length - 1].split(' ')[0]; // Get URL of last item in sources.
  const sizes = '100vh';

  return { poster, sizes, src, srcset };
}

function artistsArrayToLinks(artists) {
  return artists
    ? artists
        .map(
          ({ id, name }) =>
            `<a href="https://tidal.com/artist/${id}" target="_blank">${name}</a>`,
        )
        .join('')
    : undefined;
}

/**
 * @typedef {'tracks'|'videos'|'mix'|'albums'|'playlists'|'upload'} EmbedItemType
 */

/**
 * @typedef MediaInformation
 * @prop {string} title
 * @prop {string} artist
 * @prop {string} album
 * @prop {string} dialogTitle
 * @prop {string} dialogSubtitle
 * @prop {string} artistLinks
 * @prop {ImageSet | undefined} image
 * @prop {string} link
 * @prop {boolean} isExplicit
 * @prop {boolean} isUpload
 * @prop {number} duration
 */

/**
 *
 * @param {EmbedItemType} itemType
 * @param {string} itemId
 * @param {Object} json
 * @returns {MediaInformation}
 */
// eslint-disable-next-line complexity
function formatEmbedDataItem(itemType, itemId, json) {
  let artist = '';

  let title = '';

  let album = '';

  let duration = 30; // Show 30 s as default.

  let imageId;
  /** @type {TidalImageType | undefined} */

  let imageType;

  let artistLinks = json.artists
    ? artistsArrayToLinks(json.artists)
    : json.data?.artist
      ? artistsArrayToLinks([json.data?.artist])
      : undefined;

  if (itemType !== 'mix') {
    artist =
      json.artists && json.artists.length > 0
        ? json.artists.map(a => a.name).join(', ')
        : json.artist;
  }

  let dialogTitle = json.title;

  let dialogSubtitle = artist;

  switch (itemType) {
    case 'albums':
      imageId = json.cover;
      album = json.title;
      imageType = 'albums';
      break;
    case 'mix':
      album = json.title;
      artist = json.subTitle;
      dialogSubtitle = json.subTitle;
      break;
    case 'playlists':
      album = json.title;
      imageId = json.squareImage || json.image;
      artist = getPlaylistCreator(json.creator, json.type);
      dialogSubtitle = getPlaylistCreator(json.creator, json.type);
      artistLinks = artist;
      imageType = json.squareImage ? 'playlistsSquare' : itemType;
      break;
    case 'tracks':
      imageId = json.album.cover;
      title = json.title;
      imageType = 'albums';
      duration = json?.duration ?? 0; // Show full duration length for tracks, updates to real duration or 30 s on playback.
      break;
    case 'upload':
      title = json.data.name;
      dialogTitle = json.data.name;
      artist = json.data.artist?.name;
      dialogSubtitle = artist;
      duration = json.data?.duration ?? 0;
      break;
    case 'videos':
      title = json.title;
      imageId = json.imageId;
      imageType = 'videos';
      duration = json?.duration ?? 0; // Show full duration length for videos
      break;
    default:
      imageId = undefined;
  }

  let image =
    imageId && imageType
      ? generateImageSourceAndSourceSet(imageId, imageType)
      : undefined;

  if (!imageId && !image && itemType === 'mix') {
    image = generateImageSourceAndSourceSetForMix(json.images);
  }
  if (!imageId && !image && itemType === 'upload') {
    image = generateImageSourceAndSourceSetForUpload(json.data.image_url);
  }

  const itemTypeSingular = singularType(itemType);
  const link = `https://tidal.com/${itemTypeSingular}/${itemId}`;
  const isExplicit = json.explicit || json.metadata?.has_explicit_lyrics; // different location fo uploads
  const isUpload = itemType === 'upload' || json.upload;

  return {
    album: escapeHTML(album),
    artist: escapeHTML(artist),
    artistLinks,
    dialogSubtitle: escapeHTML(dialogSubtitle),
    dialogTitle: escapeHTML(dialogTitle),
    duration,
    image,
    isExplicit,
    isUpload,
    link,
    title: escapeHTML(title),
  };
}

/**
 * Returns the TIDAL standard HH:MM:SS formation.
 *
 * @param {!Number} [sec=0]
 * @returns {String}
 */
function humanReadableTime(sec = 0) {
  const h = Math.floor(sec / 3600) % 24;
  const m = Math.floor(sec / 60) % 60;
  const s = sec % 60;

  return [h, m, s]
    .map((v, i) => {
      const isSecond = i === 2;
      const isMinute = i === 1;
      const hoursExist = h > 0;
      const valueCanBePrefixed = v < 10;

      return (isSecond || (isMinute && hoursExist)) && valueCanBePrefixed
        ? `0${v}`
        : v;
    })
    .filter((v, i) => i > 0 || v !== 0)
    .join(':');
}

function getFinishedDialogHTML() {
  return `
  <dialog class="dialog--finished" role="dialog">
    <form method="dialog">
      <button class="button--close-dialog" aria-label="Close dialog">${generateSVG(
        'close',
      )}</button>
    </form>
    <div class="media-information">
      ${generateSVG('tidalLongLogo')}
      <span>Get the full experience for 30 days free.</span>
    </div>
    <div class="lower-part">
      <a href="https://tidal.com/try-now" class="primary external-link" target="_blank">Sign up</a>
      <a href="https://tidal.com/login?autoredirect=true" class="external-link" target="_blank">Log in</a>
    </div>
  </dialog>
  `.trim();
}

function getNostrDialogHTML() {
  return `
  <dialog class="dialog--nostr" role="dialog">
    <form method="dialog">
      <button class="button--close-dialog" aria-label="Close dialog">${generateSVG(
        'close',
      )}</button>
    </form>
    <p>Hello nostr user! Linking your pubkey to TIDAL grants full playback.</p>
    <div class="buttons">
      <nostr-login-button>
        <button class="button button--login">
          <span>Login</span>
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_l9ve{animation:spinner_rcyq 1.2s cubic-bezier(0.52,.6,.25,.99) infinite}.spinner_cMYp{animation-delay:.4s}.spinner_gHR3{animation-delay:.8s}@keyframes spinner_rcyq{0%{transform:translate(12px,12px) scale(0);opacity:1}100%{transform:translate(0,0) scale(1);opacity:0}}</style><path class="spinner_l9ve" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z" transform="translate(12, 12) scale(0)"/><path class="spinner_l9ve spinner_cMYp" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z" transform="translate(12, 12) scale(0)"/><path class="spinner_l9ve spinner_gHR3" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z" transform="translate(12, 12) scale(0)"/></svg>
        </button>
      </nostr-login-button>
      <a href="https://account.tidal.com" target="_blank" class="button button--connect">Connect pubkey</a>
    </div>
  </dialog>
  `.trim();
}

/**
 * Generates the HTML for the share dialog.
 * @param {string} shareLink - The link to be shared.
 * @returns {string} - The HTML string for the share dialog.
 * */
function getShareDialogHTML(shareLink) {
  return `
    <dialog class="dialog--share" role="dialog">
      <form method="dialog">
        <button class="button--close-dialog" aria-label="Close dialog">${generateSVG(
          'close',
        )}</button>
      </form>
      <div class="media-information">
        <span class="successful-copy-message">Copied to clipboard</span>
        <span class="failed-copy-message">Failed copying to clipboard</span>
      </div>
      <div class="share-buttons">
        <a href="${shareLink}" class="" target="_blank">
          ${generateSVG('tidalLogo')}
         <div class="external-link">Play on TIDAL</div>
        </a>
        <button class="share-button--link" aria-label="Copy link to clipboard">
          ${generateSVG('link')}
          <div>Copy link</div>
        </button>
      </div>
    </dialog>
  `.trim();
}

function getMediaInformationHTML({
  album,
  artist,
  artistLinks,
  isExplicit,
  isUpload,
  link,
  title,
}) {
  let topHeader = '';

  if (album) {
    topHeader = `<h1 class="media-album" title="Album: ${album}"><a href="${link}" target="_blank">${album}</a></h1>`;
  } else {
    topHeader = `<h1 class="media-title" title="Track: ${title}">${title}</h1>`;
  }

  return `
    <div class="media-information ui-hide-cleaning-victim">
      <header>
      ${topHeader}
      ${isUpload ? '<i class="badge upload" title="Uploaded">' + generateSVG('upload') + '</i>' : ''}
      ${isExplicit ? '<i class="badge" title="Explicit">' + generateSVG('explicit') + '</i>' : ''}
      </header>
      <span class="media-artist" title="Artist: ${artist}">${
        artistLinks || artist
      }</span>
    </div>
  `;
}

function getPlayerHTML({ duration, isLiveStream, productId, productType }) {
  const progressBarOrLiveIndicator = isLiveStream
    ? `
    <div class="live-indicator-wrapper">
      ${generateSVG('liveBadge')}
    </div>
  `
    : '<tidal-progress-bar></tidal-progress-bar>';

  return `
    <div class="player ui-hide-cleaning-victim">
      <div class="progress-bar-wrapper">
        <tidal-current-time></tidal-current-time>
        ${progressBarOrLiveIndicator}
        <tidal-duration-time>${duration}</tidal-duration-time>
      </div>
      <button class="more-button" aria-label="Show more options">
        ${generateSVG('threeDots')}
      </button>
      <button class="previous-track" aria-label="Play previous track">
        ${generateSVG('previous')}
      </button>
      <button class="next-track" aria-label="Play next track">
        ${generateSVG('next')}
      </button>
      <button class="toggle-fullscreen" aria-label="Toggle fullscreen">
        <span class="fullscreen-icon maximize-icon">${generateSVG(
          'maximize',
        )}</span>
        <span class="fullscreen-icon minimize-icon">${generateSVG(
          'minimize',
        )}</span>
      </button>
      <tidal-play-trigger tabindex="1" product-id=${productId} product-type=${productType}>
        <i class="playback-state-icon">
          <span class="play-icon">${generateSVG('play')}</span>
          <span class="pause-icon">${generateSVG('pause')}</span>
        </i>
      </tidal-play-trigger>
    </div>
  `;
}

function getTopRightIconsHTML() {
  return `
  <div class="top-right-icons ui-hide-cleaning-victim">
    <a href="https://tidal.com" target="_blank" class="tidal-logo" aria-label="Visit TIDAL">
      ${generateSVG('tidalLongLogo')}
    </a>
  </div>
  `;
}

function assumeItemTypeFromObject(item) {
  // Not all places have isrc and not all url... this should cover all cases.
  return 'isrc' in item || ('url' in item && item.url.indexOf('/track/') !== -1)
    ? 'tracks'
    : 'videos';
}

/**
 * @param {Object} itemsJson
 * @param {EmbedItemType} parentItemType
 */
function generateMediaItemListHTML(itemsJson, parentItemType, options) {
  try {
    const { renderThumbnails } = options;

    const listItems = itemsJson
      ? itemsJson
          .map((item, i) => {
            const type = assumeItemTypeFromObject(item);
            const productType = type.slice(0, -1);
            const version = item.version ? ` (${item.version})` : '';
            const streamReady = Boolean(item.streamReady);

            const index =
              parentItemType === 'playlists' ||
              parentItemType === 'mix' ||
              !item.trackNumber
                ? i + 1
                : item.trackNumber;

            // For albums, only list !main type artists to save space on mobile.
            const mainArtistName = item.artists.filter(
              a => a.type === 'MAIN',
            )[0].name;
            const artistsThatAreNotMain = item.artists
              ? item.artists.filter(a => a.name !== mainArtistName)
              : [];
            const artists =
              parentItemType === 'albums'
                ? artistsArrayToLinks(artistsThatAreNotMain)
                : artistsArrayToLinks(item.artists);

            const duration = humanReadableTime(item.duration);

            const maybeVideoBadge =
              productType === 'video'
                ? `<span slot="video-badge">${generateSVG('videoBadge')}</span>`
                : '';
            const maybeExplicitBadge = item.explicit
              ? `<span slot="explicit-badge"><i class="badge" title="Explicit">${generateSVG('explicit')}</i></span>`
              : '';
            const maybeUploadBadge = item.upload
              ? `<span slot="upload-badge"><i class="badge upload" title="Uploaded">${generateSVG('upload')}</i></span>`
              : '';

            let maybeThumbnail = '';

            if (renderThumbnails && productType === 'video') {
              const { sizes, src, srcset } = generateImageSourceAndSourceSet(
                item.imageId,
                'videos',
              );

              maybeThumbnail = `<img src="${src}" slot="thumbnail" srcset="${srcset}" sizes="${sizes}" crossorigin="anonymous">`;
            }

            return `
        <list-item tabindex="1" role="listitem" product-id="${
          item.id
        }" product-type="${productType}" ${
          !streamReady ? 'disabled="disabled"' : ''
        }>
          <span slot="index">${index}</span>
          ${maybeThumbnail}
          <span slot="play-icon">${generateSVG('play')}</span>
          <span slot="pause-icon">${generateSVG('pause')}</span>
          ${maybeVideoBadge}
          ${maybeUploadBadge}
          ${maybeExplicitBadge}
          <span slot="title">${item.title + version}</span>
          <span slot="artist">${artists}</span>
          <time slot="duration">${duration}</time>
        </list-item>
      `.trim();
          })
          .join('')
      : '';

    return `
      <div class="media-item-list-wrapper">
        <media-item-list role="list">${listItems}</media-item-list>
      </div>
    `.trim();
  } catch (e) {
    console.error(e);
  }
}

/**
 * @param {Object} options
 * @param {boolean} options.isCollection
 * @param {boolean} options.isCollectionWithOnlyVideos
 * @param {boolean} options.isVideo
 * @param {MediaInformation['image']} options.image
 * @param {MediaInformation['album']} options.album
 * @param {MediaInformation['artist']} options.artist
 * @param {import('./handler.js').Layout} options.layout
 */
function generateImageryHoldersHTML({
  album,
  artist,
  image,
  isCollection,
  isCollectionWithOnlyVideos,
  isVideo,
  layout,
}) {
  const isAudio = !isVideo && !isCollectionWithOnlyVideos;

  const altText = `Cover art for album ${album} by ${artist}`;
  const emptySquareSVG =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48L3N2Zz4=';
  const imageSource = image ? image.src : emptySquareSVG;
  const imageSourceSet = image ? image.srcset : '';

  let sizesAttribute = image ? image.sizes : '';

  if (isCollection && layout !== 'gridify') {
    sizesAttribute = '120px';
  }

  const figureClasses = [
    'imagery-holder',
    'imagery-holder--audio',
    imageSource === emptySquareSVG ? 'show-fallback-image' : '',
  ].join(' ');

  const coverHTML = `
    <figure class="${figureClasses}">
      <img class="cover-art" src="${imageSource}" srcset="${imageSourceSet}" sizes="${sizesAttribute}" alt="${altText}" crossorigin="anonymous">
    </figure>
  `;

  const videoClasses = [
    'imagery-holder',
    'imagery-holder--video',
    `${isAudio ? 'hidden' : ''}`,
  ].join(' ');

  const videoHTML = `
    <figure class="${videoClasses}">
      <tidal-video-view id="video-player"></tidal-video-view>
    </figure>
  `;

  return coverHTML + videoHTML;
}

/**
 * @param {Object} options
 * @param {MediaInformation} options.mediaInformation
 * @param {string | undefined} options.mediaItemListHTML
 * @param {import('./handler.js').Layout} options.layout
 * @param {string} options.itemId
 * @param {EmbedItemType} options.itemType
 * @param {String} options.firstItemImageId
 * @param {String} options.country
 * @param {boolean} options.isCollectionWithOnlyVideos
 * @param {boolean} options.renderThumbnails
 * @param {boolean} options.disableAnalytics
 * @param {boolean} options.isLiveStream
 * @param {boolean} options.limitedLiveStreamPreview
 * @param {boolean} options.coverInitially
 */
// eslint-disable-next-line complexity
function generatePageHTML(options) {
  const {
    country,
    coverInitially,
    disableAnalytics,
    firstItemImageId,
    isCollectionWithOnlyVideos,
    isLiveStream,
    itemId,
    itemType,
    layout,
    mediaInformation,
    mediaItemListHTML,
    renderThumbnails,
  } = options;

  const { album, artist, artistLinks, isExplicit, isUpload, link, title } =
    mediaInformation;

  const isCollection =
    itemType === 'playlists' || itemType === 'albums' || itemType === 'mix';
  const isVideo = itemType === 'videos';

  // Default: Playlist collage
  let image = mediaInformation.image;

  // Use image from first video if playlist with only videos and thumbnails=true
  if (isCollectionWithOnlyVideos && renderThumbnails && firstItemImageId) {
    image = generateImageSourceAndSourceSet(firstItemImageId, 'videos');
  }

  const imageryHoldersHTML = generateImageryHoldersHTML({
    album,
    artist,
    image,
    isCollection,
    isCollectionWithOnlyVideos,
    isVideo,
    layout,
  });

  const appJSSrc = getStaticFileLink('js/app.js');

  const embedClasses = [
    `embed-media-type--${itemType}`,
    isCollection ? 'embed-media-type--is-collection' : '',
    isCollectionWithOnlyVideos
      ? 'embed-media-type--is-collection--only-videos'
      : '',
    isLiveStream ? 'embed-media-type--is-live-stream' : '',
  ].join(' ');

  const layoutClasses = [
    `media-type--${itemType}`,
    isCollection ? 'media-type--is-collection' : '',
    isCollectionWithOnlyVideos ? 'media-type--is-collection--only-videos' : '',
  ].join(' ');

  const mediaInformationHTML = getMediaInformationHTML({
    album,
    artist,
    artistLinks,
    isExplicit,
    isUpload,
    link,
    title,
  });

  const maybeExplicitBadge = isExplicit
    ? `
    <figure class=floating-explicit-badge>
      <i class="badge" title="Explicit">
        ${generateSVG('explicit')}
      </i>
    </figure>
  `
    : '';

  const mainCSSHref = getStaticFileLink('css/main.css');
  const gridAdditionsCSSHref = getStaticFileLink('css/grid-additions.css');
  const listItemCSSHref = getStaticFileLink('css/list-item.css');

  const includeGridStyles =
    layout === 'gridify' || isCollectionWithOnlyVideos || coverInitially;

  const maybePreloadGridAdditionsStyles = includeGridStyles
    ? `<link rel=preload href="${gridAdditionsCSSHref}" as=style>`
    : '';
  const maybePreloadListItemStyles = isCollection
    ? `<link rel=preload href="${listItemCSSHref}" as=style>`
    : '';

  const maybeIncludeGridAdditionsStyles = includeGridStyles
    ? `<link rel=stylesheet href="${gridAdditionsCSSHref}">`
    : '';

  const maybeIncludeMediaListItemTemplates = isCollection
    ? `
    <template id="wc-media-item-list">
      <slot></slot>
    </template>
    <template id="wc-list-item">
      <link rel="stylesheet" href="${listItemCSSHref}">
      <div class="index-col">
        <slot name="index"></slot>
        <tidal-play-trigger aria-role="button">
          <slot name="play-icon"></slot>
          <slot name="pause-icon"></slot>
        </tidal-play-trigger>
      </div>
      <div class="metadata">
        <slot name="thumbnail"></slot>
        <div class="col">
          <div class="row">
            <slot name="title"></slot><slot name="upload-badge"></slot><slot name="explicit-badge"></slot><slot name="video-badge"></slot>
          </div>
          <div class="row">
            <slot name="artist"></slot>
          </div>
        </div>
      </div>
      <slot name="duration"></span>
    </template>
  `
    : '';

  return `
  <!DOCTYPE html>
  <html lang=en>
  <head>
    <link rel=preconnect href=//resources.tidal.com crossorigin>
    <link rel=preload href="${mainCSSHref}" as=style>
    ${maybePreloadGridAdditionsStyles}
    ${maybePreloadListItemStyles}
    <link rel=preload href="${getStaticFileLink(
      'fonts/nationale-medium.woff2',
    )}" as=font>
    <title>TIDAL Embed Player</title>
    <style>
    @font-face {
      font-family:Nationale;
      font-weight:500;
      font-display:fallback;
      src:url('${getStaticFileLink(
        'fonts/nationale-medium.woff2',
      )}') format('woff2'), url('${getStaticFileLink(
        'fonts/nationale-medium.woff',
      )}') format('woff')
    }
    body {opacity:0;transition:opacity 200ms ease}
    </style>
    <style id="svg-fouc">
    list-item svg {
      opacity: 0
    }
    </style>
    <meta charset=utf-8>
    <meta name=theme-color content=#1c1c1c>
    <meta name=viewport content="width=device-width, initial-scale=1">
    <link rel=stylesheet href="${mainCSSHref}">
    ${maybeIncludeGridAdditionsStyles}
    <script>
    window.tidalCountryCode='${country || 'US'}';
    </script>
  </head>
  <body>
    <div class="embed-player initial-state-before-playing ${embedClasses}">
      <figure class=loading-spinner>
        <img src="${getStaticFileLink(
          'img/loader.svg',
        )}" crossorigin="anonymous" alt="Loading spinner...">
      </figure>
      ${getFinishedDialogHTML()}
      ${getNostrDialogHTML()}
      ${getShareDialogHTML(link)}
      ${getTopRightIconsHTML()}
      <audio id=audio-player></audio>
      <main class="layout-type-wrapper ${layoutClasses}">
        <div class=classic-header>
          <div class=left-compartment>
            <tidal-play-trigger product-id=${itemId} product-type=${itemType.slice(
              0,
              -1,
            )}>
              ${imageryHoldersHTML}
            </tidal-play-trigger>
          </div>
          <div class=right-compartment>
            ${mediaInformationHTML}
            ${getPlayerHTML({
              duration: mediaInformation.duration,
              isLiveStream,
              productId: itemId,
              productType: itemType.slice(0, -1),
            })}
          </div>
        </div>
        ${mediaItemListHTML || ''}
        ${maybeExplicitBadge}
      </main>
    </div>
    <script src="${appJSSrc}" type="module"></script>
    ${disableAnalytics ? '' : trackJSCode}
    ${maybeIncludeMediaListItemTemplates}
  </body>
  </html>
  `;
}

function mediaItemIsVideo(mediaItem) {
  return mediaItem.quality !== undefined && mediaItem.isrc === undefined;
}

export const renderError = () => {
  const message = 'Try TIDAL';
  const errorCSSHref = getStaticFileLink('css/error.css');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>TIDAL Embed Player</title>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>.dialog--error {background-image:url('${getStaticFileLink(
        'img/error-background-image.jpg',
      )}')}</style>
      <link rel="stylesheet" href="${errorCSSHref}">
    </head>
    <body>
      <div class="embed-player embed-player--showing-error">
        <div class="top-right-icons">
          <a href="https://tidal.com" target="_blank" class="tidal-logo" aria-label="Visit TIDAL">
            ${generateSVG('tidalLogo')}
          </a>
        </div>
        <dialog open class="dialog--error">
          <a href="https://tidal.com" target="_blank" class="feedback-message">${message}</a>
        </dialog>
      </div>
    </body>
    </html>
  `.trim();
};

/** @typedef RenderEmbedOptions
 * @prop {TidalItemType} options.itemType
 * @prop {object} options.embedItem
 * @prop {object} [options.mediaItems]
 * @prop {boolean} [options.renderThumbnails]
 * @prop {boolean} [options.limitedLiveStreamPreview]
 */

/**
 * @param {import('./handler.js').HandlerOptions & RenderEmbedOptions} options
 */
export const renderEmbed = options => {
  const {
    country,
    coverInitially,
    disableAnalytics,
    embedItem,
    itemId,
    itemType,
    layout,
    limitedLiveStreamPreview = false,
    mediaItems,
    renderThumbnails = false,
  } = options;

  const itemTypesWithMediaItemList = ['playlists', 'albums', 'mix'];
  const mediaInformation = formatEmbedDataItem(itemType, itemId, embedItem);

  let items = [];

  let mediaItemListHTML;

  let isCollectionWithOnlyVideos = false;

  let firstItemImageId;
  const isLiveStream =
    embedItem.streamType === 'LIVE' || embedItem.type === 'Live Stream';

  if (itemTypesWithMediaItemList.includes(itemType)) {
    // Mix media items are not scoped under an item prop. Limit to 50.
    items = mediaItems.items
      .map(obj => ('item' in obj ? obj.item : obj))
      .slice(0, 50);
    firstItemImageId = items[0].imageId;
    isCollectionWithOnlyVideos = !items
      .map(item => mediaItemIsVideo(item))
      .includes(false);

    const itemListOptions = {
      link: mediaInformation.link,
      renderThumbnails: isCollectionWithOnlyVideos
        ? renderThumbnails
        : undefined,
    };

    mediaItemListHTML = generateMediaItemListHTML(
      items,
      itemType,
      itemListOptions,
    );
  }

  const generatePageHTMLOptions = {
    country,
    coverInitially,
    disableAnalytics,
    duration: embedItem?.duration ?? 0,
    firstItemImageId,
    isCollectionWithOnlyVideos,
    isLiveStream,
    itemId,
    itemType,
    layout,
    limitedLiveStreamPreview,
    mediaInformation,
    mediaItemListHTML,
    renderThumbnails,
  };

  return generatePageHTML(generatePageHTMLOptions);
};
