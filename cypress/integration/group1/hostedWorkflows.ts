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
import { goToUnexpandedSidebarEntry, resetDB, setTokenUserViewPort } from '../../support/commands';

describe('Dockstore hosted workflows', () => {
  resetDB();
  setTokenUserViewPort();

  beforeEach(() => {
    cy.visit('/my-workflows');
  });

  function getWorkflow() {
    goToUnexpandedSidebarEntry('dockstore.org/A', /hosted/);
  }

  // Ensure tabs are correct for the hosted workflow, try adding a version
  describe('Should be able to register a hosted workflow and add files to it', () => {
    it('Register the workflow', () => {
      // Select the hosted workflow
      getWorkflow();

      // Should not be able to publish (No valid versions)
      cy
        .get('#publishButton')
        .should('be.disabled');

      // Check content of the info tab
      cy
        .contains('Mode: HOSTED');

      // Should not be able to download zip
      cy
        .get('#downloadZipButton')
        .should('not.be.visible');

      // Check content of the version tab
      cy
        .get('.nav-link')
        .contains('Versions')
        .parent()
        .click()
        .get('table > tbody')
        .find('tr')
        .should('have.length', 2);

      // Add a new version with one descriptor
      cy
        .get('.nav-link')
        .contains('Files')
        .parent()
        .click();
      cy
        .get('#editFilesButton')
        .click();
      cy
        .contains('Add File')
        .click();
      cy.window().then(function (window: any) {
        cy.document().then((doc) => {
          const editors = doc.getElementsByClassName('ace_editor');
          const wdlDescriptorFile = `task md5 { File inputFile command { /bin/my_md5sum \${inputFile} } output { File value = \"md5sum.txt\" } runtime { docker: \"quay.io/agduncan94/my-md5sum\" } } workflow ga4ghMd5 { File inputFile call md5 { input: inputFile=inputFile } }`;
          window.ace.edit(editors[0]).setValue(wdlDescriptorFile, -1);
        });
      });

      cy
        .get('#saveNewVersionButton')
        .click();

      // Should have a version 1
      cy
        .get('.nav-link')
        .contains('Versions')
        .parent()
        .click()
        .get('table')
        .contains('span', /\b1\b/);

      // Should be able to download zip
      cy
        .get('.nav-link')
        .contains('Info')
        .parent()
        .click();

      cy
        .get('#downloadZipButton')
        .should('be.visible');

      // Add a new version with a second descriptor and a test json
      cy
        .get('.nav-link')
        .contains('Files')
        .parent()
        .click();
      cy
        .get('#editFilesButton')
        .click();
      cy
        .contains('Add File')
        .click();
      cy.window().then(function (window: any) {
        cy.document().then((doc) => {
          const editors = doc.getElementsByClassName('ace_editor');
          const wdlDescriptorFile = `task test { File inputFile command { /bin/my_md5sum \${inputFile} } output { File value = \"md5sum.txt\" } runtime { docker: \"quay.io/agduncan94/my-md5sum\" } } workflow ga4ghMd5 { File inputFile call test { input: inputFile=inputFile } }`;
          window.ace.edit(editors[1]).setValue(wdlDescriptorFile, -1);
        });
      });

      cy
        .get('#testParameterFilesTab-link')
        .click();
      cy.wait(500);
      cy
        .get('#testParameterFilesTab')
        .contains('Add File')
        .click();
      cy.window().then(function (window: any) {
        cy.document().then((doc) => {
          const editors = doc.getElementsByClassName('ace_editor');
          const testParameterFile = '{}';
          window.ace.edit(editors[2]).setValue(testParameterFile, -1);
        });
      });

      cy
        .get('#saveNewVersionButton')
        .click();

      // Should have a version 2
      cy
        .get('.nav-link')
        .contains('Versions')
        .parent()
        .click()
        .get('table')
        .contains('span', /\b2\b/);

      // Should be able to publish
      cy
        .get('#publishButton')
        .should('not.be.disabled');

      // Try deleting a file (.wdl file)
      cy
        .get('.nav-link')
        .contains('Files')
        .parent()
        .click();
      cy
        .get('#editFilesButton')
        .click();
      cy
        .get('.delete-editor-file')
        .first()
        .click();
      cy
        .get('#saveNewVersionButton')
        .click();

      // Should now only be two ace editors
      cy
        .get('.ace_editor')
        .should('have.length', 2);

      // New version should be added
      cy
        .get('.nav-link')
        .contains('Versions')
        .parent()
        .click()
        .get('table')
        .contains('span', /\b3\b/);

      // Delete a version
      cy
        .get('table')
        .find('.deleteVersionButton')
        .first()
        .click();

      // Version should no longer exist
      cy
        .get('.nav-link')
        .contains('Versions')
        .parent()
        .click()
        .get('table')
        .find('a')
        .should('not.contain', '1');
    });
  });

});
