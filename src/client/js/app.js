import {
  events as playerSdkEvents,
  setCredentialsProvider,
} from '@tidal-music/player-web-components';

import DialogController from './dialog-controller.js';
import DOMRefs from './dom-refs.js';
import { $, $$ } from './fake-query.js';
import {
  domainAllowedToCleanUI,
  embedIsType,
  getTidalMediaFromURL,
  isOnMobileWithTouchScreen,
} from './helpers/index.js';
import MessageBridge from './message-bridge.js';
import { showNostrDialog } from './nostr.js';
import { defaultCredentialsProvider } from './playback/auth-provider.js';
import ShareController from './share-controller.js';
import TidalMedia from './tidal-media.js';
import UIHideController from './ui-hide-controller.js';
import URLOptions from './url-options.js';

const uiHideController = new UIHideController();
const messageBridge = new MessageBridge();

let embedWasNotGridBeforeFullscreen;

let currentTidalMedia;

let currentState;

/*
  Used to cancel touchend event handler if user triggered touchmove. (Happens when scrolling)
 */
const touchState = {
  movedBeforeEnd: false,
};

/**
 * @typedef {('playlists' | 'videos' | 'tracks' | 'albums'| 'mix')} TidalMediaType
 */

function switchToVideoMode() {
  DOMRefs.imageryHolderAudio?.classList.add('hidden');
  DOMRefs.imageryHolderVideo?.classList.remove('hidden');
}

function switchToAudioMode() {
  DOMRefs.imageryHolderAudio?.classList.remove('hidden');
  DOMRefs.imageryHolderVideo?.classList.add('hidden');
}

function handlePlaybackStop() {
  DOMRefs.playPauseButton?.setAttribute('aria-label', 'Play');
  DOMRefs.embedWrapper?.classList.remove('media-is-playing');
}
/**
 *
 * @param {TidalMedia} tidalMedia
 */
function assignMediaProductToPlayTriggers({ id, type }) {
  const { coverArtPlayTrigger, playPauseButton } = DOMRefs;

  [playPauseButton, coverArtPlayTrigger].forEach(playTrigger => {
    playTrigger?.setAttribute('product-id', id);
    playTrigger?.setAttribute('product-type', type);
  });
}

/**
 * Find the artist of the currently playing item media and sets the title and text content
 * of the media information element to that artist.
 */
function updateCurrentMediaArtistInDOM() {
  /* noop for now, as we want to keep the artist/creator of the collection
  const artistSlot =
    DOMRefs.mediaItemList?.currentItem?.querySelector('[slot="artist"]');

  if (artistSlot instanceof HTMLElement) {
    const artist = artistSlot.textContent;

    const { classicHeaderArtist } = DOMRefs;

    if (classicHeaderArtist) {
      classicHeaderArtist.setAttribute('title', `Artist: ${artist}`);

      for (const dynamicArtist of classicHeaderArtist.querySelectorAll(
        '.dynamic-artist',
      )) {
        dynamicArtist.remove();
      }

      // Remove playlist creator and show currently playing song artist.
      if (
        embedIsType('playlist') &&
        classicHeaderArtist.childNodes[0] instanceof Text
      ) {
        classicHeaderArtist.innerHTML = '';
      }

      const artists = [...artistSlot.querySelectorAll('a')].reduce(
        (frag, a) => {
          const anchor = /** @type {HTMLAnchorElement} * / (a.cloneNode(true));

          anchor.classList.add('dynamic-artist');
          frag.appendChild(anchor);

          return frag;
        },
        new DocumentFragment(),
      );

      classicHeaderArtist.appendChild(artists);
    }
  }*/
}

function updateCurrentMediaTitleInDOM({ tidalMedia, title }) {
  const { classicHeaderTitle } = DOMRefs;

  if (classicHeaderTitle) {
    classicHeaderTitle.innerHTML = `<a href="${tidalMedia.crossPlatformLink}" target="_blank">${title}</a>`;
    classicHeaderTitle.setAttribute('title', `Track: ${title}`);
  }
}

/**
 * Handle the onplay event on audio playback.
 *
 * Adds the "playing" class the the correct media item list if available.
 *
 * Also puts the 'media-is-playing' class on embedWrapper, and
 * removes initial-state-before-playing if available. (That class
 * is needed since pause state is a quantum state; paused state
 * when not having played before is different paused after something
 * has played)
 */
