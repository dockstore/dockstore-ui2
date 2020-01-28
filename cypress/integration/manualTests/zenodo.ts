/*
 *    Copyright 2020 OICR
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
import { goToTab } from '../../support/commands';

function createRandomString() {
  let text = 'zenodo_test_workflow_';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  for (let i = 0; i < 10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

/*
 * Locate a hosted workflow for which to create a DOI; if the specific hosted
 * workflow is not present then create it. Then snapshot the workflow and request
 * a DOI
 *
 *
 * You should link your Zenodo credentials before running the test
 */
describe('Create Zenodo DOI for workflow version', () => {
  it('Should be able to create DOI', () => {
    cy.visit('/login');
    cy.location('pathname', { timeout: 10000 }).should('include', 'login');

    cy.contains('Login with GitHub').click();

    const organization = 'dockstore.org';
    const zenodoWorkflow = 'zenodo-doi-test';
    const wdlDescriptorType = 'WDL';

    cy.get('[class=hidden-xs]', { timeout: 5000 }).should('be.visible');
    // Get the user name from the account drop down list so
    // so we can construct a url to the hosted test workflow
    // then try to go to the hosted test workflow
    cy.get('[class=hidden-xs]')
      .invoke('text')
      .then(text => {
        const userName = text
          .toString()
          .trim()
          .substr(0, text.toString().indexOf(' '));
        cy.visit('/my-workflows/' + organization + '/' + userName + '/' + zenodoWorkflow);
        // Wait a long time for the my workflows page to load
        // Sometimes this takes longer than 30 seconds
        cy.get('[id=workflow-path]', { timeout: 50000 }).should('be.visible');
      });

    // Look at the workflow path at the top of the page and check to
    // see that we got to the test hosted workflow. If user does not yet
    // have the test workflow, the workflow path will not have the name
    // of the test workflow in it. In that case create a hosted test workflow.
    cy.get('[id=workflow-path]')
      .invoke('text')
      .then(workflowPath => {
        let workflowName = workflowPath.toString();
        workflowName = workflowPath.toString().substring(workflowPath.toString().lastIndexOf('/') + 1);
        // accounts for no colon because an empty string is falsy, therefore it returns workflowPath
        // https://stackoverflow.com/questions/4250364/how-to-trim-a-file-extension-from-a-string-in-javascript
        workflowName = workflowName.substring(0, workflowName.lastIndexOf(':')) || workflowName;

        if (workflowName !== zenodoWorkflow) {
          // Create the Zenodo test hosted workflow
          cy.get('[id=registerWorkflowButton]').click();
          // Select the Use CWL, WDL or Nextflow from GitHub, Bitbucket, etc.' option to create a hosted workflow
          cy.contains('Create and save CWL, WDL, or Nextflow on Dockstore.org').click();
          cy.contains('button', 'Next').click();
          cy.get('#descriptorTypeRadioButtons')
            .contains(wdlDescriptorType)
            .find('.mat-radio-container')
            .click();
          cy.get('[id="hostedWorkflowRepository"]').type(zenodoWorkflow);
          cy.get('[id=submitButton]')
            .should('be.visible')
            .click();
          // Check that the workflow was created by looking for the test workflow
          // name in the workflow path at the top of the page
          cy.get('[id=workflow-path]').should('contain', zenodoWorkflow);
        }
      });

    goToTab('Files');

    cy.get('[id=editFilesButton]').click();
    cy.get('button').should('contain', 'Add File');
    cy.contains('Add File').click();

    // Add a random string to the workflow name so it will be accepted; Dockstore won't accept
    // a descriptor file that is the same as a previous descriptor file
    // TODO change the wdl file name instead
    const wdlDescriptorFile =
      `version 1.0
        workflow helloworld_` +
      createRandomString() +
      ` {
            input {
              String greeting
            }
            call hello {
               input:
                   greeting = greeting
             }

            meta {
                author : 'John Smith'
                email : 'jsmith@email.com'
                description: 'This is a hello world example'
             }
        }

        task hello {
            input {
              String greeting
            }
          command {
            echo "\${greeting}"
          }
        }`;

    cy.window().then(function(window: any) {
      cy.document().then(doc => {
        const editors = doc.getElementsByClassName('ace_editor');
        // Put the descriptor in the last editor to be opened by the Add File command
        window.ace.edit(editors[editors.length - 1]).setValue(wdlDescriptorFile, -1);
      });
    });

    cy.get('[id=saveNewVersionButton]').click();
    cy.contains('Save as New Version').should('not.be.visible');

    // Wait for the Publish button so it has a size greater than zero
    // There doesn't seem to be a way around this issue
    // https://github.com/cypress-io/cypress/issues/695
    // cy.get('[id=publishButton]').invoke('width').should('be.greaterThan', 0)
    cy.wait(2000);

    cy.get('[id=publishButton]')
      .invoke('text')
      .then(text => {
        if (text.toString().trim() === 'Publish') {
          cy.get('[id=publishButton]').click();
        }
      });

    cy.get('button', { timeout: 2000 })
      .should('contain', 'Unpublish')
      .should('be.visible');

    goToTab('Versions');

    // There should be at least on unlock icon since we just added a new version
    // and haven't snapshotted it yet; but this will find any unsnapshotted version
    cy.get('[data-cy=dockstore-snapshot-unlocked]')
      .its('length')
      .should('be.gt', 0);

    cy.get('[data-cy=dockstore-snapshot]')
      .first()
      .click();

    cy.get('[data-cy=confirm-dialog-button]').should('be.visible');

    cy.get('[data-cy=confirm-dialog-button]').click();

    cy.get('[data-cy=dockstore-snapshot-locked]')
      .its('length')
      .should('be.gt', 0);

    // alias all of the tr's found in the Version table as 'rows'
    cy.get('table')
      .find('tr')
      .as('versionrows');
    // Cypress returns the reference to the <tr>'s
    // which allows us to continue to chain commands
    // finding the 1st row in the Versions table.
    cy.get('@versionrows')
      .first()
      .get('[data-cy=dockstore-snapshot-locked]')
      .should('be.visible');

    cy.get('[data-cy=confirm-dialog-button]').should('not.be.visible');

    // Wait for the Request DOI button so it has a size greater than zero
    // There doesn't seem to be a way around this issue
    // https://github.com/cypress-io/cypress/issues/695
    // cy.get('[id=publishButton]').invoke('width').should('be.greaterThan', 0)
    cy.wait(2000);

    cy.get('[data-cy=dockstore-request-doi-button]')
      .first()
      .click();

    cy.get('[data-cy=confirm-dialog-button]').should('be.visible');
    cy.get('[data-cy=confirm-dialog-button]').click();
    cy.get('[data-cy=confirm-dialog-button]', { timeout: 20000 }).should('not.be.visible');

    cy.get('[data-cy=workflow-version-DOI-badge]').should('be.visible');

    goToTab('Info');
    cy.get('[class=mat-card-header]').should('contain', 'Workflow Version Information');

    // Check that the DOI appears on the Info page for the new version
    cy.get('div').should('contain', '10.5072/zenodo.');
  });
});
