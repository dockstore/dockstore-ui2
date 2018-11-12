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

describe('Dockstore hosted tools', () => {
  resetDB();
  setTokenUserViewPort();

  beforeEach(() => {
    cy.visit('/my-tools');
  });

  function getTool() {
    goToUnexpandedSidebarEntry('quay.io/hosted-tool', 'ht');
  }

  // Ensure tabs are correct for the hosted tool, try adding a version
  describe('Should be able to register a hosted tool and add files to it', () => {
    it('Register the tool', () => {
      // Select the hosted tool
      getTool();

      // Should not be able to publish (No valid versions)
      cy
        .get('#publishToolButton')
        .should('be.disabled');

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
        .should('have.length', 1);

      // Add a new version with one descriptor and dockerfile
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
          const dockerfile = `FROM ubuntu:latest`;
          window.ace.edit(editors[0]).setValue(dockerfile, -1);
        });
      });

      cy
        .get('#descriptorFilesTab-link')
        .click();
      cy.wait(500);

      cy
        .get('#descriptorFilesTab')
        .contains('Add File')
        .click();
      cy.window().then(function (window: any) {
        cy.document().then((doc) => {
          const editors = doc.getElementsByClassName('ace_editor');
          const cwlDescriptor = `cwlVersion: v1.0\nclass: CommandLineTool`;
          window.ace.edit(editors[1]).setValue(cwlDescriptor, -1);
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
        .get('#descriptorFilesTab-link')
        .click();
      cy.wait(500);
      cy
        .get('#descriptorFilesTab')
        .contains('Add File')
        .click();
      cy.window().then(function (window: any) {
        cy.document().then((doc) => {
          const editors = doc.getElementsByClassName('ace_editor');
          const cwlDescriptor = `cwlVersion: v1.0\nclass: CommandLineTool`;
          window.ace.edit(editors[2]).setValue(cwlDescriptor, -1);
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
          window.ace.edit(editors[3]).setValue(testParameterFile, -1);
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

      // Try deleting a file (.cwl file)
      cy
        .get('.nav-link')
        .contains('Files')
        .parent()
        .click();
      cy
        .get('#editFilesButton')
        .click();
      cy
        .get('#descriptorFilesTab-link')
        .click();
      cy.wait(500);
      cy
        .get('#descriptorFilesTab')
        .find('.delete-editor-file')
        .first()
        .click();
      cy
        .get('#saveNewVersionButton')
        .click();

      // Should now only be three ace editors
      cy
        .get('.ace_editor')
        .should('have.length', 3);

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
