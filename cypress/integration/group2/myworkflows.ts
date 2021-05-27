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
import { Repository } from '../../../src/app/shared/openapi/model/repository';
import { goToTab, isActiveTab, resetDB, setTokenUserViewPort } from '../../support/commands';

describe('Dockstore my workflows', () => {
  resetDB();
  setTokenUserViewPort();

  const cwlDescriptorType = 'CWL';
  const wdlDescriptorType = 'WDL';
  const nextflowDescriptorType = 'Nextflow';
  it('have entries shown on the homepage', () => {
    cy.visit('/');
    cy.contains(/^l$/);
    cy.contains('Find entries');
    cy.get('#mat-input-0').type('hosted');
    cy.contains('hosted-workflow');
    cy.get('#mat-input-0').type('potato');
    cy.contains('No matching entries');
  });

  it('have action buttons which work', () => {
    cy.server();
    cy.fixture('myWorkflows.json').then((json) => {
      cy.route({
        url: '/api/users/1/workflows',
        method: 'PATCH',
        status: 200,
        response: json,
      });
    });

    cy.visit('/my-workflows');
    cy.get('[data-cy=myWorkflowsMoreActionButtons]').should('be.visible').click();
    cy.get('[data-cy=addToExistingWorkflows]').should('be.visible').click();

    cy.contains('addedthisworkflowviasync');
  });

  describe('Should contain extended Workflow properties', () => {
    it('visit another page then come back', () => {
      cy.visit('/my-workflows');
      cy.get('a#home-nav-button').click();
      cy.get('[data-cy=dropdown-main]:visible').should('be.visible').click();
      cy.get('[data-cy=my-workflows-nav-button]').click();
      cy.contains('github.com/A/l');
    });
    it('should be able to see GitHub Apps Logs dialog', () => {
      cy.contains('See GitHub Apps Logs').click();
      cy.contains('There were problems retrieving GitHub App logs for this organization.');
      cy.contains('Close').click();
      cy.server();
      cy.route({
        method: 'GET',
        url: '/api/lambdaEvents/**',
        response: [],
      }).as('refreshWorkflow');
      cy.contains('See GitHub Apps Logs').click();
      cy.contains('There are no GitHub App logs for this organization.');
      cy.contains('Close').click();
      const realResponse = [
        {
          eventDate: 1582165220000,
          githubUsername: 'boil',
          id: 1,
          message: 'HTTP 418 ',
          organization: 'dockstore',
          reference: 'refs/tag/1.03',
          repository: 'hello_world',
          success: false,
          type: 'PUSH',
        },
        {
          eventDate: 1591368041850,
          githubUsername: 'em',
          id: 2,
          message: 'HTTP 418 ',
          organization: 'dockstore',
          reference: 'refs/tag/1.03',
          repository: 'hello_world',
          success: false,
          type: 'PUSH',
        },
      ];
      cy.route({
        method: 'GET',
        url: '/api/lambdaEvents/**',
        response: realResponse,
      }).as('refreshWorkflow');
      cy.contains('See GitHub Apps Logs').click();
      cy.contains('2020-02-20T02:20');
      cy.contains('2020-06-05T14:40');
      cy.contains('1 – 2 of 2');
      cy.contains('Close').click();
    });
    it('Should contain the extended properties and be able to edit the info tab', () => {
      cy.visit('/my-workflows/github.com/A/g');
      cy.contains('github.com');
      cy.get('a#sourceRepository').contains('A/g').should('have.attr', 'href', 'https://github.com/A/g');
      cy.contains('/Dockstore.cwl');
      // Change the file path
      cy.contains('button', ' Edit ').click();
      cy.get('input').clear().type('/Dockstore2.cwl');
      cy.contains('button', ' Save ').click();
      cy.visit('/my-workflows/github.com/A/g');
      cy.contains('/Dockstore2.cwl');
      // Change the file path back
      cy.contains('button', ' Edit ').click();
      cy.get('input').clear().type('/Dockstore.cwl');
      cy.contains('button', ' Save ').click();
      cy.visit('/my-workflows/github.com/A/g');
      cy.contains('/Dockstore.cwl');
    });
    it('should have mode tooltip', () => {
      // .trigger('mouseover') doesn't work for some reason
      cy.contains('Mode').trigger('mouseenter');
      cy.get('.mat-tooltip').contains('STUB: Basic metadata pulled from source control.');
    });
    it('should be able to add labels', () => {
      cy.contains('github.com/A/g');
      cy.get('button').contains('Manage labels').click();
      cy.get('input').type('potato');
      cy.get('button').contains('Save').click();
      cy.get('button').contains('Save').should('not.exist');
    });
    it('add and remove test parameter file', () => {
      cy.visit('/my-workflows/github.com/A/l');
      cy.contains('Versions').click();
      cy.get('td').contains('Actions').click();
      cy.get('.cdk-overlay-connected-position-bounding-box').contains('Edit').click();
      // For some reason, it would type half in the correct input field, but the other half in the first field
      cy.wait(2000);
      cy.get('[data-cy=test-parameter-file-input]').click();
      cy.get('[data-cy=test-parameter-file-input]').type('/test.wdl.json');
      cy.get('[data-cy=save-version').click();
      cy.get('[data-cy=save-version').should('not.exist');
      cy.get('td').contains('Actions').click();
      cy.get('.cdk-overlay-connected-position-bounding-box').contains('Edit').click();
      cy.get('[data-cy=remove-test-parameter-file-button]').click();
      cy.get('[data-cy=save-version').click();
      cy.get('[data-cy=save-version').should('not.be.visible');
    });

    it('Should be able to snapshot', () => {
      cy.visit('/my-workflows/github.com/A/l');
      cy.url().should('eq', Cypress.config().baseUrl + '/my-workflows/github.com/A/l');
      goToTab('Versions');
      cy.get('[data-cy=dockstore-snapshot-locked]').should('have.length', 0);
      // The buttons should be present
      cy.get('td').contains('Actions').click();
      cy.get('[data-cy=dockstore-request-doi-button]').its('length').should('be.gt', 0);
      cy.get('[data-cy=dockstore-snapshot]').its('length').should('be.gt', 0);

      cy.get('[data-cy=dockstore-snapshot-unlocked]').its('length').should('be.gt', 0);

      cy.get('[data-cy=dockstore-snapshot]').first().click();

      cy.get('[data-cy=snapshot-button]').click();

      cy.wait(250);
      cy.get('[data-cy=dockstore-snapshot-locked').should('have.length', 1);
    });
  });

  it('Should be able to view a dockstore.yml workflow', () => {
    cy.visit('/my-workflows/github.com/B/z');
    cy.url().should('eq', Cypress.config().baseUrl + '/my-workflows/github.com/B/z');
    cy.contains('Automatically synced via GitHub App');

    cy.get('#publishButton').should('not.be.disabled');
    cy.get('#refreshButton').should('not.exist');

    cy.contains('Workflow Path').should('not.exist');
    cy.contains('Test File Path').should('not.exist');

    // Should not be able to refresh a dockstore.yml workflow version
    goToTab('Versions');
    cy.contains('button', 'Actions').should('be.visible').click();
    cy.contains('button', 'Refresh Version').should('be.disabled');

    cy.get('body').type('{esc}');

    // Test file content
    goToTab('Files');

    cy.contains('/Dockstore.cwl');
    cy.contains('class: Workflow');

    cy.get('mat-tab-body').within((tabBody) => {
      cy.get('mat-select').click();
    });

    cy.get('mat-option').contains('md5sum-tool.cwl').click();
    cy.contains('class: CommandLineTool');

    goToTab('Configuration');
    cy.contains('Configuration');
    cy.contains('/.dockstore.yml');
  });

  it('Should be able to refresh a workflow version', () => {
    cy.visit('/my-workflows/github.com/A/l');
    cy.url().should('eq', Cypress.config().baseUrl + '/my-workflows/github.com/A/l');
    goToTab('Versions');
    cy.contains('button', 'Actions').should('be.visible').click();
    cy.contains('button', 'Refresh Version').should('not.be.disabled');
  });

  it('Should refresh individual repo when refreshing organization', () => {
    cy.server();
    cy.fixture('refreshedAslashl').then((json) => {
      cy.route({
        method: 'GET',
        url: '/api/workflows/11/refresh',
        response: json,
      }).as('refreshWorkflow');
    });
    cy.visit('/my-workflows/github.com/A/l');
    cy.url().should('eq', Cypress.config().baseUrl + '/my-workflows/github.com/A/l');
    goToTab('Versions');
    cy.get('table>tbody>tr').should('have.length', 2); // 2 Versions and no warning line
    cy.get('[data-cy=refreshOrganization]:visible').should('be.visible').click();
    cy.wait('@refreshWorkflow');
    goToTab('Versions');
    cy.get('table>tbody>tr').should('have.length', 1); // 2 Versions and no warning line
  });

  describe('Look at an invalid workflow', () => {
    it('Invalid workflow should not be publishable', () => {
      cy.visit('/my-workflows/github.com/A/g');
      cy.get('#publishButton').should('be.disabled');
      cy.get('#refreshButton').should('not.be.disabled');
    });
  });

  function haveAlert() {
    cy.get('.mat-error').should('be.visible');
  }

  function notHaveAlert() {
    cy.get('.mat-error').should('not.be.visible');
  }

  describe('Test workflow wizard form', () => {
    it('It should be able to add workflows to ', () => {
      // Mock endpoints
      const canDeleteMe: Repository = {
        organization: 'foobar',
        repositoryName: 'canDeleteMe',
        gitRegistry: 'github.com',
        present: true,
        canDelete: true,
        path: 'foobar/canDeleteMe',
      };
      const cannotDeleteMe: Repository = {
        organization: 'foobar',
        repositoryName: 'cannotDeleteMe',
        gitRegistry: 'github.com',
        present: true,
        canDelete: false,
        path: 'foobar/cannotDeleteMe',
      };
      const doesNotExist: Repository = {
        organization: 'foobar',
        repositoryName: 'doesNotExist',
        gitRegistry: 'github.com',
        present: false,
        canDelete: false,
        path: 'foobar/doesNotExist',
      };

      cy.server()
        .route({
          method: 'GET',
          url: 'api/users/registries',
          response: ['github.com', 'bitbucket.org'],
        })
        .route({
          method: 'GET',
          url: 'api/users/registries/github.com/organizations',
          response: ['foobar', 'lorem'],
        })
        .route({
          method: 'GET',
          url: 'api/users/registries/github.com/organizations/foobar',
          response: [canDeleteMe, cannotDeleteMe, doesNotExist],
        });

      cy.visit('/my-workflows');
      cy.get('#registerWorkflowButton').should('be.visible').should('be.enabled').click();
      // TODO: Fix this.  When 'Next' is clicked too fast, the next step is empty
      cy.wait(1000);
      cy.get('#1-register-workflow-option').click();
      cy.contains('button', 'Next').click();

      // Select github.com in git registry
      cy.get('entry-wizard').within(() => {
        cy.get('mat-select').eq(0).click().type('{enter}');
        cy.get('mat-select').eq(1).click().type('{enter}');

        // foobar/canDeleteMe should be on and not disabled
        cy.get('mat-slide-toggle').eq(0).should('not.have.class', 'mat-disabled').should('have.class', 'mat-checked');
        // foobar/cannotDeleteMe should be on and disabled
        cy.get('mat-slide-toggle').eq(1).should('have.class', 'mat-disabled').should('have.class', 'mat-checked');

        // foobar/doesNotExist should be off and not disabled
        cy.get('mat-slide-toggle').eq(2).should('not.have.class', 'mat-disabled').should('not.have.class', 'mat-checked');
      });
    });
  });

  describe('Test register workflow form validation', () => {
    it('It should have 3 seperate descriptor path validation patterns', () => {
      cy.visit('/my-workflows');
      cy.get('#registerWorkflowButton').should('be.visible').should('be.enabled').click();
      // TODO: Fix this.  When 'Next' is clicked too fast, the next step is empty
      cy.wait(1000);
      cy.get('#2-register-workflow-option').click();
      cy.contains('button', 'Next').click();
      // Untouched form should not have errors but is disabled
      cy.get('#submitButton').should('be.disabled');
      notHaveAlert();
      cy.get('#sourceCodeRepositoryInput').clear().type('beef/stew');
      cy.get('#submitButton').should('be.disabled');
      cy.get('#sourceCodeRepositoryWorkflowPathInput').clear().type('/Dockstore.cwl');
      notHaveAlert();
      // Apparently the actual radio button inside Angular material buttons is hidden, so doing it this way
      cy.get('#descriptorTypeRadioButtons').contains(cwlDescriptorType).find('.mat-radio-container').click();
      cy.get('#descriptorTypeRadioButtons').contains(wdlDescriptorType).find('.mat-radio-container').click();
      haveAlert();
      cy.get('#sourceCodeRepositoryWorkflowPathInput').clear().type('/Dockstore.wdl');
      notHaveAlert();
      cy.get('#descriptorTypeRadioButtons').contains(nextflowDescriptorType).find('.mat-radio-container').click();
      haveAlert();
      cy.get('#sourceCodeRepositoryWorkflowPathInput').clear().type('/Dockstore.config');
      notHaveAlert();
      cy.get('#descriptorTypeRadioButtons').contains(cwlDescriptorType).find('.mat-radio-container').click();
      haveAlert();
      cy.get('#sourceCodeRepositoryWorkflowPathInput').clear().type('/Dockstore.cwl');
      notHaveAlert();
      cy.get('#closeRegisterWorkflowModalButton').contains('button', 'Close').should('be.visible').should('be.enabled').click();
      cy.get('#closeRegisterWorkflowModalButton').should('not.be.visible');
    });
  });

  describe('Look at a published workflow', () => {
    it('Look at each tab', () => {
      const tabs = ['Info', 'Launch', 'Versions', 'Files', 'Tools', 'DAG'];
      cy.visit('/my-workflows/github.com/A/l');
      isActiveTab('Info');
      tabs.forEach((tab) => {
        goToTab(tab);
        isActiveTab(tab);
        if (tab === 'Versions') {
          cy.get('table>tbody>tr').should('have.length', 2); // 2 Versions and no warning line
        }
      });

      cy.get('#publishButton').should('contain', 'Unpublish').click();

      cy.get('#viewPublicWorkflowButton').should('not.be.visible');

      cy.get('#publishButton').should('be.visible').should('contain', 'Publish').click();

      cy.get('#publishButton').should('contain', 'Unpublish');

      cy.get('#viewPublicWorkflowButton').should('be.visible').click();

      cy.url().should('eq', Cypress.config().baseUrl + '/workflows/github.com/A/l:master?tab=info');
    });
  });
  it('Refresh Organization button should have tooltip', () => {
    cy.visit('/my-workflows/github.com/A/l');
    cy.get(
      '#cdk-accordion-child-2 > .mat-action-row.ng-star-inserted > div > :nth-child(2) > ' +
        'app-refresh-workflow-organization > [data-cy=refreshOrganization]'
    ).trigger('mouseenter');
    cy.get('.mat-tooltip').contains('Refresh all workflows in the organization');
  });
});
