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
import { resetDB, setTokenUserViewPort, setTokenUserViewPortCurator } from '../../support/commands';

describe('Test notification badge on navbar', () => {
  function typeInInput(fieldName: string, text: string) {
    cy.contains('span', fieldName).parentsUntil('.mat-form-field-wrapper').find('input').first().should('be.visible').clear().type(text);
  }
  resetDB();
  setTokenUserViewPort();

  it('Notification button should link to requests page', () => {
    cy.visit('/');
    cy.get('[data-cy=notification-button]').should('be.visible').click();
    cy.url().should('contain', 'accounts?tab=requests');
  });

  it('Red badge should not be visible when there are no notifications', () => {
    cy.visit('/');
    cy.get('[data-cy=bell-icon]').should('have.class', 'mat-badge-hidden');
  });

  describe('Should have badge count of 1 with pending organization request', () => {
    it('visit the organizations page from the home page', () => {
      cy.visit('/');
      cy.contains('a', 'Organizations').should('be.visible').should('have.attr', 'href', '/organizations').click();
    });

    it('create a new unapproved organization', () => {
      cy.contains('button', 'Create Organization Request').should('be.visible').click();
      cy.contains('button', 'Next').should('be.visible').click();
      typeInInput('Name', 'Test');
      typeInInput('Display Name', 'Test');
      typeInInput('Topic', 'Testing Testing Testing');
      typeInInput('Location', 'Lab');
      typeInInput('Organization website', 'https://www.google.ca');
      typeInInput('Contact Email Address', 'asdf@asdf.ca');
      cy.get('[data-cy=create-or-update-organization-button]').should('be.visible').should('not.be.disabled').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/organizations/Test');

      cy.reload();
      cy.get('[data-cy=notification-button]').should('be.visible').click();
      cy.get('[data-cy=bell-icon]').should('contain.text', '1');
    });
  });
  describe('Should have badge count of 1 with a rejected organization request', () => {
    it('visit the requests page', () => {
      cy.get('[data-cy=notification-button]').should('be.visible').click();
    });

    it('reject a pending organization', () => {
      cy.contains('button', 'Reject').should('be.visible').click();
      cy.get('[data-cy=reject-pending-org-dialog]').should('be.visible').click();
      cy.reload();
      cy.get('[data-cy=notification-button]').should('be.visible').click();
      cy.get('[data-cy=bell-icon]').should('contain.text', '1');
    });
  });
  describe('Should have badge count of 3 with one pending organiaztion, one invitation, and one rejected organization request', () => {
    setTokenUserViewPortCurator();
    it('visit the organizations page from the home page', () => {
      cy.visit('/');
      cy.contains('a', 'Organizations').should('be.visible').should('have.attr', 'href', '/organizations').click();
    });

    it('create a new unapproved organization and invite user', () => {
      cy.contains('button', 'Create Organization Request').should('be.visible').click();
      cy.contains('button', 'Next').should('be.visible').click();
      typeInInput('Name', 'Potato111');
      typeInInput('Display Name', 'Potato111');
      typeInInput('Topic', "Boil 'em, mash 'em, stick 'em in a stew");
      typeInInput('Location', 'Basement');
      typeInInput('Organization website', 'https://www.google.ca');
      typeInInput('Contact Email Address', 'a111sdf@asdf.ca');
      cy.get('[data-cy=create-or-update-organization-button]').should('be.visible').should('not.be.disabled').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/organizations/Potato111');

      cy.reload();
      cy.contains('span', 'Members').click();
      cy.contains('button', 'Add user').should('be.visible').click();
      typeInInput('Username', 'user_A');
      cy.contains('button', 'Add User').should('be.visible').click();
      cy.reload();
    });

    describe('Log back onto user_A', () => {
      setTokenUserViewPort();
      it('Badge count should be 3', () => {
        cy.visit('/');
        cy.get('[data-cy=notification-button]').should('be.visible').click();
        cy.get('[data-cy=bell-icon]').should('contain.text', '3');
      });
    });
  });
});
