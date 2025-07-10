export default {
  get cleanInitially() {
    const url = new URL(document.location.href);

    return url.searchParams.has('cleanInitially');
  },

  get coverInitially() {
    const url = new URL(document.location.href);
    const parameterIsDefined = url.searchParams.has('coverInitially');
    const isCollection =
      this.itemType === 'albums' ||
      this.itemType === 'playlists' ||
      this.itemType === 'mix';
    const isSquare = window.innerWidth / window.innerHeight === 1;
    const parameterIsAllowed = isCollection && isSquare;

    return parameterIsDefined && parameterIsAllowed;
  },

  get forceUI() {
    const url = new URL(document.location.href);

    return url.searchParams.has('forceUI');
  },

  /**
   * @returns {string}
   */
  get itemId() {
    return document.location.pathname.split('/')[2];
  },

  /**
   * @returns {('playlists' | 'videos' | 'tracks' | 'albums' | 'mix' | 'upload')}
   */
  get itemType() {
    const type = document.location.pathname.split('/')[1];

    if (
      type === 'videos' ||
      type === 'tracks' ||
      type === 'mix' ||
      type === 'albums' ||
      type === 'playlists' ||
      type === 'upload'
    ) {
      return type;
    }

    throw new TypeError('Not valid embed media type: ' + type);
  },

  get layout() {
    const url = new URL(document.location.href);

    return url.searchParams.get('layout');
  },

  get pid() {
    const url = new URL(document.location.href);

    return url.searchParams.get('pid');
  },

  get sendMediaEvents() {
    const url = new URL(document.location.href);

    return Boolean(url.searchParams.get('sendMediaEvents'));
  },
};
