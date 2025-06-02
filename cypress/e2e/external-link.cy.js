import { bootIntoVideo } from './helpers.js';

const selectors = {
  externalLinkFinishedDialog: '.dialog--finished .external-link',
};

describe('External link', () => {
  it('exists in finished dialog', () => {
    bootIntoVideo();

    cy.get(selectors.externalLinkFinishedDialog).should('exist');
  });
});
