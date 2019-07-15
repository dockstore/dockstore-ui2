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
import { getTab, goToTab, resetDB, setTokenUserViewPort } from '../../support/commands';

describe('Dockstore my workflows', () => {
  resetDB();
  setTokenUserViewPort();

  const cwlDescriptorType = 'CWL';
  const wdlDescriptorType = 'WDL';
  const nextflowDescriptorType = 'Nextflow';

  describe('Should contain extended Workflow properties', () => {
    it('visit another page then come back', () => {
      cy.visit('/my-workflows');
      cy.get('a#home-nav-button').click();
      cy.contains('Docker Tools and Workflows for the Sciences');
      cy.get('[data-cy=dropdown-main]')
        .should('be.visible')
        .click();
      cy.get('[data-cy=my-workflows-nav-button]').click();
    });
    it('Should contain the extended properties and be able to edit the info tab', () => {
      cy.visit('/my-workflows/github.com/A/g');
      cy.contains('GitHub');
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
    it('add and remove test parameter file', () => {
      cy.visit('/my-workflows/github.com/A/l');
      cy.contains('Versions').click();
      cy.get('td').find('button').contains('Edit').invoke('width').should('be.gt', 0);
      cy.get('td').find('button').contains('Edit').should('be.visible').click();
      cy.get('[data-cy=test-parameter-file-input]').type('/test.wdl.json');
      cy.get('[data-cy=save-version').click();
      cy.get('[data-cy=save-version').should('not.exist');
      cy.get('td').find('button').contains('Edit').invoke('width').should('be.gt', 0);
      cy.get('td').find('button').contains('Edit').should('be.visible').click();
      cy.get('[data-cy=remove-test-parameter-file-button]').click();
      cy.get('[data-cy=save-version').click();
      cy.get('[data-cy=save-version').should('not.be.visible');
    });
  });

  describe('Look at an invalid workflow', () => {
    it('Invalid workflow should not be publishable', () => {
      cy.visit('/my-workflows/github.com/A/g');
      cy
        .get('#publishButton')
        .should('be.disabled');
      cy
        .get('#refreshButton')
        .should('not.be.disabled');
    });
  });

  function haveAlert() {
    cy
      .get('.mat-error')
      .should('be.visible');
  }


  function notHaveAlert() {
    cy
      .get('.mat-error')
      .should('not.be.visible');
  }

  describe('Test register workflow form validation', () => {
    it('It should have 3 seperate descriptor path validation patterns', () => {
      cy.visit('/my-workflows');
      cy
        .get('#registerWorkflowButton')
        .should('be.visible')
        .should('be.enabled')
        .click();
      // TODO: Fix this.  When 'Next' is clicked too fast, the next step is empty
      cy.wait(1000);
      cy
        .contains('button', 'Next')
        .click();
      // Untouched form should not have errors but is disabled
      cy.get('#submitButton').should('be.disabled');
      notHaveAlert();
      cy
        .get('#sourceCodeRepositoryInput')
        .clear()
        .type('beef/stew');
      cy.get('#submitButton').should('be.disabled');
      cy
        .get('#sourceCodeRepositoryWorkflowPathInput')
        .clear()
        .type('/Dockstore.cwl');
      notHaveAlert();
      // Apparently the actual radio button inside Angular material buttons is hidden, so doing it this way
      cy.get('#descriptorTypeRadioButtons').contains(cwlDescriptorType).find('.mat-radio-container').click();
      cy.get('#descriptorTypeRadioButtons').contains(wdlDescriptorType).find('.mat-radio-container').click();
      haveAlert();
      cy
        .get('#sourceCodeRepositoryWorkflowPathInput')
        .clear()
        .type('/Dockstore.wdl');
      notHaveAlert();
      cy.get('#descriptorTypeRadioButtons').contains(nextflowDescriptorType).find('.mat-radio-container').click();
      haveAlert();
      cy
        .get('#sourceCodeRepositoryWorkflowPathInput')
        .clear()
        .type('/Dockstore.config');
      notHaveAlert();
      cy.get('#descriptorTypeRadioButtons').contains(cwlDescriptorType).find('.mat-radio-container').click();
      haveAlert();
      cy
        .get('#sourceCodeRepositoryWorkflowPathInput')
        .clear()
        .type('/Dockstore.cwl');
      notHaveAlert();
      cy
        .get('#closeRegisterWorkflowModalButton')
        .contains('button', 'Close')
        .should('be.visible')
        .should('be.enabled')
        .click();
    });
  });

  describe('Look at a published workflow', () => {
    it('Look at each tab', () => {
      const tabs = ['Info', 'Launch', 'Versions', 'Files', 'Tools', 'DAG'];
      cy.visit('/my-workflows/github.com/A/l');
      getTab('Info').parent()
        .should('have.class', 'mat-tab-label-active');
      tabs.forEach(tab => {
        goToTab(tab).parent().should('have.class', 'mat-tab-label-active');
        if (tab === 'Versions') {
          cy
            .get('table>tbody>tr')
            .should('have.length', 2); // 2 Versions and no warning line
        }
      });

      cy
        .get('#publishButton')
        .should('contain', 'Unpublish')
        .click();

      cy
        .get('#viewPublicWorkflowButton')
        .should('not.be.visible');

      cy
        .get('#publishButton')
        .should('contain', 'Publish')
        .click()
        .should('contain', 'Unpublish');

      cy
        .get('#viewPublicWorkflowButton')
        .should('be.visible')
        .click();

      cy.url().should('eq', Cypress.config().baseUrl + '/workflows/github.com/A/l:master?tab=info');
    });
  });
});
