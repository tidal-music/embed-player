import { setCredentialsProvider } from '@tidal-music/player-web-components';

import DialogController from '../dialog-controller.js';
import { nostrCredentialsProvider } from '../playback/auth-provider.js';

export class NostrLoginButton extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('click', () => {
      try {
        setCredentialsProvider(nostrCredentialsProvider);
        this.setAttribute('loading', 'loading');
        DialogController.close('nostr');
      } catch (e) {
        this.removeAttribute('loading');

        const json = JSON.parse(e.message);

        if (json.sub_status === 1005) {
          this.error =
            'Nostr account not connected to TIDAL. Click connect below then try again.';
        } else {
          this.error = json.error_description;
        }

        this.dispatchEvent(new Event('error'));
      }
    });
  }

  connectedCallback() {
    this.sDOM = this.attachShadow({ mode: 'closed' });
    this.sDOM.innerHTML = '<slot></slot>';
  }
}

const name = 'nostr-login-button';

if (!customElements.get(name)) {
  customElements.define(name, NostrLoginButton);
}

export default name;
