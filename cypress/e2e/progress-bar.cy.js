import { bootIntoClassicTrack, bootIntoGridTrack } from './helpers.js';

const selectors = {
  playPauseButton: '.right-compartment tidal-play-trigger',
  progressBarTrack: 'tidal-progress-bar'
};

const stateClasses = {
  mediaIsPlayingClass: '.media-is-playing'
};

describe('Progress bar', () => {
  describe('classic track', () => {
    it('exists in DOM', () => {
      bootIntoClassicTrack();

      cy.get(selectors.progressBarTrack).should('exist');
    });

    it('visible initially', () => {
      bootIntoClassicTrack();

      cy.get(selectors.progressBarTrack).should('be.visible');
    });
  });

  describe('grid track', () => {
    it('exists in DOM', () => {
      bootIntoGridTrack();

      cy.get(selectors.progressBarTrack).should('exist');
    });

    // Cypress thinks elements with opacity: 0 are visible.
    // See: https://github.com/cypress-io/cypress/issues/677
    it.skip('not visible initially', () => {
      bootIntoGridTrack();

      cy.get(selectors.progressBarTrack).should('not.be.visible');
    });

    it('be visible after playback started', () => {
      bootIntoGridTrack();

      cy.get(selectors.playPauseButton).click();
      cy.get(stateClasses.mediaIsPlayingClass).should('exist');

      cy.get(selectors.progressBarTrack).should('be.visible');
    });
  });
});
