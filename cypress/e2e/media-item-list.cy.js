import {
  bootIntoClassicTrack,
  bootIntoClassicAlbum,
  bootIntoClassicPlaylist,
  bootIntoGridTrack,
  bootIntoGridAlbum,
  bootIntoGridPlaylist,
  bootIntoVideo,
  clickPlayPauseButton
} from './helpers.js';

describe('Media item list', () => {
  describe('video', () => {
    it('should not have media item list in DOM', () => {
      bootIntoVideo();

      cy.get('media-item-list').should('not.exist');
    });
  });

  describe('classic track', () => {
    it('should not have media item list in DOM', () => {
      bootIntoClassicTrack();

      cy.get('media-item-list').should('not.exist');
    });
  });

  describe('grid track', () => {
    it('should not have media item list in DOM', () => {
      bootIntoGridTrack();

      cy.get('media-item-list').should('not.exist');
    });
  });

  describe('classic album, 96px high', () => {
    it('should have media item list in DOM', () => {
      bootIntoClassicAlbum();

      cy.get('media-item-list').should('exist');
    });

    it('should not show media item list', () => {
      bootIntoClassicAlbum();

      cy.get('media-item-list').should('not.be.visible');
    });
  });

  describe('grid album', () => {
    it('should have media item list in DOM', () => {
      bootIntoGridAlbum();

      cy.get('media-item-list').should('exist');
    });

    it('should not show media item list', () => {
      bootIntoGridAlbum();

      cy.get('media-item-list').should('not.be.visible');
    });
  });

  describe('grid album - coverInitially=true', () => {
    it('should have media item list in DOM', () => {
      bootIntoGridAlbum({
        coverInitially: true
      });

      cy.get('media-item-list').should('exist');
    });

    it('should not show media item list', () => {
      bootIntoGridAlbum({
        coverInitially: true
      });

      cy.get('media-item-list').should('not.be.visible');
    });

    it('should show media item list after playback has been triggered', () => {
      bootIntoGridAlbum({
        coverInitially: true
      });

      cy.get('media-item-list').should('not.be.visible');
      clickPlayPauseButton();
      cy.get('media-item-list').should('be.visible');
    });
  });

  describe('classic playlist, 96px high', () => {
    it('should have media item list in DOM', () => {
      bootIntoClassicPlaylist();

      cy.get('media-item-list').should('exist');
    });

    it('should not show media item list', () => {
      bootIntoClassicPlaylist();

      cy.get('media-item-list').should('not.be.visible');
    });
  });

  describe('grid playlist', () => {
    it('should have media item list in DOM', () => {
      bootIntoGridPlaylist();

      cy.get('media-item-list').should('exist');
    });

    it('should not show media item list', () => {
      bootIntoGridPlaylist();

      cy.get('media-item-list').should('not.be.visible');
    });
  });
});
