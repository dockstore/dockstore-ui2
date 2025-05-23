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
import {
  resetDB,
  setTokenUserViewPort,
  insertNotebooks,
  addOrganizationAdminUser,
  addToCollection,
  typeInInput,
} from '../../support/commands';

describe('Dockstore Categories', () => {
  const categoryName = 'foooo';
  const categoryDisplayName = 'Foooo';
  const categoryTopic = 'some topic';
  const toolPath = '/containers/quay.io/garyluu/dockstore-cgpmap/cgpmap-cramOut:3.0.0-rc8?tab=info';
  const toolSnippet = 'cgpmap-cramOut';
  const workflowPath = '/workflows/github.com/A/l:master?tab=info';
  const notebookPath = '/notebooks/github.com/dockstore-testing/simple-notebook';

  resetDB();
  setTokenUserViewPort();

  describe('Should be able to create a category', () => {
    it('be able to create a category', () => {
      addOrganizationAdminUser('dockstore', 'user_A');
      cy.visit('/organizations/dockstore');
      cy.get('#createCollection').click();
      cy.get('#createOrUpdateCollectionButton').should('be.visible').should('be.disabled');
      typeInInput('name-input', categoryName);
      typeInInput('display-name-input', categoryDisplayName);
      typeInInput('topic-input', categoryTopic);
      cy.get('#createOrUpdateCollectionButton').should('be.visible').should('not.be.disabled').click();
      cy.contains(categoryDisplayName);
      cy.contains(categoryTopic);
    });
  });

  describe('Should be able to add a tool to a category', () => {
    it('be able to add tool to category', () => {
      addToCollection(toolPath, 'Dockstore', categoryDisplayName);
      cy.visit(toolPath);
      cy.get('[data-cy=categoriesBubble]').should('contain', categoryDisplayName);
    });
  });

  describe('Should be able to add a workflow to a category', () => {
    it('be able to add workflow to category', () => {
      addToCollection(workflowPath, 'Dockstore', categoryDisplayName);
      cy.visit(workflowPath);
      cy.get('[data-cy=categoriesBubble]').should('contain', categoryDisplayName);
    });
  });

  describe('Should be able to add a notebook to a category', () => {
    insertNotebooks();
    it('be able to add notebook to category', () => {
      addToCollection(notebookPath, 'Dockstore', categoryDisplayName);
      cy.visit(notebookPath);
      cy.get('[data-cy=categoriesBubble]').should('contain', categoryDisplayName);
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
      cy.get('app-category-button').contains(categoryDisplayName);
    });
    it('appear in workflow page', () => {
      cy.visit(workflowPath);
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
