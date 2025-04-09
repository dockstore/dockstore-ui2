import { isStagingOrProd, typeInInput } from '../../../support/commands';

describe('Admin UI', () => {
  before(() => {
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

      cy.contains('Reset').click();
      cy.url().should('not.include', 'search=dhockstore');

      cy.contains('Items per page');
      // TODO: set to '[data-cy=search-entry-table-paginator]' when search cards are in staging and prod
      const searchPaginatorDataCy = isStagingOrProd()
        ? '[data-cy=search-workflow-table-paginator]'
        : '[data-cy=search-entry-table-paginator]';
      cy.get(searchPaginatorDataCy).contains(10).should('be.visible').click();
      cy.get('mat-option').contains(20).click();
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
