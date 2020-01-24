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
import { goToTab, goToUnexpandedSidebarEntry, resetDB, setTokenUserViewPort } from '../../support/commands';

describe('Dockstore hosted tools', () => {
  resetDB();
  setTokenUserViewPort();

  beforeEach(() => {
    cy.visit('/my-tools');

    cy.server();

    cy.route({
      method: 'GET',
      url: /containers\/.+\/zip\/.+/,
      response: 200
    }).as('downloadZip');
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
      cy.get('#publishToolButton').should('be.disabled');

      // Should not be able to download zip
      cy.get('#downloadZipButton').should('not.be.visible');

      // Check content of the version tab
      goToTab('Versions');
      cy.get('table > tbody')
        .find('tr')
        .should('have.length', 1);

      // Add a new version with one descriptor and dockerfile
      goToTab('Files');

      cy.get('#editFilesButton').click();

      cy.contains('Add File').click();
      cy.window().then(function(window: any) {
        cy.document().then(doc => {
          const editors = doc.getElementsByClassName('ace_editor');
          const dockerfile = `FROM ubuntu:latest`;
          window.ace.edit(editors[0]).setValue(dockerfile, -1);
        });
      });

      cy.get('#descriptorFilesTab-link').click();
      cy.wait(500);

      cy.get('#descriptorFilesTab')
        .contains('Add File')
        .click();
      cy.window().then(function(window: any) {
        cy.document().then(doc => {
          const editors = doc.getElementsByClassName('ace_editor');
          const cwlDescriptor = `cwlVersion: v1.0\nclass: CommandLineTool`;
          window.ace.edit(editors[1]).setValue(cwlDescriptor, -1);
        });
      });

      cy.get('#saveNewVersionButton').click();

      cy.get('#tool-path').contains('quay.io/hosted-tool/ht:1');

      // Should have a version 1
      goToTab('Versions');
      cy.get('table').contains('span', /\b1\b/);

      // Should be able to download zip
      goToTab('Info');
      cy.get('#downloadZipButton').should('be.visible');

      // Verify that clicking calls the correct endpoint
      // https://github.com/ga4gh/dockstore/issues/2050
      cy.get('#downloadZipButton').click();

      cy.wait('@downloadZip')
        .its('url')
        .should('include', Dockstore.API_URI);

      // Add a new version with a second descriptor and a test json
      goToTab('Files');
      cy.get('#editFilesButton').click();
      cy.get('#descriptorFilesTab-link').click();
      cy.wait(500);
      cy.get('#descriptorFilesTab')
        .contains('Add File')
        .click();
      cy.window().then(function(window: any) {
        cy.document().then(doc => {
          const editors = doc.getElementsByClassName('ace_editor');
          const cwlDescriptor = `cwlVersion: v1.0\nclass: CommandLineTool`;
          window.ace.edit(editors[2]).setValue(cwlDescriptor, -1);
        });
      });

      cy.get('#testParameterFilesTab-link').click();
      cy.wait(500);
      cy.get('#testParameterFilesTab')
        .contains('Add File')
        .click();
      cy.window().then(function(window: any) {
        cy.document().then(doc => {
          const editors = doc.getElementsByClassName('ace_editor');
          const testParameterFile = '{}';
          window.ace.edit(editors[3]).setValue(testParameterFile, -1);
        });
      });

      cy.get('#saveNewVersionButton').click();
      cy.get('#tool-path').contains('quay.io/hosted-tool/ht:2');
      // Should have a version 2
      goToTab('Versions');
      cy.get('table')
        .contains('span', /\b2\b/)
        .click();

      // Should be able to publish
      cy.get('#publishButton').should('not.be.disabled');

      // Try deleting a file (.cwl file)
      goToTab('Files');
      cy.get('#editFilesButton').click();
      cy.get('#descriptorFilesTab-link').click();
      cy.wait(500);
      cy.get('#descriptorFilesTab')
        .find('.delete-editor-file')
        .first()
        .click();
      cy.get('#saveNewVersionButton').click();
      cy.get('#tool-path').contains('quay.io/hosted-tool/ht:3');

      // Should now only have 1 visible editor
      cy.get('.ace_editor:visible').should('have.length', 1);

      // New version should be added
      goToTab('Versions');
      cy.get('table').contains('span', /\b3\b/);

      // Delete a version
      cy.get('table')
        .find('.deleteVersionButton')
        .first()
        .click();
      // Automatically selects the newest version that wasn't the one that was just deleted
      cy.get('#tool-path').contains('quay.io/hosted-tool/ht:2');
      // Version 3 should no longer exist since it was just deleted
      goToTab('Versions');
      cy.get('table')
        .find('a')
        .should('not.contain', '3');
    });
  });
});
