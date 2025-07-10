/* eslint-env mocha */
import { expect } from 'chai';

import generateCrossPlatformLink from './generateCrossPlatformLink.js';

describe('generateCrossPlatformLink', () => {
  it('track', () => {
    const result = generateCrossPlatformLink('track', '1844961');

    // expect(result).to.eq('https://app.adjust.com/fn3avmk?deep_link=tidal%3A%2F%2Ftrack%2F1844961&engagement_type=fallback_click&redirect=https%3A%2F%2Ftidal.com%2Ftrack%2F1844961');
    expect(result).to.eq('https://tidal.com/track/1844961');
  });

  it('video', () => {
    const result = generateCrossPlatformLink('video', '93295618');

    // expect(result).to.eq('https://app.adjust.com/fn3avmk?deep_link=tidal%3A%2F%2Fvideo%2F93295618&engagement_type=fallback_click&redirect=https%3A%2F%2Ftidal.com%2Fvideo%2F93295618');
    expect(result).to.eq('https://tidal.com/video/93295618');
  });
});
