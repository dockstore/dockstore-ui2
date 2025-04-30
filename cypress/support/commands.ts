/*
 *    Copyright 2022 OICR, UCSC
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

import { configurationTabName, descriptorFilesTabName, testParameterFilesTabName } from '../../src/app/shared/constants';

// Set the following variable to an appropriate value for your postgres setup.
// const psqlInvocation: string = 'PASSWORD=dockstore docker exec -i postgres1 psql';
const psqlInvocation: string = 'PASSWORD=dockstore psql';

export function isStagingOrProd() {
  const baseUrl = Cypress.config('baseUrl');
  return baseUrl === 'https://staging.dockstore.org' || baseUrl === 'https://dockstore.org';
}

export function isProd() {
  const baseUrl = Cypress.config('baseUrl');
  return baseUrl === 'https://dockstore.org';
}

export function goToTab(tabName: string): void {
  getTab(tabName).click();
}

export function getTab(tabName: string): Cypress.Chainable {
  return cy.contains('[role=tab]', tabName);
}

export function assertNumberOfTabs(expectedNumberOfTabs: number): void {
  cy.get('[role=tab]').should('have.length', expectedNumberOfTabs);
}

// Tabs in an entry page
export function goToInfoTab(): void {
  goToTab('Info');
}

export function goToVersionsTab(): void {
  goToTab('Versions');
}

export function goToLaunchTab(): void {
  goToTab('Launch');
}

export function goToPreviewTab(): void {
  goToTab('Preview');
}

export function goToFilesTab(): void {
  goToTab('Files');
}

export function goToMetricsTab(): void {
  goToTab('Metrics');
}

export function goToToolsTab(): void {
  goToTab('Tools');
}

export function goToDagTab(): void {
  goToTab('DAG');
}

// Secondary tabs in an entry's Files tab
export function goToDescriptorFilesTab() {
  goToTab(descriptorFilesTabName);
}

export function goToTestParameterFilesTab() {
  goToTab(testParameterFilesTabName);
}

export function goToConfigurationTab() {
  goToTab(configurationTabName);
}

// Tabs in the Account page
export function goToAccountPreferencesTab() {
  goToTab('Dockstore Account & Preferences');
}

export function goToRequestsTab() {
  goToTab('Requests');
}

export function assertVisibleTab(tabName: string): void {
  getTab(tabName).should('be.visible');
}

/**
 * Could not find a better way to cancel the dropdown.
 * Tried:
 * - cy.get('body').type('{esc}');
 * - clicking the button again
 */
export function cancelMatMenu(): void {
  cy.reload();
}

// Public workflow should display "Info" "
export function clickFirstActionsButtonPublic(): void {
  cy.get('.small-btn-structure').contains('Info').click();
}

// Private workflow should display "Actions"
export function clickFirstActionsButtonPrivate(): void {
  cy.get('.private-btn').contains('Actions').click();
}

export function isActiveTab(tabName: string): void {
  getTab(tabName).should('have.attr', 'aria-selected', 'true');
}

export function assertNoTab(tabName: string): void {
  getTab(tabName).should('not.exist');
}

export function resetDB() {
  before(() => {
    cy.exec('java -jar dockstore-webservice.jar db drop-all --confirm-delete-everything test/web.yml');
    cy.exec(psqlInvocation + ' -h localhost webservice_test -U dockstore < test/db_dump.sql');
    cy.exec(
      'java -jar dockstore-webservice.jar db migrate -i 1.5.0,1.6.0,1.7.0,1.8.0,1.9.0,1.10.0,alter_test_user_1.10.2,1.11.0,1.12.0,1.13.0,1.14.0,1.15.0,1.16.0,1.17.0 test/web.yml'
    );
  });
}

export function resetDBWithService() {
  before(() => {
    cy.exec('java -jar dockstore-webservice.jar db drop-all --confirm-delete-everything test/web.yml');
    cy.exec(psqlInvocation + ' -h localhost webservice_test -U dockstore < test/db_dump.sql');
    cy.exec(
      'java -jar dockstore-webservice.jar db migrate -i 1.5.0,1.6.0,1.7.0,add_service_1.7.0,1.8.0,1.9.0,1.10.0,alter_test_user_1.10.2,1.11.0,1.12.0,1.13.0,1.14.0,1.15.0,1.16.0,1.17.0 test/web.yml'
    );
  });
}

export function addBeforeSqlFromFile(fileName: string) {
  before(() => {
    cy.exec(psqlInvocation + ' -h localhost webservice_test -U dockstore < ' + fileName);
  });
}

