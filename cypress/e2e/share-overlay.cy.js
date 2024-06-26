import { bootIntoClassicTrack, bootIntoGridTrack } from './helpers.js';

const selectors = {
  shareButton: '.open-share-dialog',
  shareButtons: '.dialog--share .share-buttons',
  closeDialogButton: '.dialog--share .button--close-dialog',
  shareDialog: '.dialog--share',
  mediaInformation: '.dialog--share .media-information'
};

describe('Share dialog', () => {
  describe('(for classic track)', () => {
    it('becomes visible when clicking share button', () => {
      bootIntoClassicTrack();

      cy.get(selectors.shareButton).click();
      cy.get(selectors.shareDialog).should('have.attr', 'open');
    });

    it('becomes hidden when clicking close button inside dialog', () => {
      bootIntoClassicTrack();

      cy.get(selectors.shareButton).click();
      cy.get(selectors.shareDialog).should('have.attr', 'open');

      cy.get(selectors.closeDialogButton).click();
      cy.get(selectors.shareDialog).should('not.have.attr', 'open');
    });

    it('does not show title and artist name', () => {
      bootIntoClassicTrack();

      cy.get(selectors.shareButton).click();
      cy.get(selectors.shareDialog).should('have.attr', 'open');

      cy.get(selectors.mediaInformation).should('not.be.visible');
    });

    it('shows share buttons', () => {
      bootIntoClassicTrack();

      cy.get(selectors.shareButton).click();
      cy.get(selectors.shareDialog).should('have.attr', 'open');
      cy.get(selectors.shareButtons).should('be.visible');
    });
  });

  describe('(for grid track)', () => {
    it('shows title and artist name', () => {
      bootIntoGridTrack();

      cy.get(selectors.shareButton).click();
      cy.get(selectors.shareDialog).should('have.attr', 'open');

      cy.get(selectors.mediaInformation).should('be.visible');
    });

    it('shows share buttons', () => {
      bootIntoGridTrack();

      cy.get(selectors.shareButton).click();
      cy.get(selectors.shareDialog).should('have.attr', 'open');
      cy.get(selectors.shareButtons).should('be.visible');
    });
  });
});