function handlePlaybackStart() {
  DialogController.close('finished');

  DOMRefs.playPauseButton?.setAttribute('aria-label', 'Pause');

  const floatingExplicitBadge = document.querySelector(
    '.floating-explicit-badge',
  );

  if (floatingExplicitBadge) {
    floatingExplicitBadge.remove();
  }

  if (URLOptions.coverInitially) {
    DOMRefs.embedWrapper?.classList.remove('gridify-wrapper');
    DOMRefs.layoutTypeWrapper?.classList.remove('gridify');
    DOMRefs.embedWrapper?.classList.remove('media-item-list--hidden');
  }

  if (embedIsType('collection')) {
    updateStateOfNextAndPrevButtons();

    if (DOMRefs.mediaItemList.currentItem) {
      // Make sure media information links and texts update for new track titles and artist when progressing through collections.
      updateCurrentMediaTitleInDOM({
        tidalMedia: currentTidalMedia,
        title:
          DOMRefs.mediaItemList?.currentItem?.querySelector('[slot="title"]')
            ?.textContent ?? '',
      });

      updateCurrentMediaArtistInDOM();
    }
  }

  DOMRefs.embedWrapper?.classList.add('media-is-playing');
  DOMRefs.embedWrapper?.classList.remove('initial-state-before-playing');

  messageBridge.requestPauseOfSiblingEmbeds();
}

/**
 * Handles click on the play/pause button in the rows of media item lists.
 *
 * If we click on a currently playing item, we act like the play/pause button
 * in the top player, and toggle playback. Otherwise, we load the item in the
 * player and autiplay it.
 *
 * @param {Element} element
 */
function mediaItemListItemClick(element) {
  const type = /** @type {TidalMediaType} */ (
    element.getAttribute('product-type')
  );
  const id = element.getAttribute('product-id');

  if ((type === 'tracks' || type === 'videos') && id) {
    const singular = type === 'videos' ? 'video' : 'track';

    const mediaItem = new TidalMedia(singular, id);
    const loadedInPlayer = currentTidalMedia.matches(mediaItem);

    if (loadedInPlayer) {
      // @ts-expect-error - Click exists
      DOMRefs.playPauseButton?.click();
    } else {
      assignMediaProductToPlayTriggers(mediaItem);
      // @ts-expect-error - Click exists
      DOMRefs.playPauseButton?.click();
    }
  } else {
    console.error(`data-type of a media list item is incorrect: ${type}`);
  }
}

function handleClickOnExternalLinks() {
  if (currentState === 'PLAYING') {
    // @ts-expect-error - Click exists
    DOMRefs.playPauseButton?.click();
  }
}

function registerExternalLinkClickHandlers() {
  const externalLinks = $$('.external-link');
  const anchorsInMediaInfo = $$('.media-information a');

  if (anchorsInMediaInfo) {
    for (const anchor of anchorsInMediaInfo) {
      anchor.addEventListener(
        'click',
        () => handleClickOnExternalLinks(),
        false,
      );
    }
  }

  if (externalLinks) {
    for (const link of externalLinks) {
      link.addEventListener('click', () => handleClickOnExternalLinks(), false);
    }
  }
}

/**
 * There are cases where an iframe does not allow fullscreen.
 * This adds a class to embedWrapper if we can fullscreen, and also
 * loads the screenfull library.
 *
 * If not; the absence of this class will hide the fullscreen button.
 */
async function checkIfFullscreenEnabled() {
  if (uiHideController.fullscreenEnabled()) {
    DOMRefs.embedWrapper?.classList.add('fullscreen-enabled');

    const { default: screenfull } = await import('screenfull');

    // @ts-expect-error - Screenfull not typed
    window.screenfull = screenfull;

    embedWasNotGridBeforeFullscreen =
      !DOMRefs.layoutTypeWrapper?.classList.contains('gridify');

    screenfull.on('change', () => {
      if (screenfull.isFullscreen) {
        uiHideController.handleEnterFullscreen();
      } else {
        uiHideController.handleExitFullscreen();

        if (embedWasNotGridBeforeFullscreen) {
          DOMRefs.layoutTypeWrapper?.classList.remove('gridify');
        }
      }
    });
  }
}

const shareController = new ShareController();

/**
 * @param {('facebook'|'facebook-messenger'|'twitter'|'link')} variant
 */
