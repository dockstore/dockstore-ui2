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

// Set the following variable to an appropriate value for your postgres setup.
// const psqlInvocation: string = "PASSWORD=dockstore docker exec -i postgres1 psql";
const psqlInvocation: string = 'PASSWORD=dockstore psql';

export function goToTab(tabName: string): void {
  // cypress tests run asynchronously, so if the DOM changes and an element-of-interest becomes detached while we're manipulating it, the test will fail.
  // our current (admittedly primitive) go-to solution is to wait (sleep) for long enough that the DOM "settles", thus avoiding the "detached element" bug.
  cy.wait(500);
  cy.contains('.mat-tab-label', tabName).should('be.visible').click();
  cy.wait(500);
}

export function assertVisibleTab(tabName: string): void {
  cy.get('.mat-tab-labels').should('be.visible').contains('div', tabName).should('be.visible');
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
  cy.contains('.mat-tab-label', tabName).should('have.class', 'mat-tab-label-active');
}

export function assertNoTab(tabName: string): any {
  return cy.get('.mat-tab-labels').should('be.visible').contains('div', tabName).should('not.exist');
}

export function resetDB() {
  before(() => {
    cy.exec('java -jar dockstore-webservice.jar db drop-all --confirm-delete-everything test/web.yml');
    cy.exec(psqlInvocation + ' -h localhost webservice_test -U dockstore < test/db_dump.sql');
    cy.exec(
      'java -jar dockstore-webservice.jar db migrate -i 1.5.0,1.6.0,1.7.0,1.8.0,1.9.0,1.10.0,alter_test_user_1.10.2,1.11.0,1.12.0,1.13.0 test/web.yml'
    );
  });
}

export function insertAppTools() {
  before(() => {
    cy.exec(psqlInvocation + ' -h localhost webservice_test -U dockstore < test/github_app_tool_db_dump.sql');
  });
}

export function typeInInput(fieldName: string, text: string) {
  cy.contains('span', fieldName).parentsUntil('.mat-form-field-wrapper').find('input').first().should('be.visible').clear().type(text);
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

export function goToUnexpandedSidebarEntry(organization: string, repo: RegExp | string) {
  // This is needed because of a possible defect in the implementation.
  // All expansion panels are shown before any of them are expanded (after some logic of choosing which to expanded).
  // If the user expands a panel before the above happens, their choice gets overwritten
  cy.get('.mat-expanded');
  cy.contains(organization).parent().click();
  // Can't seem to select the mat-expansion-panel for some reason without triple parent
  cy.contains(organization).parent().parent().parent().contains('div .no-wrap', repo).should('be.visible').click();
}

export function invokeSql(sqlStatement: string) {
  cy.exec(psqlInvocation + ' -h localhost webservice_test -U dockstore -c "' + sqlStatement + '"');
}

export function approvePotatoMembership() {
  invokeSql('update organization_user set accepted=true where userid=2 and organizationid=1');
}

export function approvePotatoOrganization() {
  invokeSql("update organization set status='APPROVED' where name like 'Potato%'");
}

export function addOrganizationAdminUser(organization: string, user: string) {
  invokeSql(
    "insert into organization_user (organizationid, userid, accepted, role) values ((select id from organization where name = '" +
      organization +
      "'), (select id from enduser where username = '" +
      user +
      "'), true, 'ADMIN')"
  );
}

export function createOrganization(name: string, displayName: string, topic: string, location: string, website: string, email: string) {
  cy.contains('button', 'Create Organization Request').should('be.visible').click();
  cy.contains('button', 'Next').should('be.visible').click();
  typeInInput('Name', name);
  typeInInput('Display Name', displayName);
  typeInInput('Topic', topic);
  typeInInput('Location', location);
  typeInInput('Organization website', website);
  typeInInput('Contact Email Address', email);
  cy.get('[data-cy=create-or-update-organization-button]').should('be.visible').should('not.be.disabled').click();
  cy.url().should('eq', Cypress.config().baseUrl + '/organizations/' + name);

  cy.reload();
}

export function verifyGithubLinkNewDashboard(entryType: string) {
  cy.visit('/dashboard?newDashboard');
  cy.get('[data-cy=register-entry-btn]').contains(entryType).should('be.visible').click();
  cy.get('[data-cy=storage-type-choice]').contains('GitHub').click();
  cy.contains('button', 'Next').should('be.visible').click();
  cy.contains('a', 'Manage Dockstore installations on GitHub')
    .should('have.attr', 'href')
    .and('include', 'https://github.com/apps/dockstore-testing-application');
}
