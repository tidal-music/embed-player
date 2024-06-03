import { setCredentialsProvider } from '@tidal-music/player-web-components';

import DialogController from './dialog-controller.js';
import { nostrCredentialsProvider } from './playback/auth-provider.js';

export async function showNostrDialog() {
  if ('nostr' in window) {
    document.addEventListener('nostr-login-error', e => {
      if (e instanceof CustomEvent) {
        const json = JSON.parse(e.detail.message);

        let message;

        if (json.sub_status === 1005) {
          message =
            'Nostr account not connected to TIDAL. Click connect below then try again.';
        } else {
          message = json.error_description;
        }

        const p = document.querySelector('.dialog--nostr p');

        if (p) {
          p.textContent = message;
          p.classList.add('error');
        }
      }
    });

    if (sessionStorage.getItem('accessToken')) {
      setCredentialsProvider(nostrCredentialsProvider);
    } else {
      await import('./components/nostr-login-button.js');

      DialogController.show('nostr');
    }
  }
}
