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
import {
  resetDB,
  setTokenUserViewPort,
  goToUnexpandedSidebarEntry,
  goToInfoTab,
  goToVersionsTab,
  goToFilesTab,
  goToDescriptorFilesTab,
  goToTestParameterFilesTab,
} from '../../support/commands';

describe('Dockstore hosted tools', () => {
  resetDB();
  setTokenUserViewPort();

  beforeEach(() => {
    cy.visit('/my-tools');

    cy.intercept('GET', /containers\/.+\/zip\/.+/).as('downloadZip');
  });

  function getTool() {
    goToUnexpandedSidebarEntry('hosted-tool', 'quay.io/hosted-tool/ht');
  }

  // Ensure tabs are correct for the hosted tool, try adding a version
  describe('Should be able to register a hosted tool and add files to it', () => {
    it('Register the tool', () => {
      // Select the hosted tool
      getTool();

      // Should not be able to publish (No valid versions)
      cy.get('#publishToolButton').should('be.disabled');

      // Should not be able to download zip
      cy.get('#downloadZipButton').should('not.exist');

      // Check content of the version tab. New hosted tool, there's no versions
      goToVersionsTab();
      cy.contains('To see versions, please add a new version in the Files tab.');

      // Add a new version with one descriptor and dockerfile
      goToFilesTab();

      cy.get('#editFilesButton').click();

      cy.contains('Add File').click();
      cy.window().then(function (window: any) {
        cy.document().then((doc) => {
          const editors = doc.getElementsByClassName('ace_editor');
          const dockerfile = `FROM ubuntu:latest`;
          window.ace.edit(editors[0]).setValue(dockerfile, -1);
        });
      });
      cy.get('.ace_editor').should('have.length', 1);

      goToDescriptorFilesTab();
      cy.wait(500);
      cy.contains('Add File').click();
      cy.window().then(function (window: any) {
        cy.document().then((doc) => {
          const editors = doc.getElementsByClassName('ace_editor');
          const cwlDescriptor = `cwlVersion: v1.0\nclass: CommandLineTool`;
          window.ace.edit(editors[0]).setValue(cwlDescriptor, -1);
        });
      });
      cy.get('.ace_editor').should('have.length', 1);

      cy.get('#saveNewVersionButton').click();

      cy.get('#tool-path').contains('quay.io/hosted-tool/ht:1');

      // Should have a version 1
      goToVersionsTab();
      cy.get('table').contains('span', /\b1\b/);

      // Should be able to download zip
      goToInfoTab();
      cy.get('#downloadZipButton').should('be.visible');

      // Verify that clicking calls the correct endpoint
      // https://github.com/ga4gh/dockstore/issues/2050

      // This sucks, but I think this is running into https://github.com/cypress-io/cypress/issues/24775 with newer Cypress 10/Electron;
      // the download button calls window.open. Commenting out for now.
      // cy.get('#downloadZipButton').click();

      // cy.wait('@downloadZip').its('response.statusCode').should('eq', 200);

      // Add a new version with a second descriptor and a test json
      goToFilesTab();
      cy.get('#editFilesButton').click();
      goToTestParameterFilesTab();
      cy.wait(500);
      cy.contains('Add File').click();
      cy.window().then(function (window: any) {
        cy.document().then((doc) => {
          const editors = doc.getElementsByClassName('ace_editor');
          const testParameterFile = '{}';
          window.ace.edit(editors[0]).setValue(testParameterFile, -1);
        });
      });
      cy.get('.ace_editor').should('have.length', 1);

      goToDescriptorFilesTab();
      cy.wait(500);
      cy.contains('Add File').click();
      cy.window().then(function (window: any) {
        cy.document().then((doc) => {
          const editors = doc.getElementsByClassName('ace_editor');
          const cwlDescriptor = `cwlVersion: v1.0\nclass: CommandLineTool`;
          window.ace.edit(editors[1]).setValue(cwlDescriptor, -1);
        });
      });

      cy.get('#saveNewVersionButton').click();
      cy.get('.ace_editor').should('have.length', 2);
      cy.get('#tool-path').contains('quay.io/hosted-tool/ht:2');
      // Should have a version 2
      goToVersionsTab();
      cy.get('table').contains('span', /\b2\b/).click();

      // Should be able to publish
      cy.get('#publishToolButton').should('not.be.disabled');

      // Try deleting a file (.cwl file)
      goToFilesTab();
      cy.get('#editFilesButton').click();
      goToDescriptorFilesTab();
      cy.wait(500);
      cy.get('.delete-editor-file').first().click();
      cy.get('#saveNewVersionButton').click();
      cy.get('#tool-path').contains('quay.io/hosted-tool/ht:3');

      // Should now only have 1 visible editor
      cy.get('.ace_editor:visible').should('have.length', 1);

      // New version should be added
      goToVersionsTab();
      cy.get('table').contains('span', /\b3\b/);

      // Delete a version
      cy.contains('button', 'Actions').should('be.visible').click();
      cy.get('.deleteVersionButton').click();
      cy.scrollTo('top');
      // Automatically selects the newest version that wasn't the one that was just deleted
      cy.get('#tool-path').contains('quay.io/hosted-tool/ht:2');
      // Version 3 should no longer exist since it was just deleted
      goToVersionsTab();
      cy.get('table').find('a').should('not.contain', '3');
    });
  });

  describe('Should be able to edit unpublished tools', () => {
    it('Should not return an error when editing an unpublished hosted tool', () => {
      getTool();
      goToVersionsTab();
      cy.get('[data-cy=actions-button]').first().click();
      cy.get('[data-cy=edit-button]').click();
      cy.get('.alert').should('not.exist');
      cy.get('[data-cy=editToolVersionDialog]').should('exist');
    });
    it('Should not return an error when editing a published hosted tool', () => {
      getTool();
      goToVersionsTab();
      cy.get('#publishToolButton').click();
      // Disabled since it is already published
      cy.get('#publishToolButton').contains('Unpublish');
      cy.wait(1000);
      cy.get('[data-cy=actions-button]').first().click();
      cy.get('[data-cy=edit-button]').click();
      cy.get('.alert').should('not.exist');
      cy.get('[data-cy=editToolVersionDialog]').should('exist');
    });
  });
});
