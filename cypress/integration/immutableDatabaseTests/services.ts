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
import { assertNoTab, assertVisibleTab, goToTab, setTokenUserViewPort } from '../../support/commands';

describe('Dockstore Home', () => {
  describe('GitHub App Callback Routing', () => {
    setTokenUserViewPort();
    it('Redirects to my-tools', () => {
      cy.visit('/githubCallback?state=tool');
      cy.url().should('contain', '/my-tools');
    });
    it('Redirects to my-workflows', () => {
      cy.visit('/githubCallback?state=workflow');
      cy.url().should('contain', '/my-workflows');
    });
    it('Redirects to my-services', () => {
      cy.visit('/githubCallback?state=service');
      cy.url().should('contain', '/my-services');
    });
  });

  describe('services', () => {
    it('Have one services in /services', () => {
      cy.visit('/services');
      cy.url().should('contain', 'services');
      cy.get('[data-cy=header]').contains('h3', 'Available Services');
      cy.contains('Search services');
      cy.contains('garyluu/another-test-service');
    });
    it('Have fake service in /services/{id}', () => {
      cy.visit('/services/github.com/garyluu/another-test-service');
      cy.url().should('contain', '/services/github.com/garyluu/another-test-service');
      cy.get('[data-cy=header]').contains('h3', 'Available Services');
      cy.contains('github.com/garyluu/another-test-service:1.3');
      checkTabs();
      checkInfoTab();
      // TRS only visibile in public page
      cy.contains('TRS: ').should('be.visible');
      checkVersionsTab();
      // Hidden version not visible on public page
      cy.contains('td', 'test').should('not.be.visible');
      checkFilesTab();
    });
  });

  describe('my-services', () => {
    setTokenUserViewPort();
    it('Have no services in /services', () => {
      cy.visit('/my-services');
      cy.url().should('contain', 'my-services/github.com/garyluu/another-test-service');
      cy.get('[data-cy=header]').contains('h3', 'My Services');
      // 1.3 version is selected because it's the newest version
      cy.get('#workflow-path').contains('github.com/garyluu/another-test-service:1.3');
      checkTabs();
      checkInfoTab();
      // TRS only visibile in public page
      cy.contains('TRS: ').should('not.be.visible');
      checkVersionsTab();
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
    cy.contains('GitHub: ').should('be.visible');
    cy.contains('Workflow Path: ').should('not.be.visible');
    cy.contains('Test File Path: ').should('not.be.visible');
    cy.contains('Checker Workflow: ').should('not.be.visible');
    cy.contains('Descriptor Type: ').should('not.be.visible');
    // Info Tab Service Version Information
    cy.contains('Service Version Information');
    cy.contains('Author: ');
    cy.contains('E-mail: ');
    cy.contains('Export as ZIP');
  }

  function checkVersionsTab() {
    goToTab('Versions');
    cy.contains('tr', 'Git Reference');
    cy.contains('td', '1.3');
    cy.contains('tr', 'Date Modified');
    cy.contains('td', 'Jul 19, 2019, 1:13:48 PM');
    cy.contains('tr', 'Valid');
    cy.contains('tr', 'Verified Platforms');
    cy.contains('button', 'View');
  }
  function checkFilesTab() {
    goToTab('Files');
    cy.contains('README.md');
    cy.contains('# another-test-serviceaaaa');
  }
});
