/**
 * Passive event listeners
 * Supported from Chrome51, Firefox49. Improves scroll handling.
 * https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
 */
export default function supportsPassiveEvt() {
  let supportsPassiveOption = false;

  try {
    const opts = Object.defineProperty({}, 'passive', {
      // eslint-disable-next-line getter-return
      get() {
        supportsPassiveOption = true;
      },
    });

    // @ts-expect-error - Test
    window.addEventListener('test', null, opts);
  } catch (e) {
    console.error(e);
  }

  return supportsPassiveOption;
}
