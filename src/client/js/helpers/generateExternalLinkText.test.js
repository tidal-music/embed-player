/* eslint-env mocha */
import { expect } from '@esm-bundle/chai';

import generateExternalLinkText from './generateExternalLinkText.js';

describe('generateExternalLinkText', () => {
  it('playlist', () => {
    const result = generateExternalLinkText({ type: 'playlists' });

    expect(result).to.eq('Listen to full playlist');
  });

  it('album', () => {
    const result = generateExternalLinkText({ type: 'albums' });

    expect(result).to.eq('Listen to full album');
  });

  it('track', () => {
    const result = generateExternalLinkText({ type: 'tracks' });

    expect(result).to.eq('Listen to full track');
  });

  it('video', () => {
    const result = generateExternalLinkText({ type: 'videos' });

    expect(result).to.eq('Watch full video');
  });

  it('live video', () => {
    const result = generateExternalLinkText({
      livestream: true,
      type: 'videos',
    });

    expect(result).to.eq('Continue watching');
  });
});
