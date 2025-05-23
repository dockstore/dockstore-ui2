/*
 *    Copyright 2018 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { goToInfoTab, goToLaunchTab, goToVersionsTab, resetDB, selectSidebarEntry, setTokenUserViewPort } from '../../support/commands';

describe('Checker workflow test from my-workflows', () => {
  resetDB();
  setTokenUserViewPort();
  beforeEach(() => {
    // Visit my-workflows page
    cy.visit('/my-workflows');
  });

  /**
   * This specifically gets the 'l' workflow, not something containing the 'l', but exactly 'l'
   */
  function getWorkflow() {
    selectSidebarEntry('github.com/A/l');
  }

  describe('Should be able to register and publish a checker workflow from a workflow', () => {
    it('visit a tool and have the correct buttons and be able to register a checker workflow', () => {
      getWorkflow();
      cy.url().should('eq', Cypress.config().baseUrl + '/my-workflows/github.com/A/l');
      cy.get('#viewCheckerWorkflowButton').should('not.exist');
      cy.get('#viewParentEntryButton').should('not.exist');
      cy.get('#addCheckerWorkflowButton').should('be.visible');
      goToLaunchTab();
      cy.get('#launchCheckerWorkflow').should('not.exist');
      goToInfoTab();
      cy.get('#addCheckerWorkflowButton').should('be.visible').click();
      cy.get('#checkerWorkflowPath').should('be.visible').type('/Dockstore.cwl');
      cy.get('#checkerWorkflowTestParameterFilePath').should('be.visible').type('/test.json');
      cy.fixture('refreshedChecker').then((json) => {
        cy.intercept('GET', '/api/workflows/*/refresh', {
          body: json,
        });
        cy.get('#submitButton').click();
      });

      // Actions should be possible right after registering checker workflow
      cy.get('#viewCheckerWorkflowButton').should('be.visible');
      cy.get('#viewParentEntryButton').should('not.exist');
      cy.get('#viewCheckerWorkflowButton').should('not.be.disabled').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/my-workflows/github.com/A/l/_cwl_checker');
      cy.contains('github.com/A/l/_cwl_checker');
      cy.get('#addCheckerWorkflowButton').should('not.exist');
      cy.get('#viewParentEntryButton').should('be.visible').click();
      cy.wait(300);
      cy.get('#workflow-path').contains('github.com/A/l');
      cy.url().should('eq', Cypress.config().baseUrl + '/my-workflows/github.com/A/l');
      cy.get('#viewParentEntryButton').should('not.exist');
      cy.get('#viewCheckerWorkflowButton').should('be.visible');
    });
    it('visit the workflow and its checker workflow and have the correct buttons', () => {
      getWorkflow();
      // In the parent workflow right now
      cy.url().should('eq', Cypress.config().baseUrl + '/my-workflows/github.com/A/l');
      cy.get('#viewParentEntryButton').should('not.exist');
      cy.get('#addCheckerWorkflowButton').should('not.exist');
      goToLaunchTab();
      cy.get('#launchCheckerWorkflow').should('be.visible');
      goToInfoTab();
      cy.wait(300);
      cy.get('#viewCheckerWorkflowButton').should('be.visible').click();

      // In the checker workflow right now

      cy.url().should('eq', Cypress.config().baseUrl + '/my-workflows/github.com/A/l/_cwl_checker');
      cy.get('#viewCheckerWorkflowButton').should('not.exist');
      cy.get('#addCheckerWorkflowButton').should('not.exist');
      goToLaunchTab();
      cy.get('#launchCheckerWorkflow').should('not.exist');
      goToInfoTab();
      cy.get('#viewParentEntryButton').should('be.visible').click();

      // In the parent workflow right now
      cy.url().should('eq', Cypress.config().baseUrl + '/my-workflows/github.com/A/l');
      cy.get('#viewParentEntryButton').should('not.exist');
      cy.get('#addCheckerWorkflowButton').should('not.exist');
      goToLaunchTab();
      cy.get('#launchCheckerWorkflow').should('be.visible');
      goToInfoTab();
      cy.get('#viewCheckerWorkflowButton').should('be.visible');
    });
    it('visit the workflow and have its publish/unpublish reflected in the checker workflow', () => {
      // The url should automatically change to include the workflow full path
      getWorkflow();
      // The url should automatically change to include the workflow full path
      // In the parent tool right now
      cy.url().should('eq', Cypress.config().baseUrl + '/my-workflows/github.com/A/l');
      // Hacky fix from https://github.com/cypress-io/cypress/issues/695
      cy.wait(1000);
      cy.get('#publishButton').should('be.visible').should('not.be.disabled').contains('Unpublish').click();
      // Need to wait because switching to another entry too fast will cause the new entry's checker workflow to be updated instead
      cy.wait(500);
      cy.get('#viewCheckerWorkflowButton').should('be.visible').click();

      // In the checker workflow right now
      cy.url().should('eq', Cypress.config().baseUrl + '/my-workflows/github.com/A/l/_cwl_checker');
      // The publish button should be disabled because the workflow is a stub since it was never truly refreshed
      cy.get('#publishButton').should('be.disabled');
      cy.get('#viewParentEntryButton').should('be.visible').click();

      // In the parent tool right now
      cy.url().should('eq', Cypress.config().baseUrl + '/my-workflows/github.com/A/l');

      goToVersionsTab();
      cy.wait(1000); //waits for the sorting to finish to ensure Actions button is clicked for the right version (was encountering flakiness)

      cy.contains('button', 'Actions').click();
      cy.get('[data-cy=set-default-version-button]').should('be.visible').click();
      goToInfoTab();

      // Hacky fix from https://github.com/cypress-io/cypress/issues/695
      cy.wait(1000);
      cy.get('#publishButton').should('be.visible').should('not.be.disabled').contains('Publish').click();
      // Need to wait because switching to another entry too fast will cause the new entry's checker workflow to be updated instead
      cy.wait(500);
      cy.get('#viewCheckerWorkflowButton').should('be.visible').click();

      // in the checker workflow right now
      cy.url().should('eq', Cypress.config().baseUrl + '/my-workflows/github.com/A/l/_cwl_checker');
      // The publish button should be disabled because the workflow is a stub since it was never truly refreshed
      cy.get('#publishButton').should('be.disabled');
    });
  });
});
describe('Should be able to see the checker workflow from a workflow', () => {
  setTokenUserViewPort();
  it('visit the tool with a checker workflow and have the correct buttons', () => {
    cy.visit('/workflows');
    cy.get('mat-cell')
      .find('a')
      // Grabbing the checker because couldn't figure out how to grab the 'l' workflow, it's not specific enough
      .contains('l/_cwl_checker')
      .should('not.have.attr', 'href', '/workflows/github.com%20A%20l')
      .should('have.attr', 'href', '/workflows/github.com/A/l/_cwl_checker')
      .click();

    // In the checker workflow right now
    // TODO: The version is not set because the checker does not actually have any versions. We should add some.
    cy.url().should('eq', Cypress.config().baseUrl + '/workflows/github.com/A/l/_cwl_checker?tab=info');
    cy.get('#viewCheckerWorkflowButton').should('not.exist');
    cy.get('#addCheckerWorkflowButton').should('not.exist');
    goToLaunchTab();
    cy.get('#launchCheckerWorkflow').should('not.exist');
    goToInfoTab();
    cy.get('#viewParentEntryButton').should('be.visible').click();

    // In the parent workflow right now
    cy.url().should('eq', Cypress.config().baseUrl + '/workflows/github.com/A/l:master?tab=info');
    cy.get('#viewParentEntryButton').should('not.exist');
    cy.get('#addCheckerWorkflowButton').should('not.exist');
    goToLaunchTab();
    cy.get('#launchCheckerWorkflow').should('be.visible');
    goToInfoTab();
    cy.get('#viewCheckerWorkflowButton').should('be.visible').click();

    // In the checker workflow right now
    cy.url().should('eq', Cypress.config().baseUrl + '/workflows/github.com/A/l/_cwl_checker?tab=info');
    cy.get('#viewCheckerWorkflowButton').should('not.exist');
    cy.get('#addCheckerWorkflowButton').should('not.exist');
    goToLaunchTab();
    cy.get('#launchCheckerWorkflow').should('not.exist');
    goToInfoTab();
    cy.get('#viewParentEntryButton').should('be.visible');
  });
});
