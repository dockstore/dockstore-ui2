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

      // Reset fires several searches (results, facets, autocomplete, suggestions); wait for all of them so the results stop re-rendering
      let pendingSearches = 0;
      cy.intercept('POST', '**/extended/tools/entry/_search', (req) => {
        pendingSearches++;
        req.on('after:response', () => pendingSearches--);
      });
      cy.contains('Reset').click();
      cy.url().should('not.include', 'search=dhockstore');
      cy.wrap(null).should(() => expect(pendingSearches).to.equal(0));

      cy.contains('Items per page');
      const searchPaginatorDataCy = '[data-cy=search-entry-table-paginator] mat-form-field';
      cy.get(searchPaginatorDataCy).contains(10).should('be.visible');
      // Change "Items per page" from the default 10 to 20, then check below that the choice survives navigating away and back.
      // Select with the keyboard rather than clicking the option, since the dropdown panel can be left off-screen if the results shift.
      cy.get(searchPaginatorDataCy).click();
      cy.get('.mat-mdc-select-panel').should('be.visible');
      cy.get(`${searchPaginatorDataCy} mat-select`).type('{downArrow}{enter}');
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
