/**
 * @typedef {'collection'|'album'|'playlist'|'track'|'video'} EmbedTypes
 */

/**
 *
 * @param {EmbedTypes} type
 * @returns
 */
export default function embedIsType(type) {
  if (type === 'collection') {
    return ['albums', 'mix', 'playlists'].includes(
      document.location.pathname.split('/')[1],
    );
  }

  return document.location.pathname.includes(type);
}
