import { bootIntoVideo, bootIntoGridPlaylist } from './helpers.js';

const selectors = {
  externalLinkFinishedDialog: '.dialog--finished .external-link',
  externalLinkMediaItemList: '.media-item-list-wrapper .external-link'
};

describe('External link', () => {
  it('exists in finished dialog', () => {
    bootIntoVideo();

    cy.get(selectors.externalLinkFinishedDialog).should('exist');
  });

  it('exists in media item list', () => {
    bootIntoGridPlaylist();

    cy.get(selectors.externalLinkMediaItemList).should('exist');
  });
});
