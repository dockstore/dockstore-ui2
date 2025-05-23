/*
 *    Copyright 2019 OICR
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
  assertNoTab,
  assertVisibleTab,
  cancelMatMenu,
  clickFirstActionsButtonPublic,
  clickFirstActionsButtonPrivate,
  setTokenUserViewPort,
  setTokenUserViewPortCurator,
  goToVersionsTab,
  goToFilesTab,
  goToConfigurationTab,
} from '../../support/commands';

describe('Dockstore Home', () => {
  describe('GitHub App Callback Routing', () => {
    setTokenUserViewPort();
    beforeEach(() => {
      cy.intercept('GET', '/api/metadata/entryTypeMetadataList').as('getMetadata');
    });
    it('Redirects to my-tools', () => {
      cy.visit('/githubCallback?state=/my-tools/quay.io/A2/b1');
      cy.wait('@getMetadata');
      cy.url().should('contain', '%2Fmy-tools%2Fquay.io%2FA2%2Fb1');
    });
    it('Redirects to my-workflows', () => {
      cy.visit('/githubCallback?state=/my-workflows/github.com/A/l');
      cy.wait('@getMetadata');
      cy.url().should('contain', '%2Fmy-workflows%2Fgithub.com%2FA%2Fl');
    });
    it('Redirects to my-services', () => {
      cy.visit('/githubCallback?state=/services/github.com/garyluu/another-test-service');
      cy.wait('@getMetadata');
      cy.url().should('contain', '%2Fservices%2Fgithub.com%2Fgaryluu%2Fanother-test-service');
    });
    it('Redirects to dashboard', () => {
      cy.visit('githubCallback?state=/dashboard');
      cy.wait('@getMetadata');
      cy.url().should('contain', '%2Fdashboard');
    });
  });

  describe('services', () => {
    it('Have one service in /services', () => {
      cy.visit('/services');
      cy.url().should('contain', 'services');
      cy.get('[data-cy=header]').contains('h3', 'Services');
      cy.get('mat-header-cell').contains('Format').should('not.exist');
      cy.get('[data-cy=search-input]');
      cy.contains('garyluu/another-test-service');
    });
    it('Have fake service in /services/{id}', () => {
      cy.visit('/services/github.com/garyluu/another-test-service');
      cy.url().should('contain', '/services/github.com/garyluu/another-test-service');
      cy.get('[data-cy=header]').contains('h3', 'Services');
      cy.contains('github.com/garyluu/another-test-service:1.3');
      checkTabs();
      checkInfoTab();
      // TRS only visible in public page
      cy.contains('TRS: ').should('be.visible');
      checkVersionsTab();
      // Hidden version not visible on public page
      clickFirstActionsButtonPublic();
      cy.contains('td', 'test').should('not.exist');
      cancelMatMenu();
      checkFilesTab();
    });
  });

  describe('my-services', () => {
    setTokenUserViewPortCurator();
    it('Have no services in /my-services', () => {
      cy.visit('/my-services');
      cy.url().should('contain', 'my-services');
      cy.contains('You have not registered any services').should('be.visible');
    });
  });

  describe('my-services', () => {
    setTokenUserViewPort();
    it('Have no services in /services', () => {
      cy.visit('/my-services');
      cy.url().should('contain', 'my-services/github.com/garyluu/another-test-service');
      cy.get('[data-cy=header]').contains('h3', 'My Dockstore: Services');
      // 1.3 version is selected because it's the newest version
      cy.get('#workflow-path').contains('github.com/garyluu/another-test-service:1.3');
      checkTabs();
      checkInfoTab();
      // TRS only visible in public page
      cy.contains('TRS: ').should('not.exist');
      checkVersionsTab();
      // Edit button only in my-services
      clickFirstActionsButtonPrivate();
      cy.contains('button', 'Edit');
      cancelMatMenu();
      checkFilesTab();
    });
  });
  function checkTabs() {
    assertVisibleTab('Info');
    assertVisibleTab('Versions');
    assertVisibleTab('Files');
    assertNoTab('Tools');
    assertNoTab('DAG');
  }

  function checkInfoTab() {
    // Info Tab Service Information
    cy.contains('Service Information');
    cy.contains('Source Code: ').should('be.visible');
    cy.contains('Workflow Path: ').should('not.exist');
    cy.contains('Test File Path: ').should('not.exist');
    cy.contains('Checker Workflow: ').should('not.exist');
    cy.contains('Descriptor Type: ').should('not.exist');
    // Info Tab Service Version Information
    cy.contains('Service Version Information');
    cy.contains('tr', 'Author');
    cy.contains('tr', 'Email');
    cy.contains('Export as ZIP');
  }

  function checkVersionsTab() {
    goToVersionsTab();
    cy.contains('tr', 'Git Reference');
    cy.contains('td', '1.3');
    cy.contains('tr', 'Date Modified');
    cy.contains('td', '2019-07-19 13:13');
    cy.contains('tr', 'Valid');
    cy.contains('tr', 'Verified');
  }
  function checkFilesTab() {
    goToFilesTab();

    // Files Tab
    cy.contains('README.md');
    cy.contains('# another-test-serviceaaaa');

    cy.get('app-source-file-tabs').within((tabBody) => {
      cy.get('mat-select').click();
    });
    cy.get('mat-option').contains('docker-compose.yml').click();
    cy.contains('docker-compose.yml');

    // Configuration tab
    goToConfigurationTab();
    cy.contains('.dockstore.yml');
    cy.contains('subclass: docker-compose');
  }
});
