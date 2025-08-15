import {
  init as eventProducerInit,
  sendEvent,
} from '@tidal-music/event-producer';
import {
  setCredentialsProvider,
  setEventSender,
} from '@tidal-music/player-web-components';
import platform from 'platform';

import packageJson from '../../../../package.json';

import { defaultCredentialsProvider } from './auth-provider.js';

const appVersion =
  typeof packageJson.version === 'string' ? packageJson.version : 'unknown';

export async function initializePlayback() {
  setCredentialsProvider(defaultCredentialsProvider);

  await eventProducerInit({
    appInfo: { appName: 'TIDAL Embed Player', appVersion },
    blockedConsentCategories: {
      NECESSARY: false,
      PERFORMANCE: true,
      TARGETING: true,
    },
    credentialsProvider: defaultCredentialsProvider,
    platform: {
      browserName: platform.name ?? 'invalid browser name',
      browserVersion: platform.version ?? 'invalid browser version',
      osName: platform.os?.family ?? 'invalid os name',
    },
    tlConsumerUri: 'https://ec.tidal.com/api/event-batch',
    tlPublicConsumerUri: 'https://ec.tidal.com/api/public/event-batch',
  });

  // @ts-expect-error only passing needed function in, TODO: simplify type
  setEventSender({
    sendEvent,
  });
}
