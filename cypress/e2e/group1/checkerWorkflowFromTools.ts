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

describe('Checker workflow test from my-tools', () => {
  resetDB();
  setTokenUserViewPort();
  beforeEach(() => {
    cy.intercept('api/containers/*?include=validations').as('getTool');
    // Visit my-tools page
    cy.visit('/my-tools');
  });

  function goToB3() {
    selectSidebarEntry('quay.io/A2/b3');
  }

  describe('Should be able to register and publish a checker workflow from a tool', () => {
    it('visit a tool and have the correct buttons and be able to register a checker workflow', () => {
      cy.wait('@getTool');
      goToB3();

      cy.get('#viewCheckerWorkflowButton').should('not.exist');
      cy.get('#viewParentEntryButton').should('not.exist');
      cy.get('#launchCheckerWorkflow').should('not.exist');
      cy.get('#addCheckerWorkflowButton').should('be.visible').click();

      cy.get('#checkerWorkflowPath').should('be.visible').type('/Dockstore.cwl');

      cy.get('#checkerWorkflowTestParameterFilePath').should('be.visible').type('/test.json');

      cy.get('#submitButton').click();

      // There appears to be an error. The modal will not close automatically.
      cy.contains('Close').click();
      cy.get('#addCheckerWorkflowButton').should('not.exist');
      cy.get('#viewCheckerWorkflowButton').should('be.visible');
    });
    it('visit the tool and its checker workflow and have the correct buttons', () => {
      cy.intercept('api/containers/*?include=validations').as('getTool');
      cy.wait('@getTool');
      goToB3();
      // In the parent tool right now
      // Didn't change the tool path upon entry or select
      // cy.url().should('eq', 'http://localhost:4200/my-tools/quay.io/A2/b3')
      cy.get('#viewParentEntryButton').should('not.exist');
      cy.get('#addCheckerWorkflowButton').should('not.exist');
      goToLaunchTab();
      cy.get('#launchCheckerWorkflow').should('be.visible');
      goToInfoTab();
      cy.get('#viewCheckerWorkflowButton').should('be.visible').click();

      // In the checker workflow right now
      cy.url().should('eq', Cypress.config().baseUrl + '/my-workflows/github.com/A2/b3/_cwl_checker');
      cy.get('#viewCheckerWorkflowButton').should('not.exist');
      cy.get('#addCheckerWorkflowButton').should('not.exist');
      cy.wait(3000);
      goToLaunchTab();
      cy.get('#launchCheckerWorkflow').should('not.exist');
      goToInfoTab();
      cy.get('#viewParentEntryButton').should('be.visible').click();

      // In the parent tool right now
      cy.url().should('eq', Cypress.config().baseUrl + '/my-tools/quay.io/A2/b3');
      cy.get('#viewParentEntryButton').should('not.exist');
      cy.get('#addCheckerWorkflowButton').should('not.exist');
      goToLaunchTab();
      cy.get('#launchCheckerWorkflow').should('be.visible');
      goToInfoTab();
      cy.get('#viewCheckerWorkflowButton').should('be.visible');
    });
    it('visit the tool and have its publish/unpublish reflected in the checker workflow', () => {
      cy.intercept('api/containers/*?include=validations').as('getTool');
      cy.intercept('api/containers/4/publish').as('unpublishTool');
      cy.wait('@getTool');
      goToB3();
      // In the parent tool right now
      // Didn't change the tool path upon entry or select
      // cy.url().should('eq','/my-tools/quay.io/A2/b3')
      cy.get('#publishToolButton').should('be.visible').should('contain', 'Unpublish').click();
      cy.wait('@unpublishTool');

      goToVersionsTab();
      cy.contains('button', 'Actions').click(); // Clicking it should scroll it into view
      cy.get('[data-cy=set-default-version-button]').should('be.visible').click();
      goToInfoTab();

      cy.get('#publishToolButton').should('be.visible').should('contain', 'Publish');
      cy.wait(250);
      cy.get('#viewCheckerWorkflowButton').should('be.visible').click();

      // In the checker workflow right now
      cy.get('#workflow-path').should('contain', '_checker');
      cy.url().should('eq', Cypress.config().baseUrl + '/my-workflows/github.com/A2/b3/_cwl_checker');
      cy.get('#publishButton').should('be.visible').should('contain', 'Publish');
      cy.get('#viewParentEntryButton').should('be.visible').click();

      // In the parent tool right now
      cy.get('#tool-path').should('not.contain', '_checker');
      cy.url().should('eq', Cypress.config().baseUrl + '/my-tools/quay.io/A2/b3');
      cy.get('#publishToolButton').should('be.visible').should('contain', 'Publish').click();
      cy.get('#publishToolButton').should('be.visible').should('contain', 'Unpublish');
      cy.wait(250);
      cy.get('#viewCheckerWorkflowButton').should('be.visible').click();

      // in the checker workflow right now
      cy.get('#workflow-path').should('contain', '_checker');
      cy.url().should('eq', Cypress.config().baseUrl + '/my-workflows/github.com/A2/b3/_cwl_checker');
      cy.get('#publishButton').should('be.visible').should('contain', 'Unpublish');
    });
  });
});
describe('Should be able to see the checker workflow from a tool', () => {
  setTokenUserViewPort();
  it('visit the tool with a checker workflow and have the correct buttons', () => {
    cy.visit('/search-containers');
    cy.get('mat-cell')
      .find('a')
      .contains('b3')
      .should('not.have.attr', 'href', '/containers/quay.io%20A2%20b3')
      .should('have.attr', 'href', '/containers/quay.io/A2/b3')
      .click();

    // In the parent tool right now
    cy.url().should('eq', Cypress.config().baseUrl + '/containers/quay.io/A2/b3:latest?tab=info');
    cy.get('#viewParentEntryButton').should('not.exist');
    cy.get('#addCheckerWorkflowButton').should('not.exist');
    goToLaunchTab();
    cy.get('#launchCheckerWorkflow').should('be.visible');
    goToInfoTab();
    cy.get('#viewCheckerWorkflowButton').should('be.visible').click();

    // In the checker workflow right now
    cy.url().should('eq', Cypress.config().baseUrl + '/workflows/github.com/A2/b3/_cwl_checker?tab=info');
    cy.get('#viewCheckerWorkflowButton').should('not.exist');
    cy.get('#addCheckerWorkflowButton').should('not.exist');
    goToLaunchTab();
    cy.get('#launchCheckerWorkflow').should('not.exist');
    goToInfoTab();
    cy.get('#viewParentEntryButton').should('be.visible').click();

    // In the parent tool right now
    // Accidentally allow the uri "tools" to work
    cy.url().should('eq', Cypress.config().baseUrl + '/containers/quay.io/A2/b3:latest?tab=info');
    cy.get('#viewParentEntryButton').should('not.exist');
    cy.get('#addCheckerWorkflowButton').should('not.exist');
    goToLaunchTab();
    cy.get('#launchCheckerWorkflow').should('be.visible');
    goToInfoTab();
    cy.get('#viewCheckerWorkflowButton').should('be.visible');
  });
});
