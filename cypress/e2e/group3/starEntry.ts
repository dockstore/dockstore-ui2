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
import { goToRequestsTab, goToTab, resetDB, setTokenUserViewPort, typeInInput } from '../../support/commands';

describe('Tool, Workflow, and Organization starring', () => {
  resetDB();
  setTokenUserViewPort();

  function beUnstarred() {
    cy.get('#starringButtonIcon').should('be.visible');
    cy.get('#starCountButton').should('contain', '0');
  }

  function beStarred() {
    cy.get('#unstarringButtonIcon').should('be.visible');
    cy.get('#starCountButton').should('contain', '1');
  }

  function entryStarring(url: string) {
    cy.visit(url);
    cy.get('#starringButton').should('not.be.disabled').should('be.visible');
    cy.get('#starCountButton').should('not.be.disabled').should('be.visible');

    beUnstarred();

    cy.get('#starCountButton').click();

    cy.get('[data-cy=noStargazers]').should('exist');

    cy.get('#backButton').should('exist').should('not.be.disabled').click();

    beUnstarred();

    cy.get('#starringButton').click();

    beStarred();

    cy.get('#starCountButton').click();

    cy.get('[data-cy=noStargazers]').should('not.exist');

    cy.get('#backButton').should('exist').should('not.be.disabled').click();
  }

  function starredPage(entity: string) {
    cy.visit('/starred');
    if (entity === 'tool') {
      goToTab('Tools');
    } else if (entity === 'workflow') {
      goToTab('Workflows');
    } else {
      goToTab('Organizations');
    }
    cy.get('#starringButton').should('exist');
    cy.get('#starCountButton').should('exist');
  }

  function starringUnapprovedOrg(orgUrl: string) {
    cy.visit(orgUrl);
    cy.get('#starringButton').should('not.exist');
    cy.get('#starCountButton').should('not.exist');
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
    it('Organization can be starred/unstarred', () => {
      cy.visit('/organizations');
      cy.contains('button', 'Create Organization Request').should('be.visible').click();
      cy.contains('button', 'Next').should('be.visible').click();
      typeInInput('name-input', 'Potato');
      typeInInput('display-name-input', 'Potato');
      typeInInput('topic-input', "Boil 'em, mash 'em, stick 'em in a stew");
      typeInInput('email-input', 'yukon@potato.com');
      cy.get('[data-cy=create-or-update-organization-button]').should('be.visible').should('not.be.disabled').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/organizations/Potato');

      starringUnapprovedOrg('organizations/Potato');

      // Approve org
      cy.visit('/accounts');
      goToRequestsTab();
      cy.get('#approve-pending-org-0').should('exist').click();
      cy.get('#approve-pending-org-dialog').contains('Approve').should('exist').click().wait(500);

      entryStarring('/organizations/Potato');
      starredPage('organization');
    });
  });
});
