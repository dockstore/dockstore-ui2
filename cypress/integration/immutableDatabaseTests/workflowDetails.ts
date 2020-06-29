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
import { goToTab, isActiveTab, setTokenUserViewPort } from '../../support/commands';

describe('Variations of URL', () => {
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
  setTokenUserViewPort();
  beforeEach(() => {
    cy.visit('/workflows/github.com/A/l');
    // Info, Launch, Version, Files, Tools, DAG
    cy.get('.mat-tab-label').should('have.length', 6);
    cy.url().should('eq', Cypress.config().baseUrl + '/workflows/github.com/A/l:master?tab=info');
  });

  it('should not show Edit Button', () => {
    // edit button should only appear inside "My Workflows"
    // unless logged in as the author, edit button should not be present in "Workflows"
    cy.get('#editButton').should('not.exist');
  });

  it('Change tab to launch', () => {
    goToTab('Launch');
    cy.url().should('eq', Cypress.config().baseUrl + '/workflows/github.com/A/l:master?tab=launch');
  });

  it('Change tab to versions and not see snapshotted version', () => {
    goToTab('Versions');
    cy.get('tbody>tr').should('have.length', 1); // 1 Version and no warning line
    cy.url().should('eq', Cypress.config().baseUrl + '/workflows/github.com/A/l:master?tab=versions');
    // Buttons to create snapshots are hidden on public
    cy.get('[data-cy=dockstore-snapshot]').should('not.be.visible');
    cy.get('[data-cy=dockstore-request-doi-button]').should('not.be.visible');
    cy.get('[data-cy=dockstore-snapshot-locked]').should('have.length', 0);

    cy.get('[data-cy=dockstore-snapshot-unlocked]')
      .its('length')
      .should('be.gt', 0);
  });

  describe('Change tab to files', () => {
    beforeEach(() => {
      goToTab('Files');
      cy.url().should('eq', Cypress.config().baseUrl + '/workflows/github.com/A/l:master?tab=files');
    });

    it('Should have Descriptor files tab selected', () => {
      isActiveTab('Descriptor Files');
    });

    it('Should have content in file viewer', () => {
      cy.get('.ace_content').should('be.visible');
    });

    describe('Change tab to Test Parameters', () => {
      beforeEach(() => {
        goToTab('Test Parameter Files');
      });

      it('Should not have content in file viewer', () => {
        cy.get('.ace_content').should('not.be.visible');
      });
    });
  });

  it('Change tab to tools', () => {
    goToTab('Tools');
    cy.url().should('eq', Cypress.config().baseUrl + '/workflows/github.com/A/l:master?tab=tools');
  });

  describe('Change tab to dag', () => {
    beforeEach(() => {
      cy.get('.mat-tab-header-pagination-after').click();
      goToTab('DAG');
      cy.url().should('eq', Cypress.config().baseUrl + '/workflows/github.com/A/l:master?tab=dag');
    });

    it('Change to fullscreen and back', () => {
      cy.get('[data-cy=dag-holder]').should('have.class', 'small');
      cy.get('[data-cy=dag-holder]').should('not.have.class', 'big');
      cy.get('#dag_fullscreen').click();
      // Cypress or electron can't initiate fullscreen because:
      // "Failed to execute 'requestFullscreen' on 'Element': API can only be initiated by a user gesture."
      // TODO: Figure out how to test it
    });
  });
});

describe('Find workflow by alias', () => {
  it('workflow alias', () => {
    cy.server();
    cy.route({
      url: '*/workflows/fakeAlias/aliases',
      method: 'GET',
      status: 200,
      response: { full_workflow_path: 'github.com/A/l' }
    });
    cy.visit('/aliases/workflows/fakeAlias');
    cy.url().should('eq', Cypress.config().baseUrl + '/workflows/github.com/A/l');
  });
});
