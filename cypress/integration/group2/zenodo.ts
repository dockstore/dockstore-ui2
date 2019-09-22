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
 import { goToTab } from '../../support/commands';

function testID_Alpha() {
  let text = 'zenodo-test-workflow';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  for (let i = 0; i < 10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Locate a hosted workflow for which to create a DOI; if the specific hosted
// workflow is not present then create it. Then snapshot the workflow and request
// a DOI
describe('Create Zenodo DOI for workflow version', () => {
    it('Should be able to create DOI', () => {

      cy.visit('/login', {timeout: 30000});
      cy.wait(2000);

      cy.contains('Login with GitHub').click();
      cy.wait(5000);

      const organization = 'dockstore.org';
      const zenodoWorkflow = 'zenodo-doi-test';
      const wdlDescriptorType = 'WDL';

      // Get the user name from the account drop down list so
      // so we can construct a url to the hosted test workflow
      // then try to go to the hosted test workflow
      // cy.get('[data-cy=dropdown-main]').invoke('text').then((text => {
      cy.get('[class=hidden-xs]').invoke('text').then((text => {
        const userName = text.toString().trim().substr(0, text.toString().indexOf(' '));
        cy.visit('/my-workflows/' + organization + '/' + userName + '/' + zenodoWorkflow);
        // Wait a long time for the my workflows page to load
        // Sometimes this takes longer than 30 seconds
        cy.wait(60000);
      }));

      // Look at the workflow path at the top of the page and check to
      // see that we got to the test hosted workflow. If user does not yet
      // have the test workflow, the workflow path will not have the name
      // of the test workflow in it. In that case create a hosted test workflow.
      cy.get('[id=workflow-path]').invoke('text').then((workflowPath => {
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
          // TODO: Fix this.  When 'Next' is clicked too fast, the next step is empty
          cy.wait(1000);
          cy.contains('button', 'Next').click();
          cy.get('#descriptorTypeRadioButtons').contains(wdlDescriptorType).find('.mat-radio-container').click();
          cy.get('[id="hostedWorkflowRepository"]').type(zenodoWorkflow);
          // TODO: Fix this.  When 'Next' is clicked too fast, the next step is empty
          cy.wait(1000);
          cy.get('[id=submitButton]').click();
          cy.wait(5000);

          // Check that the workflow was created by looking for the test workflow
          // name in the workflow path at the top of the page
          cy.get('[id=workflow-path]').should('contain', zenodoWorkflow);
         }
      }));

      goToTab('Versions');

      // If there is a version of the test workflow
      // Delete the first version of the test workflow
      // For some reason this had to be done on the develop branch
      // This does not have to be done on staging
      // TODO: Remove this?
      cy.get('[id=workflow-path]').invoke('text').then((workflowPath => {
         const workflowVersionIndex = workflowPath.toString().lastIndexOf(':');
         if (workflowVersionIndex > 0) {
           const workflowVersion = workflowPath.toString().substring(workflowVersionIndex + 1);
           cy.get('table').find('.deleteVersionButton').first().click();
         }
      }));

      goToTab('Files');

      cy.get('[id=editFilesButton]').click();
      cy.contains('Add File').click();
      cy.wait(2000);

      // Add a random string to the workflow name so it will be accepted; Dockstore won't accept
      // a descriptor file that is the same as a previous descriptor file
      // TODO change the wdl file name instead
      const wdlDescriptorFile = `task md5 { File inputFile command { /bin/my_md5sum \${inputFile} }`
        + `output { File value = \"md5sum.txt\" } runtime { docker: \"quay.io/agduncan94/my-md5sum\" } }`
        + `workflow_` + testID_Alpha() + `ga4ghMd5 { File inputFile call md5 { input: inputFile=inputFile } }`;

      cy.window().then(function (window: any) {
        cy.document().then((doc) => {
          const editors = doc.getElementsByClassName('ace_editor');
          // Put the descriptor in the last editor to be opened by the Add File command
          window.ace.edit(editors[editors.length - 1]).setValue(wdlDescriptorFile, -1);
        });
      });
      cy.wait(2000);

      cy.get('[id=saveNewVersionButton]').click();
      cy.wait(2000);

      cy.get('[id=publishButton]').invoke('text').then((text => {
        if (text.toString().trim() === 'Publish') {
          cy.get('[id=publishButton]').click();
        }
      }));

      cy.wait(5000);

      goToTab('Versions');
      cy.wait(2000);

      // There should be at least on unlock icon since we just added a new version
      // and haven't snapshotted it yet; but this will find any unsnapshotted version
      // TODO: make this check the new version we added
      cy.get('[data-cy=dockstore-snapshot-unlocked]')
        .its('length')
        .should('be.gt', 0);

      cy.get('[data-cy=dockstore-snapshot]')
        .first()
        .click();
      cy.wait(2000);

      cy.get('[data-cy=confirm-dialog-button]').click();
      cy.wait(2000);

       cy.get('[data-cy=dockstore-snapshot-locked]')
        .its('length')
        .should('be.gt', 0);

      cy.get('[data-cy=dockstore-request-doi-button]').first().click();
      cy.wait(2000);

      cy.get('[data-cy=confirm-dialog-button]').click();
      cy.wait(30000);

      goToTab('Info');
      cy.wait(2000);

      // Check that the DOI appears on the Info page for the new version
      cy.get('div').should('contain', '10.5072/zenodo.');

      });
  });

