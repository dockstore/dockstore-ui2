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
    cy.get(selector).should('have.attr', 'href').and('include', url);
  });
  return;
}

function aboutPageExternalLink(selector: string, url: string): void {
  it('Check links', () => {
    cy.visit('/about');
    cy.get(selector).should('have.attr', 'href').and('include', url);
  });
}

const selectorLinkTuples = [
  ['[data-cy=register-button]', '/register'],
  ['[data-cy=footer-about-link]', '/about'],
  ['[data-cy=homepage-organizations-button]', '/organizations'],
  ['[data-cy=footer-organizations-link]', '/organizations'],
  ['[data-cy=footer-search-link]', '/search'],
];

const externalLinkTuples = [
  ['[data-cy=homepage-discuss-link]', 'discuss.dockstore.org'],
  ['[data-cy=footer-api-link]', '/static/swagger-ui/index.html'],
  ['[data-cy=footer-documentation-link]', '/dockstore-introduction.html'],
];

const aboutExternalLinkTuples = [
  ['[data-cy=docker-hub-about-link]', 'hub.docker.com'],
  ['[data-cy=github-about-link]', 'github.com/dockstore/dockstore'],
];

before(() => {
  cy.visit('/about');
});

describe('Monitor about page links', () => {
  describe('Monitor about page links', () => {
    it('Check links', () => {
      cy.visit('/about');
      cy.get('[data-cy=about-more-info-link]').click();
      cy.url().should('include', '/funding');
    });
  });

  describe('Monitor external about page links', () => {
    aboutExternalLinkTuples.forEach((t) => aboutPageExternalLink(t[0], t[1]));
  });
});

before(() => {
  cy.visit('');
});

describe('Monitor homepage links', () => {
  describe('Check links', () => {
    selectorLinkTuples.forEach((t) => checkLink(t[0], t[1]));
  });
  describe('Monitor external homepage links', () => {
    externalLinkTuples.forEach((t) => checkExternalLink(t[0], t[1]));
  });
  describe('Test RSS feed', () => {
    it('access RSS feed', () => {
      cy.get('[data-cy=footer-rss-link]').then((t) => {
        cy.request(t.prop('href')).its('body').should('include', '<rss version="2.0">');
      });
    });
  });
});
