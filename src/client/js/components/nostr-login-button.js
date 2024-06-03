import { setCredentialsProvider } from '@tidal-music/player-web-components';

import DialogController from '../dialog-controller.js';
import { nostrCredentialsProvider } from '../playback/auth-provider.js';

export class NostrLoginButton extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('click', () => {
      this.setAttribute('loading', 'loading');

      setCredentialsProvider(nostrCredentialsProvider);

      nostrCredentialsProvider.bus(e => {
        if (e.detail.type === 'credentialsUpdated') {
          this.removeAttribute('loading');
          DialogController.close('nostr');
        }
      });

      document.addEventListener('nostr-login-error', () => {
        this.removeAttribute('loading');
      });
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