function triggerCustomShareIntent(variant) {
  const shareData = shareController.getShareData();

  switch (variant) {
    case 'facebook':
      shareController.openFacebookShareWindow(shareData);
      break;
    case 'facebook-messenger':
      shareController.openFacebookMessengerWindow(shareData);
      break;
    case 'link':
      shareController
        .copyTextToClipboard(shareData.url)
        .then(() => {
          DOMRefs.shareDialog?.classList.add('copy--successful');

          setTimeout(() => {
            DOMRefs.shareDialog?.classList.remove('copy--successful');
            DialogController.close('share');
          }, 1000);
        })
        .catch(err => {
          console.error('Failed to copy text to clipboard:', err);
          DOMRefs.shareDialog?.classList.add('copy--failed');

          setTimeout(() => {
            DOMRefs.shareDialog?.classList.remove('copy--failed');
          }, 5000);
        });
      break;
    case 'twitter':
      shareController.openTwitterShareWindow(shareData);
      break;
    default:
      break;
  }
}

function getAlbumImageSource(options) {
  const { resourceId, size = 640 } = options;
  const path = resourceId.replace(/-/g, '/');

  const albumSizes = [80, 160, 320, 640, 1280];

  const [width, height] = albumSizes.includes(size)
    ? [size, size]
    : [albumSizes[0], albumSizes[0]];

  const imageSource = `https://resources.tidal.com/images/${path}/${width}x${height}.jpg?cors`;

  return imageSource;
}

/**
 *
 * @param {import('@tidal-music/player').MediaProduct} mediaProduct
 */
async function updateMediaSession(mediaProduct) {
  if (!('mediaSession' in navigator)) {
    return;
  }

  const url = new URL(
    `https://api.tidal.com/v1/${mediaProduct.productType}s/${mediaProduct.productId}`,
  );

  // @ts-expect-error - tidalCountryCode global set by Lambda
  url.searchParams.append('countryCode', window.tidalCountryCode);

  const headers = new Headers();

  if (process.env.EMBED_API_TOKEN) {
    headers.append('X-Tidal-Token', process.env.EMBED_API_TOKEN);
  } else {
    console.error(
      'You are running without setting an EMBED_API_TOKEN variable.',
    );
  }

  const response = await fetch(url.toString(), {
    headers,
  });
  const json = await response.json();

  if ('status' in json && json.status === 404) {
    return console.error(
      `Media product with ID ${mediaProduct.productId} not found.`,
    );
    // TODO: Probably upload, should handle that with the data already loaded as this API call will fail.
  }

  const resourceId = json.album?.cover ?? undefined;

  const artist = new Intl.ListFormat(navigator.language, {
    style: 'long',
    type: 'conjunction',
  }).format(json.artists.map(a => a.name));
  const artwork = resourceId
    ? [
        {
          sizes: '80x80',
          src: getAlbumImageSource({ resourceId, size: 80 }),
          type: 'image/jpeg',
        },
        {
          sizes: '160x160',
          src: getAlbumImageSource({ resourceId, size: 160 }),
          type: 'image/jpeg',
        },
        {
          sizes: '320x320',
          src: getAlbumImageSource({ resourceId, size: 320 }),
          type: 'image/jpeg',
        },
        {
          sizes: '640x640',
          src: getAlbumImageSource({ resourceId, size: 640 }),
          type: 'image/jpeg',
        },
      ]
    : undefined;

  navigator.mediaSession.metadata = new MediaMetadata({
    album: json.album?.title ?? undefined,
    artist,
    artwork,
    title: json.title,
  });
}

/**
 * Registers all the required event listeners for
 * both the DOM and the TidalPlayer.
 */
