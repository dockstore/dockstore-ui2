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
import { Dockstore } from '../../../src/app/shared/dockstore.model';
import {
  clickFirstActionsButtonPublic,
  clickFirstActionsButtonPrivate,
  goToTab,
  goToUnexpandedSidebarEntry,
  resetDB,
  setTokenUserViewPort,
} from '../../support/commands';

describe('Dockstore hosted workflows', () => {
  resetDB();
  setTokenUserViewPort();

  beforeEach(() => {
    cy.visit('/my-workflows');

    cy.intercept({
      method: 'GET',
      url: /workflows\/.+\/zip\/.+/,
    }).as('downloadZip');
  });

  function getWorkflow() {
    goToUnexpandedSidebarEntry('A2', /hosted/);
  }

  // using an ugly name to flex workflow naming functionality a bit
  const NEW_WORKFLOW_NAME = 'new_Hosted-workflow-8_part-2';

  // Ensure tabs are correct for the hosted workflow, try adding a version
  describe('Should be able to register a hosted workflow and add files to it', () => {
    it('Register the workflow', () => {
      // Select the hosted workflow
      getWorkflow();

      // Should not be able to publish (No valid versions)
      cy.get('#publishButton').should('be.disabled');

      // Check content of the info tab
      cy.contains('Mode: Hosted');

      // Should not be able to download zip
      cy.get('#downloadZipButton').should('not.exist');

      // Should have alert saying there are no versions
      goToTab('Versions');
      cy.contains('To see versions, please add a new version in the Files tab.');

      // Add a new version with one descriptor
      goToTab('Files');
      cy.get('#editFilesButton').click();
      cy.contains('Add File').click();
      cy.wait(100);
      cy.window().then(function (window: any) {
        cy.document().then((doc) => {
          const editors = doc.getElementsByClassName('ace_editor');
          const wdlDescriptorFile = `task md5 { File inputFile command { /bin/my_md5sum \${inputFile} } output { File value = \"md5sum.txt\" } runtime { docker: \"quay.io/agduncan94/my-md5sum\" } } workflow ga4ghMd5 { File inputFile call md5 { input: inputFile=inputFile } }`;
          window.ace.edit(editors[0]).setValue(wdlDescriptorFile, -1);
        });
      });

      cy.get('#saveNewVersionButton').click();
      cy.get('#workflow-path').contains('dockstore.org/A2/hosted-workflow:1');
      // Should have a version 1
      goToTab('Versions');
      cy.get('table').contains('span', /\b1\b/);

      // Should be able to download zip
      goToTab('Info');

      cy.get('#downloadZipButton').should('be.visible');

      // Verify that clicking calls the correct endpoint
      // https://github.com/ga4gh/dockstore/issues/2050
      cy.get('#downloadZipButton').click();

      cy.wait('@downloadZip').its('response.statusCode').should('eq', 200);

      // Add a new version with a second descriptor and a test json
      goToTab('Files');
      cy.get('#editFilesButton').click();
      cy.contains('Add File').click();
      cy.window().then(function (window: any) {
        cy.document().then((doc) => {
          const editors = doc.getElementsByClassName('ace_editor');
          const wdlDescriptorFile = `task test { File inputFile command { /bin/my_md5sum \${inputFile} } output { File value = \"md5sum.txt\" } runtime { docker: \"quay.io/agduncan94/my-md5sum\" } } workflow ga4ghMd5 { File inputFile call test { input: inputFile=inputFile } }`;
          window.ace.edit(editors[1]).setValue(wdlDescriptorFile, -1);
        });
      });

      goToTab('Test Parameter Files');
      cy.wait(500);
      cy.contains('Add File').click();
      cy.window().then(function (window: any) {
        cy.document().then((doc) => {
          const editors = doc.getElementsByClassName('ace_editor');
          const testParameterFile = '{}';
          window.ace.edit(editors[0]).setValue(testParameterFile, -1);
        });
      });

      cy.get('#saveNewVersionButton').click();
      cy.get('#workflow-path').contains('dockstore.org/A2/hosted-workflow:2');
      // Should have a version 2
      goToTab('Versions');
      cy.get('table').contains('span', /\b2\b/);

      // Should be able to publish
      cy.get('#publishButton').should('not.be.disabled');

      // Try deleting a file (.wdl file)
      goToTab('Files');
      cy.get('#editFilesButton').click();
      cy.get('.delete-editor-file').first().click();
      cy.get('#saveNewVersionButton').click();
      cy.get('#workflow-path').contains('dockstore.org/A2/hosted-workflow:3');

      // Testing for one ace editor as mat-tab hides the second element due to it being in a different tab
      cy.get('.ace_editor').should('have.length', 1);

      // New version should be added
      goToTab('Versions');
      cy.get('table').contains('span', /\b3\b/);

      // Delete a version
      clickFirstActionsButtonPrivate();
      cy.contains('Delete').click();
      // Automatically selects the newest version that wasn't the one that was just deleted
      cy.get('#workflow-path').contains('dockstore.org/A2/hosted-workflow:2');
      // Version 3 should no longer exist since it was just deleted
      goToTab('Versions');
      cy.get('table').find('a').should('not.contain', '3');

      // Reload the hosted workflow to test https://github.com/dockstore/dockstore/issues/2854
      cy.reload();

      goToTab('Files');
      cy.contains('/Dockstore.wdl').should('be.visible');
    });
    it('Create a new hosted workflow', () => {
      cy.get('#registerWorkflowButton').should('be.visible').should('be.enabled').click();
      cy.get('#3-register-workflow-option').should('be.visible').click();
      cy.contains('button', 'Next').click();
      cy.get('#hostedWorkflowRepository').type(NEW_WORKFLOW_NAME);
      cy.contains('button', 'Register Workflow').click();
    });
    it('Add files to hosted workflow', () => {
      // navigate to workflow
      cy.get('.mat-expansion-panel');
      cy.contains('.mat-expansion-panel', 'user_A').click();
      cy.contains('a', NEW_WORKFLOW_NAME).click();

      // Check content of the info tab
      cy.contains('Mode: Hosted');

      // Add a new version with 3 descriptors
      goToTab('Files');
      cy.get('#editFilesButton').click();

      // there should be no descriptors files
      cy.get('app-code-editor').should('have.length', 0);

      // add first file. This will be the primary descriptor, so we wont need to give it a custom name
      cy.contains('Add File').click();

      // add a bunch of new files
      for (let i = 0; i < 3; i++) {
        cy.contains('Add File').click();
        cy.wait(100); // focus is pulled to the content box of the editor shortly after adding a file, wait for this to occur
        cy.get('.editor-file-name').last().type(`{selectall}{backspace}/${i}.cwl{enter}`);
      }

      // save as a new version
      cy.get('#saveNewVersionButton').click();
      cy.wait(1000); // have to wait for the response from the webservice, otherwise you may get a false positive

      // should have 4 descriptors.
      cy.get('app-code-editor').should('have.length', 4);
    });
  });
});
