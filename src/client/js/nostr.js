import { setCredentialsProvider } from '@tidal-music/player-web-components';

import { NostrLoginButton } from './components/nostr-login-button.js';
import DialogController from './dialog-controller.js';
import { nostrCredentialsProvider } from './playback/auth-provider.js';

export async function showNostrDialog() {
  if ('nostr' in window) {
    if (sessionStorage.getItem('accessToken')) {
      setCredentialsProvider(nostrCredentialsProvider);
    } else {
      await import('./components/nostr-login-button.js');

      DialogController.show('nostr');
    }

    document
      .querySelector('nostr-login-button')
      ?.addEventListener('error', e => {
        const p = document.querySelector('.dialog--nostr p');

        if (p && e.target instanceof NostrLoginButton) {
          p.textContent = e.target.error;
          p.classList.add('error');
        }
      });
  }
}
