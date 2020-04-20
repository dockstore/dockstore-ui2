function checkLink(selector: string, url: string): void {
  it('these links should be present', () => {
    cy.visit('');
    cy.get(selector).click();
    cy.url().should('include', url);
  });
}

function checkExternalLink(selector: string, url: string): void {
  it('Check External links', () => {
    cy.visit('');
    cy.get(selector)
      .should('have.attr', 'href')
      .and('include', url);
  });
  return;
}

const selectorLinkTuples = [
  ['[data-cy=register-button]', '/login'],
  ['[data-cy=homepage-organizations-button]', '/organizations'],
  ['[data-cy=homepage-search-link]', '/search']
];

const externalLinkTuples = [
  ['[data-cy=homepage-discuss-link]', 'discuss.dockstore.org'],
  ['[data-cy=footer-api-link]', '/static/swagger-ui/index.html'],
  ['[data-cy=footer-about-link]', '/dockstore-introduction.html']
];

before(() => {
  cy.visit('');
});

describe('Monitor homepage links', () => {
  describe('Check links', () => {
    selectorLinkTuples.forEach(t => checkLink(t[0], t[1]));
  });
  describe('Monitor external homepage links', () => {
    externalLinkTuples.forEach(t => checkExternalLink(t[0], t[1]));
  });

  describe('Test RSS feed', () => {
    it('access RSS feed', () => {
      cy.get('[data-cy=footer-rss-link]').then(t => {
        cy.request(t.prop('href'))
          .its('body')
          .should('include', '<rss version="2.0">');
      });
    });
  });
});

it('gets 200 response from gui.dockstore.org', () => {
  cy.visit('');
  // before the request goes out we need to set up spying
  cy.server();
  cy.route('GET', 'gui.dockstore.org').as('image');

  cy.get('@image').then(console.log);
  cy.get('@image').should('have.property', 'status', 200);
});
