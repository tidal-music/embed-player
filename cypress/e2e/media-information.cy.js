/* eslint-env node */

/*
  Tests here are valid for all embed states and sizes.
*/

import {
  bootIntoClassicTrack,
  bootIntoClassicAlbum,
  bootIntoClassicPlaylist,
  bootIntoGridTrack,
  bootIntoGridAlbum,
  bootIntoGridPlaylist,
  bootIntoVideo,
  clickPlayPauseButton,
  assertState
} from './helpers.js';

const victim = {
  id: 27872953,
  title: 'Nyponschottis',
  artist: 'The Original Swedish Arvika Blues Breakers'
};

describe('Media information', () => {
  describe('video', () => {
    it('has title', () => {
      bootIntoVideo();

      cy.contains('.right-compartment .media-title', 'Crazy in Love (feat. Jay-Z) (Official Video)');
    });

    it('has artist name', () => {
      bootIntoVideo();

      cy.contains('.right-compartment .media-artist', 'Beyoncé');
    });
  });

  describe('classic track', () => {
    it('has track title', () => {
      bootIntoClassicTrack(victim.id);

      cy.contains('.right-compartment .media-title', victim.title);
    });

    it('has artist name', () => {
      bootIntoClassicTrack(victim.id);

      cy.contains('.right-compartment .media-artist', victim.artist);
    });
  });

  describe('grid track', () => {
    it('has track title', () => {
      bootIntoGridTrack(victim.id);

      cy.contains('.right-compartment .media-title', victim.title);
    });

    it('has artist name', () => {
      bootIntoGridTrack(victim.id);

      cy.contains('.right-compartment .media-artist', victim.artist);
    });
  });

  describe('classic album', () => {
    it('has album title', () => {
      bootIntoClassicAlbum(27872943);

      cy.contains('.right-compartment .media-album', 'The Original Swedish Arvika Blues Breakers');
    });

    it('has artist name', () => {
      bootIntoClassicAlbum(27872943);

      cy.contains('.right-compartment .media-artist', 'The Original Swedish Arvika Blues Breakers');
    });

    it('shows track title when playing', () => {
      bootIntoClassicAlbum(27872943);

      clickPlayPauseButton();
      assertState('playing');

      cy.contains('.right-compartment .media-title', 'Juokse sinä humma');
    });
  });

  describe('grid album', () => {
    it('has album title', () => {
      bootIntoGridAlbum({ id: 27872943 });

      cy.contains('.right-compartment .media-album', 'The Original Swedish Arvika Blues Breakers');
    });

    it('has artist name', () => {
      bootIntoGridAlbum({ id: 27872943 });

      cy.contains('.right-compartment .media-artist', 'The Original Swedish Arvika Blues Breakers');
    });

    it('shows track title when playing', () => {
      bootIntoGridAlbum({ id: 27872943 });

      clickPlayPauseButton();
      assertState('playing');

      cy.contains('.right-compartment .media-title', 'Juokse sinä humma');
    });
  });

  describe('classic playlist', () => {
    it('has album title', () => {
      bootIntoClassicPlaylist('cb76ec3c-3963-4bf7-8a75-0060a1c43b43');

      cy.contains('.right-compartment .media-album', 'Late Night Jazz');
    });

    it('has artist name', () => {
      bootIntoClassicPlaylist('cb76ec3c-3963-4bf7-8a75-0060a1c43b43');

      cy.contains('.right-compartment .media-artist', 'User');
    });

    it('shows track title when playback begins', () => {
      bootIntoClassicPlaylist('cb76ec3c-3963-4bf7-8a75-0060a1c43b43');

      clickPlayPauseButton();
      assertState('playing');

      cy.contains('.right-compartment .media-title', 'Alone And I');
    });

    it('replaces playlist creator with artist name when playback begins', () => {
      bootIntoClassicPlaylist('cb76ec3c-3963-4bf7-8a75-0060a1c43b43');

      clickPlayPauseButton();
      assertState('playing');

      cy.contains('.right-compartment .media-artist', 'Herbie Hancock');
    });
  });

  describe('grid playlist', () => {
    it('has album title', () => {
      bootIntoGridPlaylist('cb76ec3c-3963-4bf7-8a75-0060a1c43b43');

      cy.contains('.right-compartment .media-album', 'Late Night Jazz');
    });

    it('shows track title when playback begins', () => {
      bootIntoGridPlaylist('cb76ec3c-3963-4bf7-8a75-0060a1c43b43');

      clickPlayPauseButton();
      assertState('playing');

      cy.contains('.right-compartment .media-title', 'Alone And I');
    });

    it('has artist name', () => {
      bootIntoGridPlaylist('cb76ec3c-3963-4bf7-8a75-0060a1c43b43');

      cy.contains('.right-compartment .media-artist', 'User');
    });

    it('replaces playlist creator with artist name when playback begins', () => {
      bootIntoGridPlaylist('cb76ec3c-3963-4bf7-8a75-0060a1c43b43');

      clickPlayPauseButton();
      assertState('playing');

      cy.contains('.right-compartment .media-artist', 'Herbie Hancock');
    });
  });
});
