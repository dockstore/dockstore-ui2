import { ga4ghPath } from '../../../../src/app/shared/constants';
import { Dockstore } from '../../../../src/app/shared/dockstore.model';
import { goToTab } from '../../../support/commands';

// Test an entry, these should be ambiguous between tools and workflows.
describe('run stochastic smoke test', () => {
  testEntry('Tools');
  testEntry('Workflows');
});
function testEntry(tab: string) {
  beforeEach('get random entry on first page', () => {
    cy.visit('/search');
    // Fragile assertion that depends on the below workflow to be in the first table results, but not the 2nd
    cy.contains('DataBiosphere/topmed-workflows/UM_variant_caller_wdl');
    goToTab(tab);
    const linkName = tab === 'Workflows' ? 'workflowColumn' : 'toolNames';
    // select a random entry on the first page and navigate to it
    let chosen_index = 0;
    cy.get('[data-cy=' + linkName + ']')
      .then(($list) => {
        chosen_index = Math.floor(Math.random() * $list.length);
      })
      .eq(chosen_index)
      .within(() => {
        cy.get('a').then((el) => {
          cy.log(el.prop('href')); // log the href in case a test fails
          cy.visit(el.prop('href'));
        });
      });
  });

  it('check info tab', () => {
    // test export to zip button
    goToTab('Info');

    cy.get('[data-cy=downloadZip]').within(() => {
      cy.get('a').then((el) => {
        cy.request(el.prop('href')).its('status').should('eq', 200);
      });
    });
    cy.get('[data-cy=sourceRepository]').should('have.attr', 'href');
  });

  it('check files tab', () => {
    goToTab('Files');
    cy.url().should('contain', '?tab=files');
    cy.contains('Descriptor Files');
  });

  it('check versions tab', () => {
    goToTab('Versions');
    cy.url().should('contain', '?tab=versions');
    cy.get('[data-cy=versionRow]').should('have.length.of.at.least', 1);
  });
}

const organizations = [['Broad Institute']];
describe('Check organizations page', () => {
  it('has multiple organizations', () => {
    cy.contains('a', 'Organizations').click();
    cy.url().should('contain', '/organizations');
    cy.get('[data-cy=orgName]').should('have.length.of.at.least', 2);
  });

  organizations.forEach((t) => {
    it('organization page and collections work', () => {
      cy.contains('[data-cy=orgName]', t[0]).click();
      cy.get('[data-cy=collectionName').should('have.length.of.at.least', 1);
      cy.get('[data-cy=collectionName').first().click();
      cy.url().should('contain', 'collections');
      cy.get('[data-cy=collectionEntry]').should('have.length.of.at.least', 1);
    });
  });
});

describe('Test logged out home page', () => {
  it('find buttons', () => {
    cy.visit('/');
    cy.contains('[data-cy=register-button]', 'Register');
  });
  it('home page search bar works', () => {
    cy.visit('/');
    cy.get('input[id=searchBar]').type('test{enter}');
    cy.url().should('include', '/search?entryType=workflows&search=test');
  });
});

describe('Test search page functionality', () => {
  it('displays tools', () => {
    cy.visit('/search');
    cy.get('[data-cy=workflowColumn]').should('have.length.of.at.least', 1);
  });
  it('has working tag cloud', () => {
    cy.get('[data-cy=tagCloud]').should('not.exist');
    cy.contains('button', 'Popular Keywords').click();
    cy.get('[data-cy=tagCloud]').should('exist');
    cy.contains('button', 'Popular Keywords').click();
    cy.get('[data-cy=tagCloud]').should('not.exist');
  });
  it('searches', () => {
    cy.get('[data-cy=basic-search]').type('topmed{enter}');
    cy.url().should('contain', '/search?entryType=workflows&search=topmed');
  });
  it('filters and unfilters by facets', () => {
    cy.visit('/search');
    cy.contains('mat-checkbox', 'Nextflow').click();
    // Fragile assertion that depends on the below workflow to be in the first table results, but not the 2nd
    cy.contains('DataBiosphere/topmed-workflows/UM_variant_caller_wdl').should('not.exist');
    cy.get('[data-cy=descriptorType]').each(($el, index, $list) => {
      cy.wrap($el).contains('NFL');
    });
    cy.url().should('contain', 'descriptorType=NFL');
    cy.url().should('contain', 'searchMode=files');
    cy.contains('mat-checkbox', 'Nextflow').click();
    cy.url().should('not.contain', 'descriptorType=NF');
    cy.url().should('contain', 'searchMode=files');
  });
  it('boolean facet filters', () => {
    cy.visit('/search');
    cy.contains('mat-checkbox', /^[ ]*verified/).click();
    cy.url().should('contain', 'verified=1');
    // Fragile assertion that depends on the below workflow to be in the first table results, but not the 2nd
    cy.contains('nf-core/exoseq').should('not.exist');
    cy.get('[data-cy=verificationStatus]').each(($el, index, $list) => {
      cy.wrap($el).contains('done');
    });
  });
});

describe('Test workflow page functionality', () => {
  it('find a WDL workflow', () => {
    cy.visit('/search');
    cy.contains('.mat-tab-label', 'Workflows');
    cy.get('[data-cy=workflowColumn]').should('have.length.of.at.least', 1);

    // click twice to sort by descriptor type descending so WDL is at the top
    cy.get('[data-cy=descriptorTypeHeader]').click().click();
    cy.get('[data-cy=workflowColumn]')
      .first()
      .within(() => {
        cy.get('a').click(); // click on the link to the first workflow
      });
  });
});

describe('Check external links', () => {
  it('github, twitter, gitter, discuss links are correct', () => {
    cy.visit('');
    cy.get('[data-cy=GitHubFooterLink]').should('have.attr', 'href', 'https://github.com/dockstore/dockstore');
    cy.contains('a', '@DockstoreOrg').should('have.attr', 'href', 'https://twitter.com/DockstoreOrg');
    cy.contains('a', 'Gitter').should('have.attr', 'href', 'https://gitter.im/ga4gh/dockstore');
    cy.contains('a', 'Help Desk').should('have.attr', 'href', 'https://discuss.dockstore.org/t/opening-helpdesk-tickets/1506');
  });
});
