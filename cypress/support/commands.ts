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

export function goToTab(tabName: string): any {
  return cy
  .get('.mat-tab-labels')
  .should('be.visible')
  .contains('div', tabName)
  .should('be.visible').click();
}

export function getTab(tabName: string): any {
  return cy
      .get('.mat-tab-labels')
      .should('be.visible')
      .contains('div', tabName)
      .should('be.visible');
}

export function resetDB() {
  before(() => {
    cy.exec('PGPASSWORD=dockstore psql -h localhost -c \'drop schema if exists public cascade\' webservice_test -U dockstore');
    cy.exec('PGPASSWORD=dockstore psql -h localhost -c \'create schema public\' webservice_test -U dockstore', { failOnNonZeroExit: false });
    cy.exec('PGPASSWORD=dockstore psql -h localhost -f travisci/db_dump.sql webservice_test -U dockstore');
    cy.exec('java -jar dockstore-webservice-*.jar db migrate -i 1.5.0,1.6.0 travisci/web.yml');
  });
}
export function setTokenUserViewPort() {
  beforeEach(() => {
    // Login by adding user obj and token to local storage
    localStorage.setItem('dockstore.ui.userObj', '{\"id\": 1, \"username\": \"user_A\", \"isAdmin\": \"false\", \"name\": \"user_A\"}');
    localStorage.setItem('ng2-ui-auth_token', 'imamafakedockstoretoken');
  });
}

export function setTokenUserViewPortCurator() {
  beforeEach(() => {
    // Login by adding user obj and token to local storage
    localStorage.setItem('dockstore.ui.userObj',
    '{\"id\": 4, \"username\": \"user_curator\", \"isAdmin\": \"false\", \"name\": \"user_curator\", \"curator\": \"true\"}');
    localStorage.setItem('ng2-ui-auth_token', 'imamafakedockstoretoken2');
  });
}

export function goToUnexpandedSidebarEntry(organization: string, repo: (RegExp | string)) {
  // This is needed because of a possible defect in the implementation.
  // All expansion panels are shown before any of them are expanded (after some logic of choosing which to expanded).
  // If the user expands a panel before the above happens, their choice gets overwritten
  cy.get('.mat-expanded');
  cy.contains(organization)
    .click();
  // Can't seem to select the mat-expansion-panel for some reason without triple parent
  cy.contains(organization)
    .parent()
    .parent()
    .parent()
    .contains('div .no-wrap', repo)
    .should('be.visible').click();
}

export function approvePotatoMembership() {
  cy.exec('PGPASSWORD=dockstore psql -h localhost -c \'update organization_user set accepted=true where userid=2 and organizationid=1\' webservice_test -U dockstore');
}