export function insertAppTools() {
  addBeforeSqlFromFile('test/github_app_tool_db_dump.sql');
}

export function insertNotebooks() {
  addBeforeSqlFromFile('test/github_notebook_db_dump.sql');
}

export function insertAuthors() {
  addBeforeSqlFromFile('test/authors_db_dump.sql');
}

export function typeInInput(dataCyName: string, text: string) {
  // Need focus() so that the input is revealed and not hidden by the mat label
  cy.get(`[data-cy="${dataCyName}"]`).focus().clear().type(text);
}

export function selectRadioButton(dataCyName: string) {
  cy.get(`[data-cy="${dataCyName}"] [type="radio"]`).check();
}

export function checkCheckBox(dataCyName: string) {
  cy.get(`[data-cy="${dataCyName}"] [type="checkbox"]`).check();
}

// Sets it to the user where id = 1. Is an admin and curator.
export function setTokenUserViewPort() {
  beforeEach(() => {
    // Login by adding token to local storage
    localStorage.setItem('ng2-ui-auth_token', 'imamafakedockstoretoken');
  });
}

// Sets it to the user where id = 4. Is a curator.
export function setTokenUserViewPortCurator() {
  beforeEach(() => {
    // Login by adding user obj and token to local storage
    localStorage.setItem('ng2-ui-auth_token', 'imamafakedockstoretoken2');
  });
}

// Sets it to the user where id = 5. Is a platform partner.
export function setTokenUserViewPortPlatformPartner() {
  beforeEach(() => {
    // Login by adding user obj and token to local storage
    localStorage.setItem('ng2-ui-auth_token', 'imamafakedockstoretoken3');
  });
}

// Update the user user_platform_partner to be a platform partner
export function setPlatformPartnerRole() {
  invokeSql("update enduser set platformpartner='TERRA' where username = 'user_platform_partner'");
}

export function goToUnexpandedSidebarEntry(organization: string, entryPath: string) {
  expandOrganizationSidebarPanel(organization);
  selectSidebarEntry(entryPath);
}

export function expandOrganizationSidebarPanel(organization: string, userHasEntries: boolean = true) {
  // If the user has entries, check that the entry title is loaded to ensure that the page and side bar is fully loaded
  if (userHasEntries) {
    cy.get('[data-cy=entry-title]').should('be.visible');
  }
  cy.get(`[data-cy="${organization}-panel-header"]`).click();
  cy.get(`[data-cy="${organization}-tab-group"]`).should('be.visible');
}

export function selectOrganizationSidebarTab(organization: string, published: boolean) {
  cy.get(`[data-cy="${organization}-tab-group"]`)
    .should('be.visible')
    .contains(published ? 'Published' : 'Unpublished')
    .click();
}

export function selectSidebarEntry(entryPath: string) {
  cy.get(`[data-cy="${entryPath}-link"]`).should('be.visible').click();
  cy.get('[data-cy=entry-title]').contains(entryPath);
}

export function invokeSql(sqlStatement: string) {
  cy.exec(psqlInvocation + ' -h localhost webservice_test -U dockstore -c "' + sqlStatement + '"');
}

export function createPotatoMembership() {
  cy.get('[data-cy=add-user-to-org-button]').click();
  typeInInput('username-input', 'potato');
  cy.get('mat-select').click();
  cy.get('mat-option').contains('Member').click();
  cy.get('.mat-select-panel').should('not.exist');
  cy.get('[data-cy=upsert-member-button]').should('be.visible').should('not.be.disabled').click();
  cy.get('[data-cy=upsert-member-button]').should('not.exist');
}

export function approvePotatoMembership() {
  invokeSql("update organization_user set status='ACCEPTED' where userid=2 and organizationid=2");
}

export function rejectPotatoMembership() {
  invokeSql("update organization_user set status='REJECTED' where userid=2 and organizationid=2");
}

export function approvePotatoOrganization() {
  invokeSql("update organization set status='APPROVED' where name like 'Potato%'");
}

export function addOrganizationAdminUser(organization: string, user: string) {
  invokeSql(
    "insert into organization_user (organizationid, userid, status, role) values ((select id from organization where name = '" +
      organization +
      "'), (select id from enduser where username = '" +
      user +
      "'), 'ACCEPTED', 'ADMIN')"
  );
}

export function createOrganization(name: string, displayName: string, topic: string, location: string, website: string, email: string) {
  cy.contains('button', 'Create Organization Request').should('be.visible').click();
  cy.contains('button', 'Next').should('be.visible').click();
  typeInInput('name-input', name);
  typeInInput('display-name-input', displayName);
  typeInInput('topic-input', topic);
  typeInInput('location-input', location);
  typeInInput('website-input', website);
  typeInInput('email-input', email);
  cy.get('[data-cy=create-or-update-organization-button]').should('be.visible').should('not.be.disabled').click();
  cy.url().should('eq', Cypress.config().baseUrl + '/organizations/' + name);

  cy.reload();
}

