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
import { createOrganization, resetDB, setTokenUserViewPort, setTokenUserViewPortCurator } from '../../support/commands';

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
      createOrganization('Test', 'Test Display', 'Testing Testing Testing', 'Lab', 'https://www.google.ca', 'asf@asdf.ca');
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
      createOrganization(
        'Potato111',
        'Potato111',
        "Boil 'em, mash 'em, stick 'em in a stew",
        'Basement',
        'https://www.google.ca',
        'a111sdf@asdf.ca'
      );
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
