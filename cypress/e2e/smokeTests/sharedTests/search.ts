import { typeInInput } from '../../../support/commands';

describe('Admin UI', () => {
  beforeEach(() => {
    cy.visit('');
    cy.get('a').contains('Search').click();
  });

  describe('Basic search functions', () => {
    it('should arrive on the correct page', () => {
      cy.url().should('include', '/search');
      cy.get('mat-checkbox').parent().contains('WDL').click();
      cy.contains('the Language is WDL');
      cy.url().should('include', '/search?descriptorType=WDL');
      cy.go('back');
      cy.url().should('not.include', '/search?descriptorType=WDL');
      cy.contains('the Language is WDL').should('not.exist');
      cy.go('forward');
      cy.url().should('include', '/search?descriptorType=WDL');
      cy.contains('the Language is WDL').should('exist');
      typeInInput('basic-search', 'dhockstore{enter}');
      cy.contains(' Sorry, no matches found for dhockstore');
      cy.contains(/Do[ ]you[ ]mean:[ ].+/);
      cy.url().should('include', 'search=dhockstore');

      cy.intercept('POST', '**/extended/tools/entry/_search').as('search');
      cy.contains('Reset').click();
      cy.wait('@search');
      cy.url().should('not.include', 'search=dhockstore');

      cy.contains('Items per page');
      const searchPaginatorDataCy = '[data-cy=search-entry-table-paginator] mat-form-field';
      cy.get(searchPaginatorDataCy).contains(10).should('be.visible');
      cy.get(searchPaginatorDataCy).click();
      // Change "Items per page" from the default 10 to 20, then check below that the choice survives navigating away and back.
      // Match only options in the open dropdown panel, and exactly "20".
      cy.get('.mat-mdc-select-panel mat-option')
        .contains(/^\s*20\s*$/)
        .click();
      cy.get(searchPaginatorDataCy).contains(20);
      cy.get('a').contains('Organizations').click();
      cy.go('back');
      cy.get(searchPaginatorDataCy).contains(20);

      typeInInput('basic-search', 'dockstore_{enter}');
      cy.contains('Open Advanced Search').click();
      cy.contains('button', /^Advanced Search$/)
        .should('be.visible')
        .click();
      cy.url().should('not.include', '/search?search=dockstore_');
    });
  });
});
