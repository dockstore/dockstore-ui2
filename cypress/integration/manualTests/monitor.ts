import { goToTab } from '../../support/commands';

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

describe('Test launch button icons', () => {
  it('find a WDL workflow', () => {
    cy.visit('/search');
    cy.contains('.mat-tab-label', 'Workflows');
    cy.get('[data-cy=toolNames]').should('have.length.of.at.least', 1);
    goToTab('Workflows');

    // click twice to sort by descriptor type descending so WDL is at the top
    cy.get('[data-cy=descriptorType]')
      .click()
      .click();
    cy.get('[data-cy=workflowColumn]')
      .first()
      .within(() => {
        cy.get('a').click(); // click on the link to the first workflow
      });
  });

  it('get the svg icons', () => {
    cy.get('[data-cy=dnanexusIcon]').within(() => {
      cy.get('svg').should('exist');
    });
    cy.get('[data-cy=terraIcon]').within(() => {
      cy.get('svg').should('exist');
    });
    cy.get('[data-cy=anvilIcon]').within(() => {
      cy.get('svg').should('exist');
    });
  });
});