function registerEventListeners() {
  const image = $('.cover-art');

  if (image instanceof HTMLImageElement) {
    if (image.complete) {
      maybeShowFallbackImage();
    } else {
      image.addEventListener('load', () => maybeShowFallbackImage());
    }

    image.addEventListener('error', event => {
      console.error(
        'Showing fallback image because there was an error event on the image element.',
        event,
      );

      showFallbackImage();
    });
  }

  DOMRefs.nextButtonElement?.addEventListener(
    'click',
    () => DOMRefs.mediaItemList?.nextItem?.play(),
    { capture: true, passive: true },
  );
  DOMRefs.prevButtonElement?.addEventListener(
    'click',
    () => DOMRefs.mediaItemList?.previousItem?.play(),
    { capture: true, passive: true },
  );

  $('.share-button--facebook')?.addEventListener('click', () =>
    triggerCustomShareIntent('facebook'),
  );
  $('.share-button--facebook-messenger')?.addEventListener('click', () =>
    triggerCustomShareIntent('facebook-messenger'),
  );
  $('.share-button--twitter')?.addEventListener('click', () =>
    triggerCustomShareIntent('twitter'),
  );
  $('.share-button--link')?.addEventListener('click', () =>
    triggerCustomShareIntent('link'),
  );

  // Element not rendered on TIDAL X Finished Dialog
  if (DOMRefs.replayButtonElement) {
    DOMRefs.replayButtonElement.addEventListener(
      'click',
      () => {
        if (embedIsType('collection')) {
          DOMRefs.mediaItemList?.firstPlayableItem?.play();

          const ol = $('.media-item-list ol');

          if (ol) {
            ol.scrollTop = 0;
          }
        } else {
          // @ts-expect-error - Click exists
          DOMRefs.playPauseButton?.click();
        }
      },
      false,
    );
  }

  $('.more-button')?.addEventListener(
    'click',
    () => shareController.triggerShare(),
    false,
  );

  const toggleFullscreenButton = $('.toggle-fullscreen');

  if (toggleFullscreenButton) {
    toggleFullscreenButton.addEventListener(
      'click',
      () => {
        uiHideController.toggleFullscreen();
      },
      false,
    );
  }

  // Player hooks
  playerSdkEvents.addEventListener('playback-state-change', e => {
    if (e instanceof CustomEvent) {
      /** @type {import('@tidal-music/player').PlaybackStateChange} */
      const event = e;

      currentState = event.detail.state;

      switch (event.detail.state) {
        case 'NOT_PLAYING':
          handlePlaybackStop();
          break;
        case 'PLAYING':
          handlePlaybackStart();
          break;
        default:
          break;
      }
    }
  });

  playerSdkEvents.addEventListener('media-product-transition', e => {
    if (e instanceof CustomEvent) {
      /** @type {import('@tidal-music/player').MediaProductTransition} */
      const event = e;

      currentTidalMedia = new TidalMedia(
        event.detail.mediaProduct.productType,
        event.detail.mediaProduct.productId,
      );

      if (event.detail.mediaProduct.productType === 'video') {
        switchToVideoMode();
      } else {
        switchToAudioMode();
      }

      if (embedIsType('collection')) {
        assignMediaProductToPlayTriggers(currentTidalMedia);
      }

      updateMediaSession(event.detail.mediaProduct);
    }
  });

  playerSdkEvents.addEventListener(
    'ended',
    () => {
      if (!embedIsType('collection')) {
        DialogController.show('finished');
      }
    },
    { passive: true },
  );

  // Listen to playback button clicks in the media item list
  const playbackButtons = $$('.playback-button');

  if (playbackButtons) {
    for (const button of playbackButtons) {
      if (isOnMobileWithTouchScreen()) {
        const boundTouchEnd = () => {
          if (!touchState.movedBeforeEnd) {
            mediaItemListItemClick(button);
          }

          touchState.movedBeforeEnd = false;
        };

        button.parentNode?.addEventListener('touchend', boundTouchEnd, {
          passive: true,
        });

        button.parentNode?.addEventListener(
          'touchmove',
          () => {
            touchState.movedBeforeEnd = true;
          },
          { passive: true },
        );
      } else {
        button.parentNode?.addEventListener(
          'dblclick',
          () => mediaItemListItemClick(button),
          false,
        );
        button.addEventListener(
          'click',
          () => mediaItemListItemClick(button),
          false,
        );
      }
    }
  }

  /*
  const browserSupportsIntersectionObserver = Boolean(
    'IntersectionObserver' in window,
  );

  if (browserSupportsIntersectionObserver) {
    const autoplayVideoInstersectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.intersectionRatio > 0) {
            const customEvent = new CustomEvent('embed-entered-viewport');

            document.dispatchEvent(customEvent);
          } else {
            const customEvent = new CustomEvent('embed-left-viewport');

            document.dispatchEvent(customEvent);
          }
        });
      },
    );

    if (DOMRefs.embedWrapper) {
      autoplayVideoInstersectionObserver.observe(DOMRefs.embedWrapper);
    }

    document.addEventListener('embed-entered-viewport', () => {
      // Stop silent autoplay loop if we leave viewport
      if (tidalPlayer.isInSilentAutoplayMode) {
        tidalPlayer.play();
      }
    });

    document.addEventListener('embed-left-viewport', () => {
      // Stop silent autoplay loop if we leave viewport
      if (tidalPlayer.isInSilentAutoplayMode) {
        tidalPlayer.pause();
      }
    });
  }
  */
}

