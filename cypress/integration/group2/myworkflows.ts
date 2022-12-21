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
import { goToTab, isActiveTab, resetDB, setTokenUserViewPort, setTokenUserViewPortCurator } from '../../support/commands';

describe('Dockstore my workflows', () => {
  resetDB();
  setTokenUserViewPort();

  const cwlDescriptorType = 'CWL';
  const wdlDescriptorType = 'WDL';
  const nextflowDescriptorType = 'Nextflow';
  it('have entries shown on the homepage', () => {
    cy.visit('/dashboard');
    cy.contains(/^l$/);
    cy.contains('Find entries');
    cy.get('#mat-input-0').type('hosted');
    cy.contains('hosted-workflow');
    cy.get('#mat-input-0').type('potato');
    cy.contains('No matching entries');
  });

  it('have action buttons which work', () => {
    cy.fixture('myWorkflows.json').then((json) => {
      cy.intercept('PATCH', '/api/users/1/workflows', {
        body: json,
        statusCode: 200,
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
      cy.contains('Apps Logs').click();
      cy.contains('There were problems retrieving GitHub App logs for this organization.');
      cy.contains('Close').click();
      cy.intercept('GET', '/api/lambdaEvents/**', {
        body: [],
      }).as('refreshWorkflow');
      cy.contains('Apps Logs').click();
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
      cy.intercept('GET', '/api/lambdaEvents/**', {
        body: realResponse,
      }).as('refreshWorkflow');
      cy.contains('Apps Logs').click();
      cy.contains('2020-02-20T02:20');
      cy.contains('2020-06-05T14:40');
      cy.contains('1 – 2 of 2');
      cy.contains('Close').click();
    });
    it('Should contain the extended properties and be able to edit the info tab', () => {
      // The seemingly unnecessary visits are due to a detached-from-dom error even using cy.get().click();
      cy.visit('/my-workflows/github.com/A/g');
      cy.contains('github.com');
      cy.get('a#sourceRepository').contains('A/g').should('have.attr', 'href', 'https://github.com/A/g');
      cy.contains('/Dockstore.cwl');
      // Change the file path
      cy.contains('button', ' Edit ').click();
      const workflowPathInput = '[data-cy=workflowPathInput]';
      cy.get(workflowPathInput).clear().type('/Dockstore2.cwl');
      cy.contains('button', ' Save ').click();
      cy.visit('/my-workflows/github.com/A/g');
      cy.contains('/Dockstore2.cwl');
      // Change the file path back
      cy.contains('button', ' Edit ').click();
      const dockstoreCwlPath = '/Dockstore.cwl';
      cy.get(workflowPathInput).clear().type(dockstoreCwlPath);
      cy.contains('button', ' Save ').click();
      cy.visit('/my-workflows/github.com/A/g');
      const workflowPathSpan = '[data-cy=workflowPathSpan]';
      cy.get(workflowPathSpan).contains(dockstoreCwlPath);

      // Test Revert
      cy.get('[data-cy=editWorkflowPathButton').click();
      const sillyText = 'silly';
      cy.get(workflowPathInput).clear().type(sillyText);
      // Verify it took
      cy.get(workflowPathInput).should('have.value', sillyText);
      cy.get('[data-cy=cancelWorkflowPathButton').click();
      // Input goes away, check that correct text displayed
      cy.get(workflowPathSpan).contains(dockstoreCwlPath);

      // Topic Editing
      const privateEntryURI = '/my-workflows/github.com/A/l';
      cy.visit(privateEntryURI);
      cy.get('[data-cy=topicEditButton]').click();
      cy.get('[data-cy=topicInput]').clear().type('badTopic');
      cy.get('[data-cy=topicCancelButton]').click();
      cy.contains('badTopic').should('not.exist');
      cy.get('[data-cy=topicEditButton]').click();
      cy.get('[data-cy=topicInput]').clear().type('goodTopic');
      cy.get('[data-cy=topicSaveButton]').click();
      cy.contains('goodTopic').should('exist');

      // Check public view
      cy.visit(privateEntryURI);
      cy.get('[data-cy=viewPublicWorkflowButton]').should('be.visible').click();
      cy.contains('goodTopic').should('not.exist');

      cy.visit(privateEntryURI);
      cy.get('.mat-radio-label').contains('Manual').click();
      cy.visit(privateEntryURI);
      cy.get('[data-cy=viewPublicWorkflowButton]').should('be.visible').click();
      cy.contains('goodTopic').should('exist');
    });
    it('should have mode tooltip', () => {
      cy.visit('/my-workflows/github.com/A/g');
      // .trigger('mouseover') doesn't work for some reason
      cy.contains('Mode').trigger('mouseenter');
      cy.get('.mat-tooltip').contains('STUB: Basic metadata pulled from source control.');
    });
    it('should be able to add labels', () => {
      cy.contains('github.com/A/g');
      cy.get('button').contains('Manage labels').click();
      cy.get('[data-cy=workflowLabelInput]').type('potato');
      // Adding force:true, appears to be a cypress issue, when clicking this button the event does not fire
      // this will force submitWorkflowEdits() to fire
      cy.get('[data-cy=saveLabelButton]').click({ force: true });
      cy.get('[data-cy=saveLabelButton]').should('not.exist');
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
      cy.get('[data-cy=save-version').should('not.exist');
    });
    it('Should be able to hide/unhide', () => {
      cy.visit('/my-workflows/github.com/A/l');
      cy.contains('Versions').click();
      cy.get('td').contains('Actions').should('exist').click();
      cy.get('.cdk-overlay-connected-position-bounding-box').contains('Edit').click();
      cy.get('[type="checkbox"]').check();
      cy.contains('button', ' Save ').click();
      // Check for hidden version and unhide
      cy.get('[data-cy=hidden').should('exist');
      cy.visit('/my-workflows/github.com/A/l');
      cy.contains('Versions').click();
      cy.get('td').contains('Actions').should('exist').click();
      cy.get('.cdk-overlay-connected-position-bounding-box').contains('Edit').click();
      cy.get('[type="checkbox"]').uncheck();
      cy.contains('button', ' Save ').click();
    });
  });

  describe('Should be able to snapshot, request DOI, and export to ORCID', () => {
    function gotoVersionsAndClickActions() {
      cy.visit('/my-workflows/github.com/A/l');
      cy.url().should('eq', Cypress.config().baseUrl + '/my-workflows/github.com/A/l');
      goToTab('Versions');
      cy.get('td').contains('Actions').click();
    }

    it('Should be able to snapshot', () => {
      gotoVersionsAndClickActions();
      cy.get('[data-cy=dockstore-snapshot-locked]').should('have.length', 0);
      // The buttons should be present
      cy.get('[data-cy=dockstore-request-doi-button]').its('length').should('be.gt', 0);
      cy.get('[data-cy=dockstore-snapshot]').its('length').should('be.gt', 0);

      cy.get('[data-cy=dockstore-snapshot-unlocked]').its('length').should('be.gt', 0);

      cy.get('[data-cy=dockstore-snapshot]').first().click();

      cy.get('[data-cy=snapshot-button]').click();

      cy.wait(250);
      cy.get('[data-cy=dockstore-snapshot-locked]').should('have.length', 1);
      cy.get('td').contains('Actions').click();
      cy.get('[data-cy=dockstore-snapshot]').should('be.disabled');
    });

    it('Request DOI should require linked account', () => {
      gotoVersionsAndClickActions();
      cy.get('[data-cy=dockstore-request-doi-button]').click();

      cy.get('[data-cy=zenodo-not-linked]').its('length').should('be.gt', 0);
      cy.get('[data-cy=export-button').should('be.disabled');

      cy.get('[data-cy=link-zenodo]').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/accounts?tab=accounts');
    });

    it('Export to ORCID should require linked account', () => {
      gotoVersionsAndClickActions();
      cy.get('[data-cy=dockstore-export-orcid-button]').click();
      cy.get('[data-cy=orcid-not-linked]').its('length').should('be.gt', 0);
      cy.get('[data-cy=export-button').should('be.disabled');
      cy.get('[data-cy=link-orcid]').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/accounts?tab=accounts');
    });

    it('Should be able to request DOI and then export to ORCID', () => {
      // tokens.json indicates a Zenodo token and an ORCID token
      cy.fixture('tokens.json').then((json) => {
        cy.intercept('GET', '/api/users/1/tokens', {
          body: json,
          statusCode: 200,
        });
      });
      // doiResponse.json has a workflow version with a DOI
      cy.fixture('doiResponse.json').then((json) => {
        cy.intercept('PUT', '/api/**/requestDOI/*', {
          body: json,
          statusCode: 200,
        });
      });
      // orcidExportResponse.json has a workflow version with an ORCID put code
      cy.fixture('orcidExportResponse.json').then((json) => {
        cy.intercept('POST', '/api/entries/*/exportToOrcid?versionId=*', {
          body: json,
          statusCode: 200,
        });
      });

      cy.get('[data-cy=workflow-version-DOI-badge]').should('not.exist'); // Make sure there are no existing Zenodo badges
      gotoVersionsAndClickActions();
      // Request DOI
      cy.get('[data-cy=dockstore-request-doi-button]').click();
      cy.get('[data-cy=export-button').should('be.enabled');
      cy.get('[data-cy=export-button').click();
      cy.get('[data-cy=workflow-version-DOI-badge]').its('length').should('be.gt', 0); // Should have a DOI badge now
      cy.get('td').contains('Actions').click();
      cy.get('[data-cy=dockstore-request-doi-button').should('not.exist'); // Should not be able to request another DOI

      // Export to ORCID
      cy.get('[data-cy=dockstore-export-orcid-button]').click();
      cy.get('[data-cy=export-button').should('be.enabled');
      cy.get('[data-cy=export-button').click();
      cy.get('td').contains('Actions').click();
      cy.get('[data-cy=dockstore-export-orcid-button]').should('not.exist'); // Should not be able to export to ORCID again
    });
  });

  it('Should be able to view a dockstore.yml workflow', () => {
    cy.visit('/my-workflows/github.com/B/z');
    cy.url().should('eq', Cypress.config().baseUrl + '/my-workflows/github.com/B/z');
    cy.contains('Automatically synced via GitHub App');

    cy.get('#publishButton').should('not.be.disabled');
    cy.get('[data-cy=refreshButton]').should('not.exist');

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
    cy.fixture('refreshedAslashl').then((json) => {
      cy.intercept('GET', '/api/workflows/11/refresh', {
        body: json,
      }).as('refreshWorkflow');
    });
    cy.visit('/my-workflows/github.com/A/l');
    cy.url().should('eq', Cypress.config().baseUrl + '/my-workflows/github.com/A/l');
    goToTab('Versions');
    cy.get('table>tbody>tr').should('have.length', 2); // 2 Versions and no warning line
    cy.get('[data-cy=refreshOrganization]:visible').should('be.visible').click();
    cy.get('[data-cy=confirm-dialog-button] > .mat-button-wrapper').contains('Refresh').click();
    cy.wait('@refreshWorkflow');
    goToTab('Versions');
    cy.get('table>tbody>tr').should('have.length', 1); // 2 Versions and no warning line
  });

  describe('Look at an invalid workflow', () => {
    it('Invalid workflow should not be publishable', () => {
      cy.visit('/my-workflows/github.com/A/g');
      cy.get('#publishButton').should('be.disabled');
      cy.get('[data-cy=refreshButton]').should('not.be.disabled');
    });
  });

  function haveAlert() {
    cy.get('.mat-error').should('be.visible');
  }

  function notHaveAlert() {
    cy.get('.mat-error').should('not.exist');
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

      cy.intercept('GET', 'api/users/registries', {
        body: ['github.com', 'bitbucket.org'],
      });
      cy.intercept('GET', 'api/users/registries/github.com/organizations', {
        body: ['foobar', 'lorem'],
      });
      cy.intercept('GET', 'api/users/registries/github.com/organizations/foobar', {
        body: [canDeleteMe, cannotDeleteMe, doesNotExist],
      });

      cy.visit('/my-workflows');
      cy.get('#registerWorkflowButton').should('be.visible').should('be.enabled').click();
      // TODO: Fix this.  When 'Next' is clicked too fast, the next step is empty
      cy.wait(1000);
      cy.get('#1-register-workflow-option').click();
      cy.contains('button', 'Next').click();

      // Select github.com in git registry
      cy.get('app-entry-wizard').within(() => {
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
      cy.get('#closeRegisterWorkflowModalButton').should('not.exist');
    });
  });

  describe('Should require default version to publish', () => {
    it('should not be able to publish with no default version', () => {
      cy.visit('/my-workflows/github.com/A/l');
      cy.get('#publishButton').should('contain', 'Unpublish').should('be.visible').click();
      cy.get('#publishButton').should('contain', 'Publish').should('be.visible').click();
      cy.get('[data-cy=close-dialog-button]').should('be.visible').click();
      cy.get('#publishButton').should('contain', 'Publish').should('be.visible');
    });
    it('should be able to publish after setting default version', () => {
      goToTab('Versions');
      cy.contains('button', 'Actions').should('be.visible').click();
      cy.get('[data-cy=set-default-version-button]').should('be.visible').click();
      cy.wait(1000);
      cy.get('#publishButton').should('contain', 'Publish').should('be.visible').click();
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

      cy.get('[data-cy=viewPublicWorkflowButton]').should('not.exist');

      cy.get('#publishButton').should('be.visible').should('contain', 'Publish').click();

      cy.get('#publishButton').should('contain', 'Unpublish');

      cy.get('[data-cy=viewPublicWorkflowButton]').should('be.visible').click();

      cy.url().should('eq', Cypress.config().baseUrl + '/workflows/github.com/A/l:master?tab=info');
    });
  });
  // Refresh org button does not have tool tip, re-enable test when feature is added
  if (false) {
    it('Refresh Organization button should have tooltip', () => {
      cy.visit('/my-workflows/github.com/A/l');
      cy.get(
        '#cdk-accordion-child-2 > .mat-action-row.ng-star-inserted > div > :nth-child(2) > ' +
          'app-refresh-workflow-organization > [data-cy=refreshOrganization]'
      ).trigger('mouseenter');
      cy.get('[data-cy=refreshOrganization]:visible').should('be.visible').click();
      cy.contains('button', 'Cancel').should('be.visible');
      cy.get('[data-cy=confirm-dialog-button] > .mat-button-wrapper').contains('Refresh').click();
      cy.get('.error-output').should('be.visible');
      cy.get('[data-cy=refreshOrganization]:visible').should('be.visible').click();
      cy.contains('button', 'Cancel').should('be.visible').click();
      cy.get('.error-output').should('not.be.visible');
    });
  }
});
describe('Should handle no workflows correctly', () => {
  resetDB();
  setTokenUserViewPortCurator(); // Curator has no workflows
  beforeEach(() => {
    cy.intercept('GET', /github.com\/organizations/, {
      body: ['dockstore'],
    });
  });
  it('My workflows should prompt to register a workflow', () => {
    cy.visit('/my-workflows');
    cy.contains('Register Workflow');
  });
});
