/*
 *     Copyright 2018 OICR
 *
 *     Licensed under the Apache License, Version 2.0 (the "License")
 *     you may not use this file except in compliance with the License
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */
import { resetDB, setTokenUserViewPort } from '../../support/commands';

describe('Tool, Workflow, and Organization starring', () => {
  resetDB();
  setTokenUserViewPort();

  function typeInInput(fieldName: string, text: string) {
    cy.contains(fieldName).parentsUntil('.mat-form-field-wrapper')
      .find('input').first().should('be.visible').clear().type(text);
  }
  function beUnstarred() {
    cy
      .get('#starringButtonIcon')
      .should('be.visible');
    cy
      .get('#starCountButton')
      .should('contain', '0');
  }

  function beStarred() {
    cy
      .get('#unstarringButtonIcon')
      .should('be.visible');
    cy
      .get('#starCountButton')
      .should('contain', '1');
  }

  function entryStarring(url: string) {
    cy.visit(url);
    cy
      .get('#starringButton')
      .should('not.be.disabled')
      .should('be.visible');
    cy
      .get('#starCountButton')
      .should('not.be.disabled')
      .should('be.visible');

    beUnstarred();

    cy
      .get('#starCountButton')
      .click();

    cy
      .get('[data-cy=noStargazers]')
      .should('exist');

    cy
      .get('#backButton')
      .should('exist')
      .should('not.be.disabled')
      .click();

    beUnstarred();

    cy
      .get('#starringButton')
      .click();

    beStarred();

    cy
      .get('#starCountButton')
      .click();

    cy
      .get('[data-cy=noStargazers]')
      .should('not.exist');

    cy
      .get('#backButton')
      .should('exist')
      .should('not.be.disabled')
      .click();
  }

  function starredPage(entity: string) {
    cy
      .get('#dropdown-main')
      .click();
    cy
      .get('#dropdown-starred')
      .click();
    if (entity === 'tool') {
      cy
        .get('.mat-tab-label-content').contains('Starred Tools')
        .click();
    } else if (entity === 'workflow') {
      cy
        .get('.mat-tab-label-content').contains('Starred Workflows')
        .click();
     } else {
        cy
          .get('Starred Organizations')
          .click();
    }
    cy
      .get('#starringButton')
      .should('exist');
    cy
      .get('#starCountButton')
      .should('exist');
  }

  describe('Workflow starring', () => {
    it('Workflow can be starred/unstarred', () => {
      entryStarring('/workflows/github.com/A/l');
      starredPage('workflow');
    });
  });
  describe('Tool Starring', () => {
    it('Tool can be starred/unstarred', () => {
      entryStarring('/containers/quay.io/A2/a');
      starredPage('tool');
    });
  });
  describe('Organization Starring', () => {
    it.only('Organization can be starred/unstarred', () => {
      cy.visit('/organizations');
      cy.contains('button', 'Create Organization Request').should('be.visible').click();
      typeInInput('Name', 'Potato');
      typeInInput('Display Name', 'Potato');
      typeInInput('Topic', 'Boil \'em, mash \'em, stick \'em in a stew');
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('not.be.disabled').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/organizations/Potato');

      entryStarring('/organizations/Potato');
      starredPage('organization');
    });
  });
});
