import URLOptions from './url-options.js';

export default class MessageBridge {
  constructor() {
    this.requestPauseObservers = [];
    this.requestPlayObservers = [];

    window.addEventListener('message', event =>
      this.handleWindowMessage(event),
    );
  }

  /**
   * Broadcasts events from the audio player that can be listened to
   * on pages the embed player is embedded on.
   * @param {BroadcastMediaStatusOptions} options

   */
  static broadcastMediaStatus(options) {
    const { currentTime, duration, paused, type } = options;

    if (window.parent !== window) {
      const message = JSON.stringify({ currentTime, duration, paused, type });

      window.parent.postMessage(message, '*');
    }
  }

  /**
   * @param {{ width: number, height: number }} options
   */
  broadcastSize(options) {
    const { height, width } = options;

    const message = JSON.stringify({
      height,
      newEmbed: true,
      pid: URLOptions.pid,
      width,
    });

    window.parent.postMessage(message, '*');
  }

  handleWindowMessage(event) {
    let message = event.data;

    if (typeof message === 'string') {
      try {
        message = JSON.parse(message);
      } catch (e) {
        return; // If invalid JSON it is not for us
      }
    }

    if (message) {
      switch (message.commandName) {
        case 'pause':
          this.onRequestPauseHandler();
          break;
        case 'play':
          this.onRequestPlayHandler();
          break;
        default:
          break;
      }
    }
  }

  onRequestPause(callback) {
    this.requestPauseObservers.push(callback);
  }

  onRequestPauseHandler() {
    this.requestPauseObservers.forEach(callback => callback());
  }

  /** @typedef BroadcastMediaStatusOptions
   * @prop {'play' | 'pause' | 'ended'} type
   * @prop {boolean} paused
   * @prop {number} currentTime
   * @prop {number} duration
   */

  onRequestPlay(callback) {
    this.requestPlayObservers.push(callback);
  }

  onRequestPlayHandler() {
    this.requestPlayObservers.forEach(callback => callback());
  }

  requestPauseOfSiblingEmbeds() {
    if (window.parent !== window) {
      const message = JSON.stringify({ activatePlayerId: URLOptions.pid });

      window.parent.postMessage(message, '*');
    }
  }
}
