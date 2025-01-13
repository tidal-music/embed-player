import DialogController from './dialog-controller.js';
import DOMRefs from './dom-refs.js';
import {
  embedIsType,
  generateShareURL,
  isOnAppleMobileDevice,
  isOnMobileWithTouchScreen,
  singularType,
} from './helpers/index.js';
import URLOptions from './url-options.js';

const FACEBOOK_APP_ID = 185717988231456;

export default class ShareController {
  copyTextToClipboard(text) {
    return new Promise((resolve, reject) => {
      const textArea = document.createElement('textarea');

      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      textArea.style.padding = '0';
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';

      textArea.value = text;

      document.body.appendChild(textArea);

      // From https://gist.github.com/rproenca/64781c6a1329b48a455b645d361a9aa3#L19
      if (isOnAppleMobileDevice()) {
        const range = document.createRange();

        range.selectNodeContents(textArea);
        const selection = window.getSelection();

        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }

        textArea.setSelectionRange(0, 999999);
      } else {
        textArea.select();
      }

      try {
        document.execCommand('copy');
        // @ts-expect-error - Cannot type generic with JSDoc
        resolve();
      } catch (error) {
        reject(new Error(error));
      }

      document.body.removeChild(textArea);
    });
  }

  /**
   * Returns an object with the data for use when sharing.
   *
   */
  getShareData() {
    const url = generateShareURL(URLOptions.itemType, URLOptions.itemId);

    const title = (
      DOMRefs.shareDialog?.querySelector('.media-album')?.textContent ?? ''
    ).trim();
    const subtitle = (
      DOMRefs.shareDialog?.querySelector('.media-artist')?.textContent ?? ''
    ).trim();

    const text = `${title} — ${subtitle}`;

    return { subtitle, text, title, url };
  }

  getWindowFeaturesForShareIntent() {
    const winWidth = 520;
    const winHeight = 350;
    // eslint-disable-next-line no-restricted-globals
    const winTop = screen.height / 2 - winHeight / 2;
    // eslint-disable-next-line no-restricted-globals
    const winLeft = screen.width / 2 - winWidth / 2;

    return `width=${winWidth},height=${winHeight},top=${winTop},left=${winLeft},toolbar=no,status=0,menubar=no,resizable=yes,scrollbars=yes`;
  }

  /**
   * Handles sharing on facebook. On Android over HTTPS the native share dialog is used. But for
   * HTTP and iOS try to use the fb-messenger:// protocol to share there, since the facebook.com/dialog is
   * not supported on mobile.
   */
  openFacebookMessengerWindow({ url }) {
    let externalURL = `https://www.facebook.com/dialog/send?app_id=${FACEBOOK_APP_ID}&display=popup&link=${encodeURIComponent(
      url,
    )}&redirect_uri=${encodeURIComponent(url)}`;

    // The above link does not work on mobile, last restort is trying fb-messenger:// protocol
    if (isOnMobileWithTouchScreen()) {
      externalURL = `fb-messenger://share?link=${encodeURIComponent(
        url,
      )}&app_id=${FACEBOOK_APP_ID}`;
    }

    window.open(
      externalURL,
      'Messenger',
      this.getWindowFeaturesForShareIntent(),
    );
  }

  // https://developers.facebook.com/docs/sharing/reference/share-dialog
  openFacebookShareWindow({ url }) {
    const externalURL = `https://www.facebook.com/dialog/share?app_id=${FACEBOOK_APP_ID}&display=popup&href=${encodeURIComponent(
      url,
    )}&redirect_uri=#`;

    window.open(
      externalURL,
      'Facebook',
      this.getWindowFeaturesForShareIntent(),
    );
  }

  openTwitterShareWindow({ subtitle, title, url }) {
    const singularTypeString = singularType(URLOptions.itemType);

    const maybePreTitleString = embedIsType('collection')
      ? ` the ${singularTypeString} `
      : ' ';
    const maybePostTitleString =
      subtitle !== undefined ? ` by ${subtitle}` : '';

    const text = `#NowPlaying${maybePreTitleString}"${title}"${maybePostTitleString} in @TIDAL`;

    const externalURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text,
    )}&url=${encodeURIComponent(url)}&related=tidal`;

    window.open(externalURL, 'Twitter', this.getWindowFeaturesForShareIntent());
  }

  triggerShare() {
    if (this.webShareAPIIsAvailable()) {
      const { text, title, url } = this.getShareData();

      navigator.share({ text, title, url });
    } else {
      DialogController.show('share');
    }
  }

  webShareAPIIsAvailable() {
    return Boolean(navigator.share !== undefined);
  }
}
