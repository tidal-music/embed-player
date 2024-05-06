import {
  bootIntoClassicTrack,
  bootIntoGridAlbum
} from './helpers.js';

const selectors = {
  playPauseButton: '.right-compartment tidal-play-trigger',
  playIcon: '.playback-state-icon .play-icon svg',
  pauseIcon: '.playback-state-icon .pause-icon svg'
};

const stateClasses = {
  mediaIsPlayingClass: '.media-is-playing'
};

describe('Playback button', () => {
  describe('classic track', () => {
    it('is present', () => {
      bootIntoClassicTrack();

      cy.get(selectors.playPauseButton).should('exist');
    });

    it('starts playback when clicked', () => {
      bootIntoClassicTrack();

      cy.get(selectors.playPauseButton).click();
      cy.get(stateClasses.mediaIsPlayingClass).should('exist');
    });

    it('pauses playback second time clicked', () => {
      bootIntoClassicTrack();

      cy.get(selectors.playPauseButton).click();
      cy.get(stateClasses.mediaIsPlayingClass).should('exist');

      cy.get(selectors.playPauseButton).click();
      cy.get(stateClasses.mediaIsPlayingClass).should('not.exist');
    });

    it('shows the play SVG initially', () => {
      bootIntoClassicTrack();

      cy.get(selectors.playIcon).should('be.visible');
    });

    it('does not show the pause SVG initially', () => {
      bootIntoClassicTrack();

      cy.get(selectors.pauseIcon).should('not.be.visible');
    });

    it('shows the paused SVG when playing', () => {
      bootIntoClassicTrack();

      cy.get(selectors.playPauseButton).click();
      cy.get(selectors.pauseIcon).should('be.visible');
    });

    it('does not show the play SVG when playing', () => {
      bootIntoClassicTrack();

      cy.get(selectors.playPauseButton).click();
      cy.get(selectors.playIcon).should('not.be.visible');
    });

    it('shows the play SVG when paused', () => {
      bootIntoClassicTrack();

      cy.get(selectors.playPauseButton).click();
      cy.get(stateClasses.mediaIsPlayingClass).should('exist');
      cy.get(selectors.playPauseButton).click();
      cy.get(stateClasses.mediaIsPlayingClass).should('not.exist');
      cy.get(selectors.playIcon).should('be.visible');
    });

    it('does not show the pause SVG when paused', () => {
      bootIntoClassicTrack();

      cy.get(selectors.playPauseButton).click();
      cy.get(stateClasses.mediaIsPlayingClass).should('exist');
      cy.get(selectors.playPauseButton).click();
      cy.get(stateClasses.mediaIsPlayingClass).should('not.exist');

      cy.get(selectors.pauseIcon).should('not.be.visible');
    });
  });

  describe('grid album', () => {
    it('is present', () => {
      bootIntoGridAlbum();

      cy.get(selectors.playPauseButton).should('exist');
    });

    it('starts playback when clicked', () => {
      bootIntoGridAlbum();

      cy.get(selectors.playPauseButton).click();
      cy.get(stateClasses.mediaIsPlayingClass).should('exist');
    });

    it('pauses playback second time clicked', () => {
      bootIntoGridAlbum();

      cy.get(selectors.playPauseButton).click();
      cy.get(stateClasses.mediaIsPlayingClass).should('exist');

      cy.get(selectors.playPauseButton).click();
      cy.get(stateClasses.mediaIsPlayingClass).should('not.exist');
    });

    it('shows the play SVG initially', () => {
      bootIntoGridAlbum();

      cy.get(selectors.playIcon).should('be.visible');
    });

    it('does not show the pause SVG initially', () => {
      bootIntoGridAlbum();

      cy.get(selectors.pauseIcon).should('not.be.visible');
    });

    it('shows the paused SVG when playing', () => {
      bootIntoGridAlbum();

      cy.get(selectors.playPauseButton).click();
      cy.get(selectors.pauseIcon).should('be.visible');
    });

    it('does not show the play SVG when playing', () => {
      bootIntoGridAlbum();

      cy.get(selectors.playPauseButton).click();
      cy.get(selectors.playIcon).should('not.be.visible');
    });

    it('shows the play SVG when paused', () => {
      bootIntoGridAlbum();

      cy.get(selectors.playPauseButton).click();
      cy.get(stateClasses.mediaIsPlayingClass).should('exist');
      cy.get(selectors.playPauseButton).click();
      cy.get(stateClasses.mediaIsPlayingClass).should('not.exist');
      cy.get(selectors.playIcon).should('be.visible');
    });

    it('does not show the pause SVG when paused', () => {
      bootIntoGridAlbum();

      cy.get(selectors.playPauseButton).click();
      cy.get(stateClasses.mediaIsPlayingClass).should('exist');
      cy.get(selectors.playPauseButton).click();
      cy.get(stateClasses.mediaIsPlayingClass).should('not.exist');

      cy.get(selectors.pauseIcon).should('not.be.visible');
    });
  });
});
