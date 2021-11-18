/*
 * Copyright 2021 OICR and UCSC
 *
 * Licensed under the Apache License, Version 2.0 (the &quot;License&quot;);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an &quot;AS IS&quot; BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { resetDB, setTokenUserViewPort, addOrganizationAdminUser } from '../../support/commands';

describe('Dockstore Categories', () => {
  const categoryName = 'foooo';
  const categoryDisplayName = 'Foooo';
  const categoryTopic = 'some topic';
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
      typeInInput('Display Name', categoryDisplayName);
      typeInInput('Topic', categoryTopic);
      cy.get('#createOrUpdateCollectionButton').should('be.visible').should('not.be.disabled').click();
      cy.contains(categoryDisplayName);
      cy.contains(categoryTopic);
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
      cy.get('mat-option').contains(categoryDisplayName).click();
      cy.get('#addEntryToCollectionButton').should('not.be.disabled').click();
    });
  });

  /*
   * The following ITs were written before I discovered that the current
   * UI2 CI process does not run Elasticsearch.  These tests will pass
   * if Elasticsearch is running and knows the categories mappings.
   * We leave the tests here, in disabled state, in case they may be
   * useful to someone, someday or somehow.
   **********************************************************************
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
   **********************************************************************
   */

  describe('Category buttons should appear in various places', () => {
    it('appear in entry summary on collection page', () => {
      cy.visit('/organizations/dockstore/collections/' + categoryName);
      cy.get('app-category-button').contains(categoryDisplayName);
    });
    it('appear in tool page', () => {
      cy.visit(toolPath);
      cy.wait(1000); // give categories time to load
      cy.get('app-category-button').contains(categoryDisplayName);
    });
    it('appear in logged-out home page', () => {
      cy.clearLocalStorage();
      cy.visit('/');
      cy.get('app-category-button').contains(categoryDisplayName);
    });
  });

  describe('Category buttons should link to appropriate destination', () => {
    it('clickthrough to category search results', () => {
      cy.visit('/organizations/dockstore/collections/' + categoryName);
      cy.get('app-category-button').contains(categoryDisplayName).click();
      cy.url().should('include', '/search');
      cy.url().should('include', categoryName);
    });
  });
});
