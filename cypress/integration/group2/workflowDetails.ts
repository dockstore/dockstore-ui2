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

describe('Variations of URL', () => {
  resetDB();
  setTokenUserViewPort();
  it('Should redirect to canonical url (encoding)', () => {
    cy.visit('/workflows/github.com%2FA%2Fl');
    cy.url().should('eq', Cypress.config().baseUrl + '/workflows/github.com/A/l:master?tab=info');
  });
  it('Should redirect to canonical url (version)', () => {
    cy.visit('/workflows/github.com/A/l:master');
    cy.url().should('eq', Cypress.config().baseUrl + '/workflows/github.com/A/l:master?tab=info');
  });
  it('Should redirect to canonical url (tab)', () => {
    cy.visit('/workflows/github.com/A/l?tab=files');
    cy.url().should('eq', Cypress.config().baseUrl + '/workflows/github.com/A/l:master?tab=files');
  });
  it('Should redirect to canonical url (version + tab)', () => {
    cy.visit('/workflows/github.com/A/l:master?tab=files');
    cy.url().should('eq', Cypress.config().baseUrl + '/workflows/github.com/A/l:master?tab=files');
  });
  it('Should redirect to canonical url (encoding + version + tab)', () => {
    cy.visit('/workflows/github.com%2FA%2Fl:master?tab=files');
    cy.url().should('eq', Cypress.config().baseUrl + '/workflows/github.com/A/l:master?tab=files');
  });
});

describe('Dockstore Workflow Details', () => {
  resetDB();
  setTokenUserViewPort();
  beforeEach(() => {
    cy.visit('/workflows/github.com/A/l');
    cy
      .get('tab')
      .should('have.length', 8); // 8 Tabs include all top level tabs plus 2 tabs in the files tab
    cy.url().should('eq', Cypress.config().baseUrl + '/workflows/github.com/A/l:master?tab=info');
  });

  it('should not show Edit Button', () => {
    // edit button should only appear inside "My Workflows"
    // unless logged in as the author, edit button should not be present in "Workflows"
    cy
      .get('#editButton')
      .should('not.exist');
  });

  it('Change tab to launch', () => {
    cy
      .get('.nav-link')
      .contains('Launch')
      .parent()
      .click();
    cy.url().should('eq', Cypress.config().baseUrl + '/workflows/github.com/A/l:master?tab=launch');
  });

  it('Change tab to versions', () => {
    cy
      .get('.nav-link')
      .contains('Versions')
      .parent()
      .click();
    cy
      .get('tbody>tr')
      .should('have.length', 2); // 1 Version and warning line
    cy.url().should('eq', Cypress.config().baseUrl + '/workflows/github.com/A/l:master?tab=versions');
  });

  describe('Change tab to files', () => {
    beforeEach(() => {
      cy
        .get('.nav-link')
        .contains('Files')
        .parent()
        .click();
      cy.url().should('eq', Cypress.config().baseUrl + '/workflows/github.com/A/l:master?tab=files');
    });

    it('Should have Descriptor files tab selected', () => {
      cy
        .get('.nav-link')
        .contains('Descriptor Files')
        .parent()
        .click()
        .should('have.class', 'active');
    });

    it('Should have content in file viewer', () => {
      cy
        .get('.ace_content')
        .should('be.visible');
    });

    describe('Change tab to Test Parameters', () => {
      beforeEach(() => {
        cy
          .get('.nav-link')
          .contains('Test Parameter Files')
          .parent()
          .click();
      });

      it('Should not have content in file viewer', () => {
        cy
          .get('.ace_content')
          .children()
          .should('not.be.visible');
      });
    });
  });

  it('Change tab to tools', () => {
    cy
      .get('.nav-link')
      .contains('Tools')
      .parent()
      .click();
    cy.url().should('eq', Cypress.config().baseUrl + '/workflows/github.com/A/l:master?tab=tools');
  });

  describe('Change tab to dag', () => {
    beforeEach(() => {
      cy
        .get('.nav-link')
        .contains('DAG')
        .parent()
        .click();
      cy.url().should('eq', Cypress.config().baseUrl + '/workflows/github.com/A/l:master?tab=dag');
    });

    it('Change to fullscreen and back', () => {
      cy
        .get('#dag_fullscreen')
        .click()
        .get('#dag-col')
        .should('have.class', 'fullscreen-element')
        .get('#dag_fullscreen')
        .click()
        .should('not.have.class', 'fullscreen-element');
    });
  });
});
