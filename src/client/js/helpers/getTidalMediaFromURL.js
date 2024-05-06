import TidalMedia from '../tidal-media.js';
import URLOptions from '../url-options.js';

export default function getTidalMediaFromURL() {
  const type = URLOptions.itemType;

  if (type === 'videos' || type === 'tracks') {
    const singular = type === 'videos' ? 'video' : 'track';

    return new TidalMedia(singular, URLOptions.itemId);
  }

  throw new Error(`Incorrect type when creating TidalMedia from URL: ${type}`);
}