/**
 * Checks if the size of the viewport is banner-like. (eg 160x600, 970x250)
 * Used to force image height to 100%.
 */
function checkBannerRatio() {
  // Throttle this!
  const { embedWrapper, layoutTypeWrapper } = DOMRefs;
  const ratio = window.innerWidth / window.innerHeight;
  const banner = ratio < 0.5 || ratio > 2;
  const isOnlyVideo = layoutTypeWrapper?.classList.contains(
    'media-type--is-collection--only-videos',
  );

  layoutTypeWrapper?.classList.remove('banner');
  if (banner) {
    layoutTypeWrapper?.classList.add('banner'); // Places media-info
  }
  // If grid AND banner AND has item list: show as non-grid
  if (isOnlyVideo) {
    layoutTypeWrapper?.classList.add('gridify');
    embedWrapper?.classList.add('gridify-wrapper');
  }

  // Remove media item list when not enought horizontal or vertical space available
  const mediaItemListMinimumWidth = 140; // NB: Should show at eg 160x600.
  const mediaItemListMinimumHeight = 120;

  const mediaItemList = $('.media-item-list');

  if (mediaItemList && !gridIsEnforced()) {
    // Small delay to ensure mediaItemList is rendered before it's measured.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const sizeIsTooSmallForMediaItemList =
          mediaItemList.clientWidth < mediaItemListMinimumWidth ||
          mediaItemList.clientHeight < mediaItemListMinimumHeight;

        if (sizeIsTooSmallForMediaItemList) {
          DOMRefs.embedWrapper?.classList.add('media-item-list--hidden');
        } else {
          DOMRefs.embedWrapper?.classList.remove('media-item-list--hidden');
        }
      });
    });
  }
}

function gridIsEnforced() {
  const embedItemType = URLOptions.itemType;

  return (
    URLOptions.layout === 'gridify' ||
    URLOptions.layout === 'video-grid' ||
    embedItemType === 'videos' ||
    URLOptions.coverInitially
  );
}

/**
 * When layout option is set, always force grid.
 * Fixed video only playists having grid + list when layout=grid.
 */
function enforceVideoPlaylistGrid() {
  if (URLOptions.layout === 'video-grid') {
    DOMRefs.embedWrapper?.classList.add('media-item-list--hidden');
    DOMRefs.embedWrapper?.classList.add('layout-option-grid-forced');
  }
}

/**
 * Checks if grid layout should be used
 * Adds "gridify" class to layoutTypeWrapper if conditions are met.
 */
function checkGrid() {
  if (gridIsEnforced()) {
    // TODO: Now using both .layout-wrapper.gridfy and .embed-player.gridify.
    // Probably a good idea to set state classes etc on outermost element.
    DOMRefs.layoutTypeWrapper?.classList.add('gridify');
    DOMRefs.embedWrapper?.classList.add('gridify-wrapper');
    DOMRefs.embedWrapper?.classList.add('layout-option-grid-forced');
    checkBannerRatio();
  }
}

/**
 * Checks if there is items to play previous or play next,
 * and puts disabled on the related buttons accordingly.
 */
function updateStateOfNextAndPrevButtons() {
  const { nextItem, previousItem } = DOMRefs.mediaItemList;

  function maybeDisableButton(button, disable) {
    if (disable) {
      button.setAttribute('disabled', 'disabled');
    } else {
      button.removeAttribute('disabled');
    }
  }

  maybeDisableButton(DOMRefs.prevButtonElement, !previousItem);
  maybeDisableButton(DOMRefs.nextButtonElement, !nextItem);
}

function shouldShowFallbackImage() {
  const image = $('.cover-art');

  if (image instanceof HTMLImageElement) {
    const src = image.currentSrc || image.src;

    return fetch(src, {
      mode: 'cors',
    }).then(r => !r.ok);
  }

  return Promise.resolve(false);
}

