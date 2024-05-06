
it('loads landing page no one should ever see', () => {
  cy.visit('/');
  cy.contains('Taylor Swift');
});

it('loads testing page', () => {
  cy.visit('/test');
  cy.contains('TIDAL Embed Types Test Page');
});
