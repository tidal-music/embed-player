import { $ } from './fake-query.js';

/** @type {Element|null} */
let _embedWrapper;

/** @type {Element|null} */
let _layoutTypeWrapper;

/** @type {Element|null} */
let _shareDialog;

/** @type {import('./components/media-item-list.js').MediaItemList} */
let _mediaItemList;

/** @type {Element|null} */
let _classicHeaderArtist;

/** @type {Element|null} */
let _classicHeaderTitle;

/** @type {Element|null} */
let _progressIndicator;

/** @type {Element|null} */
let _progressBarTrack;

/** @type {Element|null} */
let _imageryHolderAudio;

/** @type {Element|null} */
let _imageryHolderVideo;

/** @type {Element|null} */
let _replayButtonElement;

/** @type {Element|null} */
let _prevButtonElement;

/** @type {Element|null} */
let _nextButtonElement;

/** @type {Element|null} */
let _keepWatchingButton;

/** @type {Element|null} */
let _playPauseButton;

/** @type {Element|null} */
let _coverArtPlayTrigger;

export default class {
  static get classicHeaderArtist() {
    _classicHeaderArtist ||= $('.classic-header .media-artist');

    return _classicHeaderArtist;
  }

  static get classicHeaderTitle() {
    _classicHeaderTitle ||= $('.classic-header .media-title');

    return _classicHeaderTitle;
  }

  static get coverArtPlayTrigger() {
    _coverArtPlayTrigger ||= $('.left-compartment tidal-play-trigger');

    return _coverArtPlayTrigger;
  }

  static get embedWrapper() {
    _embedWrapper ||= $('.embed-player');

    return _embedWrapper;
  }

  static get imageryHolderAudio() {
    _imageryHolderAudio ||= $('.imagery-holder--audio');

    return _imageryHolderAudio;
  }

  static get imageryHolderVideo() {
    _imageryHolderVideo ||= $('.imagery-holder--video');

    return _imageryHolderVideo;
  }

  static get keepWatchingButton() {
    _keepWatchingButton ||= $('#keep-watching');

    return _keepWatchingButton;
  }

  static get layoutTypeWrapper() {
    _layoutTypeWrapper ||= $('.layout-type-wrapper');

    return _layoutTypeWrapper;
  }

  static get mediaItemList() {
    _mediaItemList ||=
      /** @type {import('./components/media-item-list.js').MediaItemList} */ (
        $('media-item-list')
      );

    return _mediaItemList;
  }

  static get nextButtonElement() {
    _nextButtonElement ||= $('button.next-track');

    return _nextButtonElement;
  }

  static get playPauseButton() {
    _playPauseButton ||= $('.player tidal-play-trigger');

    return _playPauseButton;
  }

  static get prevButtonElement() {
    _prevButtonElement ||= $('button.previous-track');

    return _prevButtonElement;
  }

  static get progressBarTrack() {
    _progressBarTrack ||= $('.progress-bar-track');

    return _progressBarTrack;
  }

  static get progressIndicator() {
    _progressIndicator ||= $('.progress-indicator');

    return _progressIndicator;
  }

  static get replayButtonElement() {
    _replayButtonElement ||= $('.replay-button');

    return _replayButtonElement;
  }

  static get shareDialog() {
    _shareDialog ||= $('.dialog--share');

    return _shareDialog;
  }
}