function maybeShowFallbackImage() {
  shouldShowFallbackImage().then(should => {
    if (should) {
      showFallbackImage();
    }
  });
}

function showFallbackImage() {
  const image = $('.cover-art');

  if (image instanceof HTMLImageElement) {
    image.style.visibility = 'hidden';
    DOMRefs.imageryHolderAudio?.classList.add('show-fallback-image');
  }
}

window.onresize = () => {
  checkBannerRatio();
};

/**
 * The server side code does it best to guess the final size,
 * but can be wrong. This ensures a client side check is also done
 * to avoid a too large or too small image.
 */
async function ensureCovertArtSizes() {
  const coverArt = document.querySelector('.cover-art');

  if (coverArt instanceof HTMLImageElement) {
    coverArt.sizes = coverArt.getBoundingClientRect().width + 'px';
  }
}

function bootFirstPlayableItemInPlayer() {
  const { firstPlayableItem } = DOMRefs.mediaItemList;

  if (firstPlayableItem) {
    const productId = firstPlayableItem.getAttribute('product-id');
    const _productType = firstPlayableItem.getAttribute('product-type');
    const productType = _productType === 'video' ? 'video' : 'track';

    if (productId) {
      currentTidalMedia = new TidalMedia(productType, productId);

      assignMediaProductToPlayTriggers(currentTidalMedia);

      const { classicHeaderTitle } = DOMRefs;

      if (classicHeaderTitle) {
        classicHeaderTitle.textContent =
          firstPlayableItem.mediaProductTitle ?? '';
      }
    }
  } else {
    DOMRefs.embedWrapper?.classList.add('embed-player--has-no-playable-media');
  }
}

/**
 * Additional initlization steps for collection embeds.
 */
async function initializeCollectionEmbed() {
  await Promise.all([
    import('./components/media-item-list.js'),
    import('./components/list-item.js'),
  ]);

  updateStateOfNextAndPrevButtons();
  bootFirstPlayableItemInPlayer();
}

setCredentialsProvider(defaultCredentialsProvider);

checkGrid();
checkBannerRatio();

ensureCovertArtSizes();

if (embedIsType('collection')) {
  // Micro thread branch for collection setup.
  initializeCollectionEmbed().then().catch(console.error);
}

if (isOnMobileWithTouchScreen()) {
  DOMRefs.embedWrapper?.classList.add('touchy-device');
}

if (URLOptions.cleanInitially && domainAllowedToCleanUI()) {
  DOMRefs.embedWrapper?.classList.add('tidal-hide');
}

// Make sure single tracks and videos get onelink on load.
if (URLOptions.itemType === 'videos' || URLOptions.itemType === 'tracks') {
  updateCurrentMediaTitleInDOM({
    tidalMedia: getTidalMediaFromURL(),
    title:
      document.querySelector('.media-information .media-title')?.textContent ??
      '',
  });
}

messageBridge.onRequestPause(() => {
  if (
    currentState === 'PLAYING' &&
    DOMRefs.playPauseButton instanceof HTMLElement
  ) {
    DOMRefs.playPauseButton.click();
  }
});

messageBridge.onRequestPlay(() => {
  if (
    currentState !== 'PLAYING' &&
    DOMRefs.playPauseButton instanceof HTMLElement
  ) {
    DOMRefs.playPauseButton.click();
  }
});

// Remove the player if the media-item-list has no playable items.
if (
  embedIsType('collection') &&
  DOMRefs.mediaItemList.allMediaItemsNotStreamReady
) {
  $('.player')?.remove();
}

function runNostrInterval() {
  let counter = 0;

  const interval = setInterval(() => {
    if (counter >= 10) {
      clearInterval(interval);

      if (!('nostr' in window)) {
        console.error(
          'Nostr not available in window. Install a NIP-07 extension or try another one.',
        );
      }
    }

    if ('nostr' in window) {
      clearInterval(interval);

      showNostrDialog();
    } else {
      counter++;
    }
  }, 500);
}

function afterDOMLoaded() {
  checkIfFullscreenEnabled();
  registerEventListeners();
  registerExternalLinkClickHandlers();
  enforceVideoPlaylistGrid();
  runNostrInterval();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', afterDOMLoaded);
} else {
  afterDOMLoaded();
}
