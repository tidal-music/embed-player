import DialogController from '../dialog-controller.js';

const credentialsUpdatedEvent = new CustomEvent('CredentialsUpdatedMessage', {
  detail: {
    type: 'credentialsUpdated',
  },
});

class DefaultCredentialsProvider {
  /**
   * @type {import('@tidal-music/common/dist').Bus} fn
   */
  bus(fn) {
    fn(credentialsUpdatedEvent);
  }

  /**
   * @type {import('@tidal-music/common/dist').GetCredentials} fn
   */
  async getCredentials() {
    if (process.env.EMBED_API_TOKEN) {
      return {
        clientId: process.env.EMBED_API_TOKEN,
        requestedScopes: [],
      };
    }

    throw new ReferenceError(
      'You are running without setting an EMBED_API_TOKEN variable',
    );
  }
}

class NostrCredentialsProvider {
  /**
   * @param {import('@tidal-music/common/dist').BusEvent} _event
   */
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  #busFn = _event => {};

  /**
   * @type {import('@tidal-music/common/dist').Bus} fn
   */
  bus(fn) {
    this.#busFn = fn;
  }

  /**
   * @type {import('@tidal-music/common/dist').GetCredentials} fn
   */
  async getCredentials() {
    let accessToken = nostrAuthProvider.getAccessToken();
    let userId = nostrAuthProvider.getUserId();

    if (!accessToken) {
      const { accessToken: newAccessToken, userId: newUserId } =
        await nostrAuthProvider.renewAccessToken();

      accessToken = newAccessToken;
      userId = newUserId;

      this.#busFn(credentialsUpdatedEvent);
    }

    if (accessToken && userId && process.env.EMBED_API_TOKEN__NOSTR) {
      return {
        clientId: process.env.EMBED_API_TOKEN__NOSTR,
        requestedScopes: ['playback'],
        token: accessToken,
        userId: String(userId),
      };
    }

    throw new ReferenceError(
      'You are running without setting an EMBED_API_TOKEN variable',
    );
  }
}

class NostrAuthProvider {
  /** @type {string|null} */
  #accessToken = sessionStorage.getItem('accessToken');
  #channel = new BroadcastChannel('nostr_auth');

  /** @type {number|null} */
  #userId = sessionStorage.getItem('userId')
    ? parseInt(sessionStorage.getItem('userId') ?? '0', 10)
    : null;

  constructor() {
    this.#channel.addEventListener('message', e => {
      this.#accessToken = e.data;

      DialogController.close('nostr');
    });
  }

  getAccessToken() {
    return this.#accessToken;
  }

  getUserId() {
    return this.#userId;
  }

  /**
   *s
   * @returns {Promise<{ accessToken: string, userId: number }>}
   */
  async renewAccessToken() {
    const challengeResponse = await fetch(
      'https://auth.tidal.com/v1/nostr/challenge',
    );
    const challengeJson = await challengeResponse.json();

    const event = {
      content: challengeJson.challenge,
      // eslint-disable-next-line camelcase
      created_at: parseInt((Date.now() / 1000).toFixed(0), 10),
      kind: 9467,
      tags: [],
    };

    // @ts-expect-error window.nostr not typed
    const signedEvent = await window.nostr.signEvent(event);
    const base64Event = btoa(JSON.stringify(signedEvent));

    const fields = new URLSearchParams();

    fields.append('grant_type', 'nostr');
    fields.append('event', base64Event);

    if (process.env.EMBED_API_TOKEN__NOSTR) {
      fields.append('client_id', process.env.EMBED_API_TOKEN__NOSTR);
    } else {
      console.warn(
        'You are running without setting an EMBED_API_TOKEN__NOSTR variable, login with nostr will not work.',
      );
    }

    fields.append('scope', 'playback');

    const loginResponse = await fetch(
      'https://auth.tidal.com/v1/oauth2/token',
      {
        body: fields.toString(),
        headers: new Headers({
          'content-type': 'application/x-www-form-urlencoded',
        }),
        method: 'POST',
      },
    );

    const loginJson = await loginResponse.json();

    if (loginResponse.ok) {
      const { access_token: accessToken, user_id: userId } = loginJson;

      this.#accessToken = accessToken;
      this.#userId = userId;

      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('userId', userId);

      this.#channel.postMessage(accessToken);

      return { accessToken, userId };
    }

    throw new Error(JSON.stringify(loginJson));
  }
}

export const nostrAuthProvider = new NostrAuthProvider();

export const defaultCredentialsProvider = new DefaultCredentialsProvider();
export const nostrCredentialsProvider = new NostrCredentialsProvider();
