import { resetDB, setTokenUserViewPort, addOrganizationAdminUser } from '../../support/commands';

describe('Dockstore Categories', () => {
  const categoryName = 'foooo';
  const toolPath = '/containers/quay.io/garyluu/dockstore-cgpmap/cgpmap-cramOut:3.0.0-rc8?tab=info';
  const toolSnippet = 'cgpmap-cramOut';

  resetDB();
  setTokenUserViewPort();

  function typeInInput(fieldName: string, text: string) {
    cy.contains('span', fieldName).parentsUntil('.mat-form-field-wrapper').find('input').first().should('be.visible').clear().type(text);
  }

  describe('Should be able to create a category', () => {
    it('be able to create a category', () => {
      addOrganizationAdminUser('dockstore', 'user_A');
      cy.visit('/organizations/dockstore');
      cy.get('#createCollection').click();
      cy.get('#createOrUpdateCollectionButton').should('be.visible').should('be.disabled');
      typeInInput('Name', categoryName);
      typeInInput('Display Name', categoryName);
      typeInInput('Topic', 'some topic');
      cy.get('#createOrUpdateCollectionButton').should('be.visible').should('not.be.disabled').click();
      cy.contains(categoryName);
      cy.contains('some topic');
    });
  });

  describe('Should be able to add a tool to a category', () => {
    it('be able to add tool to category', () => {
      cy.visit(toolPath);
      cy.get('#addToolToCollectionButton').should('be.visible').click();
      cy.get('#addEntryToCollectionButton').should('be.disabled');
      cy.get('#selectOrganization').click();
      cy.get('mat-option').contains('Dockstore').click();
      cy.get('#addEntryToCollectionButton').should('be.disabled');
      cy.get('#selectCollection').click();
      cy.get('mat-option').contains(categoryName).click();
      cy.get('#addEntryToCollectionButton').should('not.be.disabled').click();
    });
  });

  describe('Category and categorized tool should appear in search', () => {
    it('appear in search sidebar', () => {
      cy.visit('/search?entryType=tools');
      cy.get('.search-container').get('mat-accordion').contains('Category');
      cy.get('.search-container').get('mat-accordion').contains(categoryName);
    });
    it('appear exclusively in search results if Category checkbox is clicked', () => {
      cy.visit('/search?entryType=tools');
      cy.get('app-search-results').contains(toolSnippet);
      cy.get('app-search-results').contains('A2/a');
      cy.contains('mat-checkbox', categoryName).click();
      cy.get('app-search-results').contains(toolSnippet);
      cy.get('app-search-results').contains('A2/a').should('not.exist');
    });
  });
});
