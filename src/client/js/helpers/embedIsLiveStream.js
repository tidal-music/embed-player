import DOMRefs from '../dom-refs.js';

export default function embedIsLivestream() {
  return DOMRefs.embedWrapper?.classList.contains(
    'embed-media-type--is-live-stream',
  );
}