export function verifyGithubLinkDashboard(entryType: string) {
  cy.visit('/dashboard');
  cy.get('[data-cy=register-entry-btn]').contains(entryType).should('be.visible').click();
  cy.get('[data-cy=storage-type-choice]').contains('GitHub').click();
  cy.contains('button', 'Next').should('be.visible').click();
  cy.contains('button', 'Manage Dockstore installations on GitHub').click();
}

export function testNoGithubEntriesText(entryType: string, organization: string) {
  it('Should have no published ' + entryType + 's in ' + organization + ' repository', () => {
    cy.visit('/my-' + entryType + 's');
    expandOrganizationSidebarPanel(organization, false);
    selectOrganizationSidebarTab(organization, true);
    if (entryType === 'tool') {
      cy.get('[data-cy=no-published-appTool-message]').should('contain', 'No published ' + entryType + 's');
    } else {
      cy.get('[data-cy=no-published-' + entryType + '-message]').should('contain', 'No published ' + entryType + 's');
    }
  });
  it('Should have no unpublished ' + entryType + 's in dockstore repository', () => {
    cy.visit('/my-' + entryType + 's');
    expandOrganizationSidebarPanel(organization, false);
    selectOrganizationSidebarTab(organization, false);
    if (entryType === 'tool') {
      cy.get('[data-cy=no-unpublished-appTool-message]').should('contain', 'No unpublished ' + entryType + 's');
    } else {
      cy.get('[data-cy=no-unpublished-' + entryType + '-message]').should('contain', 'No unpublished ' + entryType + 's');
    }
  });
}

export function addToCollection(path: string, organizationName: string, collectionDisplayName: string, versionName?: string) {
  cy.intercept('post', '**/collections/**').as('postToCollection');
  cy.visit(path);
  cy.get('[data-cy=addToolToCollectionButton]').should('be.visible').click();
  cy.get('[data-cy=addEntryToCollectionButton]').should('be.disabled');
  cy.get('[data-cy=selectOrganization]').click();
  cy.get('mat-option').contains(organizationName).click();
  cy.get('[data-cy=addEntryToCollectionButton]').should('be.disabled');
  cy.get('[data-cy=selectCollection]').click();
  cy.get('mat-option').contains(collectionDisplayName).click();
  if (versionName) {
    cy.get('[data-cy=selectVersion]').click();
    cy.get('mat-option').contains(versionName).click();
  }
  cy.get('[data-cy=addEntryToCollectionButton]').should('not.be.disabled').click();
  cy.wait('@postToCollection');
  cy.get('[data-cy=addEntryToCollectionButton]').should('not.exist');
  cy.get('mat-progress-bar').should('not.exist');
}

export function snapshot() {
  cy.get('[data-cy=dockstore-snapshot-locked]').should('have.length', 0);
  // The buttons should be present
  cy.get('[data-cy=dockstore-request-doi-button]').its('length').should('be.gt', 0);
  cy.get('[data-cy=dockstore-snapshot]').its('length').should('be.gt', 0);

  cy.get('[data-cy=dockstore-snapshot-unlocked]').its('length').should('be.gt', 0);

  cy.get('[data-cy=dockstore-snapshot]').first().click();

  cy.get('[data-cy=snapshot-button]').click();

  cy.get('[data-cy=dockstore-snapshot-locked]').should('have.length', 1);
  cy.get('td').contains('Actions').click();
  cy.get('[data-cy=dockstore-snapshot]').should('be.disabled');
}

export function checkFeaturedContent() {
  cy.contains('Featured Content');
  cy.get('app-featured-content').should('exist');
  cy.get('.feat-content-container').within(() => {
    cy.get('.feat-content-card').its('length').should('be.gt', 0);
    cy.get('.feat-content-card').first().get('a').should('have.attr', 'href');
    cy.get('.small-btn-structure').first().contains('View');
  });
}

export function checkNewsAndUpdates() {
  cy.contains('News & Updates');
  cy.get('app-news-and-updates').should('exist');
  cy.get('.news-and-updates-box').within(() => {
    cy.get('.news-entry').its('length').should('be.gt', 0);
    cy.get('.news-entry').first().get('a').should('have.attr', 'href');
  });
}

export function checkMastodonFeed() {
  cy.get('[data-cy=mt-toot]').should('exist');
}
