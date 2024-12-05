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
import { LambdaEvent, TokenUser } from '../../../src/app/shared/openapi';
import { Repository } from '../../../src/app/shared/openapi/model/repository';
import {
  goToTab,
  insertAuthors,
  invokeSql,
  isActiveTab,
  resetDB,
  setTokenUserViewPort,
  setTokenUserViewPortCurator,
  snapshot,
} from '../../support/commands';
import TokenSourceEnum = TokenUser.TokenSourceEnum;

const cwlDescriptorType = 'CWL';
const wdlDescriptorType = 'WDL';
const nextflowDescriptorType = 'Nextflow';

describe('Dockstore my workflows', () => {
  resetDB();
  setTokenUserViewPort();

  it('have entries shown on the dashboard', () => {
    cy.visit('/dashboard');
    cy.contains('Search your Workflows...');
    cy.get('#mat-input-0').type('hosted');
    cy.contains('hosted-workflow');
    cy.get('#mat-input-0').type('potato');
    cy.contains('No matching workflows');
  });

  it('should have discover existing workflows button', () => {
    cy.fixture('myWorkflows.json').then((json) => {
      cy.intercept('PATCH', '/api/users/1/workflows', {
        body: json,
        statusCode: 200,
      });
    });

    cy.visit('/my-workflows');
    cy.get('[data-cy=myWorkflowsMoreActionButtons]').should('be.visible').click();
    cy.fixture('myWorkflows.json').then((json) => {
      cy.intercept('GET', '/api/users/1/workflows', {
        body: json,
        statusCode: 200,
      }).as('getWorkflows');
    });
    cy.get('[data-cy=addToExistingWorkflows]').should('be.visible').click();

    cy.wait('@getWorkflows');
    cy.contains('addedthisworkflowviasync');
  });

  describe('Should contain extended Workflow properties', () => {
    // Flaky test, see https://github.com/dockstore/dockstore/issues/5696
    it('Should show GitHub App logs', () => {
      cy.visit('/my-workflows');
      cy.contains('github.com/A/l');

      cy.contains('Apps Logs').click();
      cy.contains('There were problems retrieving the GitHub App logs for this organization.');
      cy.contains('Close').click();
      cy.intercept('GET', '/api/lambdaEvents/**', {
        body: [],
      }).as('No lambda events');
      cy.contains('Apps Logs').click();
      cy.contains('There are no GitHub App logs for this organization.');
      cy.contains('Close').click();
      const entry1 = 'entry1';
      const entry2 = 'entry2';
      const realResponse = [
        {
          deliveryId: '1',
          entryName: entry1,
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
          deliveryId: '2',
          entryName: entry2,
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
      const sortedAsc = [...realResponse].sort((a, b) => a.entryName.toLowerCase().localeCompare(b.entryName.toLowerCase()));
      const sortedDesc = [...realResponse].sort((a, b) => b.entryName.toLowerCase().localeCompare(a.entryName.toLowerCase()));
      cy.intercept('GET', '/api/lambdaEvents/**sortCol=entryName&sortOrder=asc', {
        body: sortedAsc,
        headers: {
          'X-total-count': '2',
        },
      }).as('Sorted by entryName asc');
      cy.intercept('GET', '/api/lambdaEvents/**sortCol=entryName&sortOrder=desc', {
        body: sortedDesc,
        headers: {
          'X-total-count': '2',
        },
      }).as('Sorted by entryName desc');
      cy.intercept('GET', '/api/lambdaEvents/A?offset=0&limit=10&sortOrder=desc', {
        body: realResponse,
        headers: {
          'X-total-count': '2',
        },
      }).as('Default sort');
      cy.contains('Apps Logs').click();
      // Check that app logs contain the correct columns
      const appLogColumns = ['Date', 'GitHub Username', 'Entry Name', 'Delivery ID', 'Repository', 'Reference', 'Status', 'Type'];
      appLogColumns.forEach((column) => cy.contains(column));
      // These next 2 values work on Circle CI (UTC?) I would have thought East Coast time, but there's an 8 hour diff with West Coast time. Confused
      cy.contains('2020-02-20T02:20');
      cy.contains('2020-06-05T14:40');
      // These next 2 values only work on the West Coast
      // cy.contains('2020-02-19T18:20');
      // cy.contains('2020-06-05T07:40');

      // Sort by entry name ascending, entry1 should be first row
      cy.contains('th', 'Entry Name').click();
      cy.get('[data-cy=entry-name').first().should('have.text', entry1);

      // Sort by entry name descending, entry2 should be first row
      cy.contains('th', 'Entry Name').click();
      cy.get('[data-cy=entry-name').first().should('have.text', entry2);

      cy.contains('1 – 2 of 2');

      //Filtering
      const filteredResponse: LambdaEvent[] = [
        {
          deliveryId: '1',
          entryName: entry1,
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
      ];
      cy.intercept('GET', '/api/lambdaEvents/**', {
        body: filteredResponse,
        headers: {
          'X-total-count': '1',
        },
      });
      cy.get('[data-cy=apps-logs-filter]').type(entry1);
      cy.contains('2020-02-20T02:20');
      cy.contains('1 – 1 of 1');
      cy.contains('Close').click();
    });
    it('Should contain the extended properties and be able to edit the info tab', () => {
      cy.intercept('PUT', 'api/workflows/*').as('updateWorkflow');
      // The seemingly unnecessary visits are due to a detached-from-dom error even using cy.get().click();
      cy.visit('/my-workflows/github.com/A/l');
      cy.contains('github.com');
      cy.get('[data-cy=sourceRepository]').should('contain.text', '1st-workflow.cwl');
      cy.visit('/my-workflows/github.com/A/g');
      cy.contains('/Dockstore.cwl');
      // Change the file path
      cy.contains('button', ' Edit ').click();
      const workflowPathInput = '[data-cy=workflowPathInput]';
      cy.get(workflowPathInput).clear().type('/Dockstore2.cwl');
      cy.contains('button', ' Save ').click();
      cy.wait('@updateWorkflow');
      cy.visit('/my-workflows/github.com/A/g');
      cy.contains('/Dockstore2.cwl');
      // Change the file path back
      cy.contains('button', ' Edit ').click();
      const dockstoreCwlPath = '/Dockstore.cwl';
      cy.get(workflowPathInput).clear().type(dockstoreCwlPath);
      cy.contains('button', ' Save ').click();
      cy.wait('@updateWorkflow');
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
      // Modify the manual topic, but don't save it
      cy.get('[data-cy=topicEditButton]').click();
      cy.get('[data-cy=topicInput]').clear(); // Unsafe to chain clear()
      cy.get('[data-cy=topicInput]').type('badTopic');
      cy.get('[data-cy=topicCancelButton]').click();
      cy.get('[data-cy=selected-topic]').should('not.contain.text', 'badTopic');
      // Modify the manual topic and save it
      cy.get('[data-cy=topicEditButton]').click();
      cy.get('[data-cy=topicInput]').clear(); // Unsafe to chain clear()
      cy.get('[data-cy=topicInput]').type('goodTopic');
      cy.get('[data-cy=topicSaveButton]').click();
      cy.wait('@updateWorkflow');
      // Check that the manual topic is saved
      cy.get('[data-cy=topicEditButton]').click();
      cy.get('[data-cy=topicInput]').should('have.value', 'goodTopic');
      cy.get('[data-cy=topicCancelButton]').click();

      // Check public view. Manual topic should not be displayed because it's not the selected topic
      cy.get('[data-cy=viewPublicWorkflowButton]').should('be.visible').click();
      cy.get('[data-cy=selected-topic]').should('not.contain.text', 'goodTopic');

      // Select the manual topic and verify that it's displayed publicly
      cy.visit(privateEntryURI);
      cy.get('[data-cy=topicEditButton]').click();
      cy.get('.mat-radio-label').contains('Manual').click();
      cy.get('[data-cy=topicSaveButton]').click();
      cy.wait('@updateWorkflow');
      cy.get('[data-cy=selected-topic]').should('contain.text', 'goodTopic');
      // Topic selection bubble should be visible on private page
      cy.get('[data-cy=topic-selection-bubble]').should('be.visible');
      // Topic selection bubble should not exist on public page
      cy.get('[data-cy=viewPublicWorkflowButton]').should('be.visible').click();
      cy.get('[data-cy=selected-topic]').should('contain.text', 'goodTopic');
      cy.get('[data-cy=topic-selection-bubble]').should('not.exist');

      // Add an AI topic for testing and set topic selection to AI. The user has not approved of this topic.
      invokeSql("update workflow set topicai = 'test AI topic sentence' where id = 11");
      invokeSql("update workflow set topicselection = 'AI' where id = 11");
      cy.visit(privateEntryURI);
      cy.get('[data-cy=topicEditButton]').click();
      cy.get('[data-cy=unapprovedAITopicCard]').should('be.visible');
      cy.get('[data-cy=topicCancelButton]').click();
      // AI topic on public page should have an AI bubble because it wasn't approved by the user
      cy.get('[data-cy=viewPublicWorkflowButton]').should('be.visible').click();
      cy.get('[data-cy=ai-bubble]').should('be.visible');

      // Select the AI topic and verify that it's displayed publicly without an AI bubble
      cy.visit(privateEntryURI);
      cy.get('[data-cy=topicEditButton]').click();
      cy.get('.mat-radio-label').contains('AI').click();
      cy.get('[data-cy=topicSaveButton]').click();
      cy.get('[data-cy=confirmAISelectionPrompt').should('be.visible');
      cy.get('[data-cy=topicConfirmButton]').click();
      cy.wait('@updateWorkflow');
      cy.get('[data-cy=selected-topic]').should('contain.text', 'test AI topic sentence');
      cy.get('[data-cy=ai-bubble]').should('be.visible'); // AI bubble is displayed privately to indicate the topic selection
      // AI bubble should not be displayed on public page because the user selected it and thus approves of it
      cy.get('[data-cy=viewPublicWorkflowButton]').should('be.visible').click();
      cy.get('[data-cy=selected-topic]').should('contain.text', 'test AI topic sentence');
      cy.get('[data-cy=ai-bubble]').should('not.exist');
    });
    it('should have mode tooltip', () => {
      cy.visit('/my-workflows/github.com/A/g');
      // .trigger('mouseover') doesn't work for some reason
      cy.contains('Mode').trigger('mouseenter');
      cy.get('.mat-tooltip').contains('STUB: Basic metadata pulled from source control.');

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
});

describe('Dockstore my workflows part 2', () => {
  resetDB();
  setTokenUserViewPort();

  function gotoVersionsAndClickActions() {
    cy.visit('/my-workflows/github.com/A/l');
    cy.url().should('eq', Cypress.config().baseUrl + '/my-workflows/github.com/A/l');
    goToTab('Versions');
    cy.get('[data-cy=date-modified-header]').should('be.visible').click();
    cy.wait(1000);

    cy.get('td').contains('Actions').click();
  }

  describe('Should not be able to snapshot if no authors', () => {
    it('Should not be able to snapshot if no authors', () => {
      cy.visit('/my-workflows/github.com/A/l');
      gotoVersionsAndClickActions();
      cy.get('[data-cy=dockstore-snapshot]').first().click();
      cy.get('[data-cy=snapshot-button]').should('be.disabled');
      cy.get('[data-cy=no-authors]').should('exist');
    });
  });

  describe('Should be able to snapshot, request DOI, and export to ORCID', () => {
    insertAuthors();
    it('Should be able to snapshot', () => {
      gotoVersionsAndClickActions();
      snapshot();
      cy.get('[data-cy=no-authors]').should('not.exist');
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

    it('Request to DOI should not require ORCID linked account', () => {
      cy.fixture('tokens.json').then((json) => {
        // Remove the ORCID token
        const tokens = (json as Array<TokenUser>).filter((token) => token.tokenSource !== TokenSourceEnum.OrcidOrg);
        cy.intercept('GET', '/api/users/1/tokens', {
          body: tokens,
          statusCode: 200,
        });
        gotoVersionsAndClickActions();
        // Request DOI
        cy.get('[data-cy=dockstore-request-doi-button]').click();
        cy.get('[data-cy=orcid-not-linked]').should('not.exist'); // dockstore/dockstore#5796
      });
    });

    it('Should be able to request DOI and then export to ORCID', () => {
      // tokens.json indicates a Zenodo token and an ORCID token
      cy.fixture('tokens.json').then((json) => {
        cy.intercept('GET', '/api/users/1/tokens', {
          body: json,
          statusCode: 200,
        });
      });
      // Return a 200 for requestDOI. The response is not used.
      cy.intercept('PUT', '/api/**/requestDOI/*', {
        statusCode: 200,
      });
      // getWorkflowWithDoi.json has a workflow version with a DOI.
      // This endpoint is called after a DOI is requested.
      cy.fixture('getWorkflowWithDoi.json').then((json) => {
        cy.intercept('GET', '/api/workflows/11?include=versions', {
          body: json,
          statusCode: 200,
        }).as('getWorkflowAfterRequestDoi');
      });
      // orcidExportResponse.json has a workflow version with an ORCID put code
      cy.fixture('orcidExportResponse.json').then((json) => {
        cy.intercept('POST', '/api/entries/*/exportToOrcid?versionId=*', {
          body: json,
          statusCode: 200,
        });
      });

      // Make sure there are no existing Zenodo badges
      cy.get('[data-cy=concept-DOI-badge]').should('not.exist');
      cy.get('[data-cy=version-DOI-badge]').should('not.exist');
      gotoVersionsAndClickActions();
      // Request DOI
      cy.get('[data-cy=dockstore-request-doi-button]').click();
      cy.get('[data-cy=export-button').should('be.enabled');
      cy.get('[data-cy=export-button').click();

      cy.fixture('versionWithDoi.json').then((json) => {
        cy.intercept('GET', '/api/workflows/11/workflowVersions?limit=10&offset=0&sortCol=lastModified&sortOrder=asc', {
          body: json,
          statusCode: 200,
        }).as('getVersionWithDoi');
      });

      // Should have DOI badges now
      cy.get('[data-cy=user-DOI-icon]').should('be.visible');
      cy.get('[data-cy=concept-DOI-badge]').should('be.visible');
      cy.get('[data-cy=version-DOI-badge]').should('be.visible');
      goToTab('Versions');
      cy.get('td').contains('Actions').click();
      cy.get('[data-cy=dockstore-request-doi-button').should('not.exist'); // Should not be able to request another DOI

      // Export to ORCID
      cy.get('[data-cy=dockstore-export-orcid-button]').click();
      cy.get('[data-cy=export-button').should('be.enabled');
      cy.get('[data-cy=export-button').click();
      cy.fixture('versionAfterOrcidExport.json').then((json) => {
        cy.intercept('GET', '/api/workflows/11/workflowVersions?limit=10&offset=0&sortCol=lastModified&sortOrder=asc', {
          body: json,
          statusCode: 200,
        }).as('getVersionAfterOrcidExport');
      });
      goToTab('Versions');
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
    cy.contains('button', 'Actions').click();
    cy.contains('button', 'Refresh Version').should('be.disabled');

    cy.get('body').type('{esc}');

    // Test file content
    goToTab('Files');

    cy.contains('/Dockstore.cwl');
    cy.contains('class: Workflow');

    cy.get('app-source-file-tabs').within((tabBody) => {
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
    cy.get('[data-cy=date-modified-header]').should('be.visible').click();
    cy.wait(1000);
    cy.contains('button', 'Actions').click();
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

    cy.fixture('sampleWorkflowVersion').then((json) => {
      cy.intercept('GET', '/api/workflows/11/workflowVersions?limit=10&offset=0&sortOrder=desc', {
        body: json,
      }).as('getVersion');
    });
    goToTab('Versions');
    cy.wait('@getVersion');
    cy.get('table>tbody>tr').should('have.length', 1); // 2 Versions and no warning line
  });

  describe('Look at an invalid workflow', () => {
    it('Invalid workflow should not be publishable', () => {
      cy.visit('/my-workflows/github.com/A/g');
      cy.get('#publishButton').should('be.disabled');
      cy.get('[data-cy=refreshButton]').should('not.be.disabled');
    });
  });
});

describe('Dockstore my workflows part 3', () => {
  resetDB();
  setTokenUserViewPort();

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
      cy.get('[data-cy=register-workflow-button]').should('be.visible').should('be.enabled').click();
      // TODO: Fix this.  When 'Next' is clicked too fast, the next step is empty
      cy.wait(1000);
      cy.get('#1-register-workflow-option').click();
      cy.contains('button', 'Next').click();

      // Select github.com in git registry
      cy.get('app-entry-wizard').within(() => {
        cy.get('mat-select').eq(0).click().type('{enter}', { force: true });
        cy.get('mat-select').eq(1).click().type('{enter}', { force: true });

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
    it('It should have 3 separate descriptor path validation patterns', () => {
      cy.visit('/my-workflows');
      cy.get('[data-cy=register-workflow-button]').should('be.visible').should('be.enabled').click();
      // TODO: Fix this.  When 'Next' is clicked too fast, the next step is empty
      cy.wait(1000);
      cy.get('#2-register-workflow-option').click();
      cy.contains('button', 'Next').click();
      // Untouched form should not have errors but is disabled
      cy.get('#submitButton').should('be.disabled');
      notHaveAlert();
      cy.get('#sourceCodeRepositoryInput').clear();
      cy.get('#sourceCodeRepositoryInput').type('beef/stew');
      cy.get('#submitButton').should('be.disabled');
      cy.get('#sourceCodeRepositoryWorkflowPathInput').clear();
      cy.get('#sourceCodeRepositoryWorkflowPathInput').type('/Dockstore.cwl');
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

      goToTab('Versions');
      cy.get('[data-cy=date-modified-header]').should('be.visible').click();
      cy.wait(1000);
      cy.contains('button', 'Actions').click();
      cy.get('[data-cy=set-default-version-button]').should('be.visible').click();
      cy.wait(1000);
      cy.get('#publishButton').should('contain', 'Publish').should('be.visible').click();

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
describe('Version Dropdown should have search capabilities', () => {
  setTokenUserViewPort();
  it('Search result should exclude master version', () => {
    cy.visit('/my-workflows/github.com/A/l');
    cy.get('[data-cy=version-dropdown]').should('contain', 'master').click();
    cy.get('mat-option').should('contain', 'master').should('be.visible');
    cy.get('mat-option').should('contain', 'test').should('be.visible');
    cy.get('[data-cy=version-dropdown-search-field]').should('be.visible').type('test');
    cy.get('mat-option').should('not.contain', 'master');
    cy.get('mat-option').should('contain', 'test').should('be.visible');
  });
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
    cy.contains('Register a Workflow');
  });
});
describe('GitHub App installation', () => {
  resetDB();
  setTokenUserViewPort();
  it('Should display a warning when the GitHub app is not installed', () => {
    invokeSql("update workflow set mode='DOCKSTORE_YML'");
    // Warning should not appear on private page if not uninstalled
    cy.intercept('GET', '/api/entries/*/syncStatus', {
      body: { gitHubAppInstalled: true },
    });
    cy.visit('/my-workflows/github.com/A/l');
    cy.get('mat-card').should('not.contain', 'uninstalled');
    // Warning should appear on private page if uninstalled
    cy.intercept('GET', '/api/entries/*/syncStatus', {
      body: { gitHubAppInstalled: false },
    });
    cy.reload();
    cy.get('mat-card').should('contain', 'uninstalled');
    // Warning should not appear on public page
    cy.visit('/workflows/github.com/A/l');
    cy.get('mat-card').should('not.contain', 'uninstalled');
  });
});
