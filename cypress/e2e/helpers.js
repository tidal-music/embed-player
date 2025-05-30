/**
 * Find the iframe of a tidal embed umber and waits for .embed-player to be visible in it.
 *
 * @param {any} browser
 * @param {number} tidalEmbedNumber
 */

const DEFAULT_WINDOW_HEIGHT = 750;
const DEFAULT_WINDOW_WIDTH = 1040;

function bootIntoURLPath (path, { width, height }) {
  cy.viewport(width, height);
  cy.visit(path);

  // TODO: Add trueTime.synch in load/play calls in SDK to avoid waiting.
  cy.wait(1000);
}

/**
   * Wait for the client side JS to hydrate the first playable item in the player.
   */
function waitForCollectionHydration (collectionId) {
  cy.get(`tidal-play-trigger[product-type="${collectionId}"]`).should('not.exist');
  cy.get('tidal-play-trigger[product-type="track"]').should('exist');
}

export default {
  bootIntoURLPath,

  bootIntoVideo (id = 26136887, customSize) {
    const size = Object.assign({ width: DEFAULT_WINDOW_WIDTH, height: DEFAULT_WINDOW_HEIGHT }, customSize);

    return bootIntoURLPath(`/videos/${id}`, size);
  },

  bootIntoClassicTrack (id = 598182) {
    return bootIntoURLPath(`/tracks/${id}`, {
      width: DEFAULT_WINDOW_WIDTH,
      height: 122
    });
  },

  bootIntoClassicAlbum (id = 242964125) {
    bootIntoURLPath(`/albums/${id}`, { width: 444, height: 122 });

    return waitForCollectionHydration(id);
  },

  bootIntoClassicPlaylist (id = 'c989958b-c60a-4bdc-b58f-25236c6c1e8a') {
    bootIntoURLPath(`/playlists/${id}`, { width: 444, height: 122 });

    return waitForCollectionHydration(id);
  },

  bootIntoGridTrack (id = 598182) {
    return bootIntoURLPath(`/tracks/${id}?layout=gridify`, { width: 350, height: 350 });
  },

  bootIntoGridAlbum (passedInOptions) {
    const { id, size, coverInitially } = {
      ...({ id: 86804995, size: { width: 360, height: 360 }, coverInitially: false }),
      ...passedInOptions
    };

    bootIntoURLPath(`/albums/${id}?width=360px&height=360px&layout=gridify${coverInitially ? '&coverInitially=true' : ''}`, size);

    return waitForCollectionHydration(id);
  },

  bootIntoGridPlaylist (id = '0215d466-9f41-45bd-8c7b-75166fffb175') {
    bootIntoURLPath(`/playlists/${id}?width=540px&height=360px&layout=gridify`, { width: 360, height: 360 });

    return waitForCollectionHydration(id);
  },

  /*

  Kind note:

  <tidal-play-trigger> web comp is an unvisible element that triggers play on click.
  Cypress needs force: true on click methods to allow clicking on non-visible elements.

  */
  clickPlayPauseButton () {
    cy.get('.left-compartment tidal-play-trigger')
      .should('exist')
      .click({ force: true });
  },

  /**
   *
   * @param {'playing' | 'paused'} state
   */
  assertState (state) {
    if (state === 'playing') {
      cy.get('.media-is-playing').should('exist');
    } else {
      cy.get('.media-is-playing').should('not.exist');
    }
  }
};
