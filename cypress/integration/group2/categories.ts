import { resetDB, setTokenUserViewPort, addOrganizationAdminUser } from '../../support/commands';

const categoryName = 'foooo';
const workflowPath = '/containers/quay.io/garyluu/dockstore-cgpmap/cgpmap-cramOut:3.0.0-rc8?tab=info';
const workflowSnippet = '3.0.0-rc8';

describe('Dockstore Categories', () => {
  resetDB();
  setTokenUserViewPort();

  function typeInInput(fieldName: string, text: string) {
    cy.contains('span', fieldName).parentsUntil('.mat-form-field-wrapper').find('input').first().should('be.visible').clear().type(text);
  }

  function clearInput(fieldName: string) {
    cy.contains('span', fieldName).parentsUntil('.mat-form-field-wrapper').find('input').clear();
  }

  function typeInTextArea(fieldName: string, text: string) {
    cy.contains('span', fieldName).parentsUntil('.mat-form-field-wrapper').find('textarea').clear().type(text);
  }

  function clickCheckbox(labelName: string) {
    cy.contains('span', labelName).parentsUntil('.mat-checkbox-layout').find('input').click();
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

  describe('Should be able to add a workflow to a category', () => {
    it('be able to add workflow to category', () => {
      cy.visit(workflowPath);
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

  describe('Category and categorized workflow should appear in search', () => {
    it('appear in search sidebar', () => {
      cy.visit('/search');
      cy.get('.search-container').get('mat-accordion').contains('Category');
      cy.get('.search-container').get('mat-accordion').contains(categoryName);
    });
    it('appear in search results if Category checkbox is clicked', () => {
      cy.visit('/search');
      clickCheckbox(categoryName);
      cy.get('.search-container').contains(workflowSnippet);
    });
  });
});
