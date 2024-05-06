import { bootIntoVideo } from './helpers.js';

const selectors = {
  wrapper: '.embed-player',
  playPauseButton: '.play-pause-button',
  toggleFullscreenButton: '.toggle-fullscreen',
  hidingVictim: '.ui-hide-cleaning-victim'
};

const stateClasses = {
  fullscreenEnabled: '.fullscreen-enabled',
  fullscreenActive: '.fullscreen-active',
  mediaIsPlayingClass: '.media-is-playing'
};

describe('Fullscreen', () => {
  it('has toggle fullscreen button if fullscreen is supported', () => {
    bootIntoVideo();
    cy.get(stateClasses.fullscreenEnabled).should('exist');
    cy.get(selectors.toggleFullscreenButton).should('exist');
  });

  // User gesture enforcement blocking cypress from opening full screen,
  it.skip('opens fullscreen when clicking toggle fullscreen button', () => {
    bootIntoVideo();

    cy.get(selectors.playPauseButton).click();
    cy.get(stateClasses.mediaIsPlayingClass).should('exist');

    // Cypress does not have "hover", need to force click of hidden element.
    cy.get(selectors.toggleFullscreenButton).click({ force: true });
    cy.get(stateClasses.fullscreenActive).should('exist');
  });
});

/*
'Closes fullscreen when clicking toggle fullscreen button in fullscreen' (browser) {
    bootIntoVideo(browser)
      .click(playPauseButton)
      .waitForElementPresent(mediaIsPlayingClass)
      .click(toggleFullscreenButton)
      .waitForElementPresent(fullscreenActive)
      .click(toggleFullscreenButton)
      .waitForElementNotPresent(fullscreenActive);
  },

  'Hides the UI after some seconds of inactivity after mouse move' (browser) {
    bootIntoVideo(browser)
      .click(playPauseButton)
      .waitForElementPresent(mediaIsPlayingClass)
      .click(toggleFullscreenButton)
      .waitForElementPresent(fullscreenActive)
      .click(toggleFullscreenButton)
      .pause(3000)
      .assert.hidden(hidingVictim);
  }
*/
