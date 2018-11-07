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
    cy.visit('/containers/quay.io%2FA2%2Fa');
    cy.url().should('eq', Cypress.config().baseUrl + '/containers/quay.io/A2/a:latest?tab=info');
  });
  it('Should redirect to canonical url (tools)', () => {
    cy.visit('/tools/quay.io/A2/a');
    cy.url().should('eq', Cypress.config().baseUrl + '/containers/quay.io/A2/a:latest?tab=info');
  });
  it('Should redirect to canonical url (encoding + tools)', () => {
    cy.visit('/tools/quay.io%2FA2%2Fa');
    cy.url().should('eq', Cypress.config().baseUrl + '/containers/quay.io/A2/a:latest?tab=info');
  });
  it('Should redirect to canonical url (version)', () => {
    cy.visit('/containers/quay.io/A2/a:latest');
    cy.url().should('eq', Cypress.config().baseUrl + '/containers/quay.io/A2/a:latest?tab=info');
  });
  it('Should redirect to canonical url (tab)', () => {
    cy.visit('/containers/quay.io/A2/a?tab=files');
    cy.url().should('eq', Cypress.config().baseUrl + '/containers/quay.io/A2/a:latest?tab=files');
  });
  it('Should redirect to canonical url (tab + version)', () => {
    cy.visit('/containers/quay.io/A2/a:latest?tab=files');
    cy.url().should('eq', Cypress.config().baseUrl + '/containers/quay.io/A2/a:latest?tab=files');
  });
  it('Should redirect to canonical url (tools + encoding + tab + version)', () => {
    cy.visit('/tools/quay.io%2FA2%2Fa:latest?tab=files');
    cy.url().should('eq', Cypress.config().baseUrl + '/containers/quay.io/A2/a:latest?tab=files');
  });
});

describe('Dockstore Tool Details of quay.io/A2/a', () => {
  resetDB();
  setTokenUserViewPort();
  beforeEach(() => {
    cy.visit('/containers/quay.io/A2/a');
    cy
      .get('tab')
      .should('have.length', 7);
    cy.url().should('eq', Cypress.config().baseUrl + '/containers/quay.io/A2/a:latest?tab=info');
  });

  it('Change tab to launch', () => {
    cy
      .get('.nav-link')
      .contains('Launch')
      .parent()
      .click();
    cy.url().should('eq', Cypress.config().baseUrl + '/containers/quay.io/A2/a:latest?tab=launch');
  });

  it('Change tab to versions', () => {
    cy
      .get('.nav-link')
      .contains('Versions')
      .parent()
      .click();
    cy.url().should('eq', Cypress.config().baseUrl + '/containers/quay.io/A2/a:latest?tab=versions');
  });

  describe('Change tab to files', () => {
    beforeEach(() => {
      cy
        .get('.nav-link')
        .contains('Files')
        .parent()
        .click();
      cy.url().should('eq', Cypress.config().baseUrl + '/containers/quay.io/A2/a:latest?tab=files');
    });

    it('Should have Dockerfile tab selected', () => {
      cy
        .get('.nav-link')
        .contains('Dockerfile')
        .parent()
        .click()
        .should('have.class', 'active');

      it('Should have content in file viewer', () => {
        cy
          .get('.ace_content')
          .should('be.visible');
      });
    });

    describe('Change tab to Descriptor files', () => {
      beforeEach(() => {
        cy
          .get('.nav-link')
          .contains('Descriptor Files')
          .parent()
          .click();
      });

      it('Should have content in file viewer', () => {
        cy
          .get('.ace_content')
          .should('be.visible');
      });
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
          .should('not.be.visible');
        cy
          .contains('A Test Parameter File associated with this Docker container, descriptor type and version could not be found.');
      });
    });
  });
});

describe('Dockstore Tool Details of quay.io/garyluu/dockstore-cgpmap/cgpmap-cramOut', () => {
  setTokenUserViewPort();
  beforeEach(() => {
    cy.visit('/containers/quay.io/garyluu/dockstore-cgpmap/cgpmap-cramOut');
    cy
      .get('tab')
      .should('have.length', 7);
  });


  describe('Change tab to files', () => {
    beforeEach(() => {
      cy
        .get('.nav-link')
        .contains('Files')
        .parent()
        .click();
    });

    it('Should have Dockerfile tab selected', () => {
      cy
        .get('.nav-link')
        .contains('Dockerfile')
        .parent()
        .click()
        .should('have.class', 'active');

      it('Should have content in file viewer', () => {
        cy
          .get('.ace_content')
          .should('be.visible');
      });
    });

    describe('Change tab to Descriptor files', () => {
      beforeEach(() => {
        cy
          .get('.nav-link')
          .contains('Descriptor Files')
          .parent()
          .click();
      });

      it('Should have content in file viewer', () => {
        cy
          .get('.ace_content')
          .should('be.visible');
      });
    });

    describe('Change tab to Test Parameters', () => {
      beforeEach(() => {
        cy
          .get('.nav-link')
          .contains('Test Parameter Files')
          .parent()
          .click();
      });

      it('Should have content in file viewer', () => {
        cy
          .get('.ace_content')
          .should('be.visible');
      });
    });
  });
});

describe('Dockstore Tool Details of quay.io/A2/b3', () => {
  setTokenUserViewPort();
  beforeEach(() => {
    cy.visit('/containers/quay.io/A2/b3');
    cy
      .get('tab')
      .should('have.length', 7);
  });

  it('Change tab to versions, should only have one visible', () => {
    cy
      .get('.nav-link')
      .contains('Versions')
      .parent()
      .click();

    cy.url().should('eq', Cypress.config().baseUrl + '/containers/quay.io/A2/b3:latest?tab=versions');

    cy
      .get('tbody>tr')
      .should('have.length', 1);
  });

});
