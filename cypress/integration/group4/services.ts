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
import { assertNoTab, getTab, goToTab, resetDB, setTokenUserViewPort } from '../../support/commands';

describe('Dockstore Home', () => {
  resetDB();
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

  // TODO: This is a fake service, need to use a more realistic one later
  describe('services', () => {
    it('Have no services in /services', () => {
      cy.visit('/services');
      cy.url().should('contain', 'services');
      cy.get('[data-cy=header]').contains('h3', 'Available Services');
      cy.contains('Search services');
    });
    it('Have fake service in /services/{id}', () => {
      cy.visit('/services/github.com/A/l');
      cy.url().should('contain', '/services/github.com/A/l');
      cy.get('[data-cy=header]').contains('h3', 'Available Services');
      cy.contains('github.com/A/l:master');
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

  // TODO: These are fake services, need to use a more realistic ones later
  describe('my-services', () => {
    setTokenUserViewPort();
    it('Have no services in /services', () => {
      cy.visit('/my-services');
      cy.url().should('contain', 'my-services/github.com/A/l');
      cy.get('[data-cy=header]').contains('h3', 'My Services');
      cy.get('#workflow-path').contains('github.com/A/l:master');
      checkTabs();
      checkInfoTab();
      // TRS only visibile in public page
      cy.contains('TRS: ').should('not.be.visible');
      checkVersionsTab();
      // Hidden version not visible on public page
      cy.contains('td', 'test').should('be.visible');
      checkFilesTab();
    });
  });
  function checkTabs() {
    getTab('Info');
    getTab('Versions');
    getTab('Files');
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
    cy.contains('td', 'master');
    cy.contains('tr', 'Date Modified');
    cy.contains('td', 'Nov 28, 2016, 3:01:57 PM');
    cy.contains('tr', 'Valid');
    cy.contains('tr', 'Verified Platforms');
    cy.contains('button', 'View');
  }
  function checkFilesTab() {
    goToTab('Files');
    cy.contains('1st-workflow.cwl');
    cy.contains('cwlVersion: v1.0');
  }
});
