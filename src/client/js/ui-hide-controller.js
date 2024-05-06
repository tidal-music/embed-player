/* globals screenfull */

import DOMRefs from './dom-refs.js';
import URLOptions from './url-options.js';

/*
  This controller is used for hiding the control overlay for grid embeds in
  fullscreen and on mobile.
*/

// Durations in miliseconds until we hide UI on desktop/mobile
const DESKTOP_TIMEOUT = 3000;

class UIHideController {
  constructor() {
    this.timeoutId = undefined;
    this.videoHadGridifyBeforeFullscreen = false;
    this.hiddenControls = false;
  }

  enableUIHider() {
    DOMRefs.embedWrapper?.classList.add('ui-hider--enabled');

    this.videoHadGridifyBeforeFullscreen =
      DOMRefs.layoutTypeWrapper?.classList.contains('gridify') ?? false;
    DOMRefs.layoutTypeWrapper?.classList.add('gridify');
  }

  exitFullscreen() {
    // @ts-expect-error screenfull is not typed on window.
    if ('screenfull' in window && screenfull.isEnabled) {
      // @ts-expect-error screenfull is not typed on window.
      screenfull.exit();
    }
  }

  /**
   * Check if the fullscreen API is available before importing screenfull.
   *
   * @returns {Boolean}
   */
  fullscreenEnabled() {
    /*
    webkitFullscreenEnabled = Chrome, Opera, Safari, Edge
    msFullscreenEnabled = IE only
    */

    const embedTypeAllowsFullscreen =
      DOMRefs.embedWrapper?.classList.contains('embed-media-type--videos') ||
      DOMRefs.embedWrapper?.classList.contains(
        'embed-media-type--is-collection--only-videos',
      );

    return (
      Boolean(embedTypeAllowsFullscreen) &&
      Boolean(
        document.fullscreenEnabled ||
          // @ts-expect-error prefixed fullscreen properties are not typed
          document.webkitFullscreenEnabled ||
          // @ts-expect-error prefixed fullscreen properties are not typed
          document.mozFullScreenEnabled ||
          // @ts-expect-error prefixed fullscreen properties are not typed
          document.msFullscreenEnabled,
      )
    );
  }

  handleDesktopDevice() {
    this.timeoutId = setTimeout(() => this.hideUI(), DESKTOP_TIMEOUT);
    document.addEventListener(
      'mousemove',
      () => this.handleDesktopMouseMove(),
      false,
    );
  }

  handleDesktopMouseMove() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.showUI();
    this.timeoutId = setTimeout(() => this.hideUI(), DESKTOP_TIMEOUT);
  }

  handleEnterFullscreen() {
    DOMRefs.embedWrapper?.classList.add('fullscreen-active');
    this.enableUIHider();
    this.handleDesktopDevice();
  }

  handleExitFullscreen() {
    DOMRefs.embedWrapper?.classList.remove('fullscreen-active');
    DOMRefs.embedWrapper?.classList.remove('ui-hider--enabled');

    /* Remove only when it's a video only collection */
    if (
      !this.videoHadGridifyBeforeFullscreen &&
      URLOptions.itemType !== 'videos'
    ) {
      DOMRefs.layoutTypeWrapper?.classList.remove('gridify');
    }
  }

  hideUI() {
    DOMRefs.embedWrapper?.classList.add('ui-hider--hidden-controls');
    this.hiddenControls = true;
  }

  showUI() {
    DOMRefs.embedWrapper?.classList.remove('ui-hider--hidden-controls');
    this.hiddenControls = false;
  }

  async toggleFullscreen() {
    // @ts-expect-error screenfull is not typed on window.
    if ('screenfull' in window && screenfull.isEnabled) {
      // @ts-expect-error screenfull is not typed on window.
      screenfull.toggle();
    }
  }

  toggleUIVisibility() {
    if (DOMRefs.embedWrapper?.classList.contains('ui-hider--hidden-controls')) {
      this.showUI();
    } else {
      this.hideUI();
    }
  }
}

export default UIHideController;
