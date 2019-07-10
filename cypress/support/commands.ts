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

export function assertNoTab(tabName: string): any {
  return cy
    .get('.mat-tab-labels')
    .should('be.visible')
    .contains('div', tabName)
    .should('not.be.visible');
}

export function resetDB() {
  before(() => {
    checkInitialConnectionPool();
    cy.exec('java -jar dockstore-webservice.jar db locks --force-release travisci/web.yml');
    cy.exec('java -jar dockstore-webservice.jar db drop-all --confirm-delete-everything travisci/web.yml');
    cy.exec('PGPASSWORD=dockstore psql -h localhost -f travisci/db_dump.sql webservice_test -U dockstore')
      .its('stdout').should('contain', 'ALTER TABLE');
    cy.exec('java -jar dockstore-webservice.jar db migrate -i 1.5.0,1.6.0,1.7.0 travisci/web.yml')
      .its('stdout').should('contain', 'Successfully released change log lock');
    checkInitialConnectionPool();
  });
}

export function checkInitialConnectionPool() {
    cy.exec(
      `PGPASSWORD=dockstore psql -h localhost -c "SELECT * FROM pg_stat_activity WHERE state NOT LIKE '%idle%'" webservice_test -U dockstore`
    ).then(result => {
      cy.log(result.stdout);
      expect(result.stdout).contains('a');
      cy.wait(5000);
          const baseUrl = Cypress.config().baseUrl;
          if (baseUrl) {
            const adminBaseUrl = baseUrl.replace('4200', '8081');
            cy.request(adminBaseUrl + '/metrics').then(response => {
              expect(response.body).to.have.property('gauges');
              expect(response.body.gauges['io.dropwizard.db.ManagedPooledDataSource.hibernate.active']['value']).to.eq(0);
              cy.wait(5000);
              cy.exec(
                `PGPASSWORD=dockstore psql -h localhost -c "SELECT * FROM pg_stat_activity WHERE state NOT LIKE '%idle%'" webservice_test -U dockstore`
              ).then(result => {
                expect(result.stdout).contains('a');
                cy.wait(5000);
              });
            });
          }
    });

}

export function assertConnectionPool(): void {
  checkInitialConnectionPool();

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
    .should('be.visible')
    .click();
}

export function approvePotatoMembership() {
  cy.exec('PGPASSWORD=dockstore psql -h localhost -c \'update organization_user set accepted=true where userid=2 and organizationid=1\' webservice_test -U dockstore');
}
