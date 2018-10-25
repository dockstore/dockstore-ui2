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
import { resetDB, setTokenUserViewPort } from '../../support/commands';

describe('Dockstore my workflows', function () {
  resetDB();
  setTokenUserViewPort();

  beforeEach(function () {
    cy.visit('/my-workflows');
  });

  const cwlDescriptorType = 'CWL';
  const wdlDescriptorType = 'WDL';
  const nextflowDescriptorType = 'Nextflow';

  describe('Should contain extended Workflow properties', function () {
    it('visit another page then come back', function () {
      cy.get('a#home-nav-button').click();
      cy.contains('Browse Tools');
      cy.get('a#my-workflows-nav-button').click();

    });
    it('Should contain the extended properties', function () {
      cy.visit('/my-workflows/github.com/A/g');
      cy.contains('GitHub');
      cy.contains('https://github.com/A/g');
    });
  });

  describe('Look at an invalid workflow', function () {
    it('Invalid workflow should not be publishable', function () {
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

  describe('Test register workflow form validation', function () {
    it('It should have 3 seperate descriptor path validation patterns', function () {
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

  describe('Look at a published workflow', function () {
    it('Look at each tab', function () {
      cy.visit('/my-workflows/github.com/A/l');
      cy.wait(3000);
      cy
        .get('.nav-link')
        .contains('Info')
        .parent()
        .should('have.class', 'active')
        .and('not.have.class', 'disabled');
      cy
        .get('.nav-link')
        .contains('Launch')
        .parent()
        .should('not.have.class', 'disabled');
      cy
        .get('.nav-link')
        .contains('Versions')
        .parent()
        .should('not.have.class', 'disabled');
      cy
        .get('.nav-link')
        .contains('Files')
        .parent()
        .should('not.have.class', 'disabled');
      cy
        .get('.nav-link')
        .contains('Tools')
        .parent()
        .should('not.have.class', 'disabled');
      cy
        .get('.nav-link')
        .contains('DAG')
        .parent()
        .should('not.have.class', 'disabled');
      cy
        .get('table>tbody>tr')
        .should('have.length', 3); // 2 Versions and warning line

      cy
        .get('#publishButton')
        .should('contain', 'Unpublish')
        .click()
        .should('contain', 'Publish')
        .click()
        .should('contain', 'Unpublish');
    });
  });
});
