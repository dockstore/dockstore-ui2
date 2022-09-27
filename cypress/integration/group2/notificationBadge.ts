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
    cy.visit('');
    cy.get('#notifButton').should('be.visible').click();
    cy.url().should('contain', 'accounts?tab=requests');
  });

  it('Red badge should not be visible when there are no notifications', () => {
    cy.visit('');
    cy.get('mat-icon').should('have.class', 'mat-badge-hidden');
  });

  describe('Should have badge count of 1 with pending organization request', () => {
    it('visit the organizations page from the home page', () => {
      cy.visit('/');
      cy.contains('a', 'Organizations').should('be.visible').should('have.attr', 'href', '/organizations').click();
      cy.contains('No organizations found');
    });

    it('create a new unapproved organization', () => {
      cy.contains('button', 'Create Organization Request').should('be.visible').click();
      cy.contains('button', 'Next').should('be.visible').click();
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('be.disabled');
      typeInInput('Name', 'Potato');
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('be.disabled');
      typeInInput('Display Name', 'Potato');
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('be.disabled');
      typeInInput('Topic', "Boil 'em, mash 'em, stick 'em in a stew");
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('be.disabled');
      typeInInput('Email', 'fake@potato.com');
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('not.be.disabled');
      typeInInput('Organization website', 'www.google.ca');
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('be.disabled');
      typeInInput('Location', 'Basement');
      cy.get('.mat-error').should('be.visible');
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('be.disabled');
      typeInInput('Organization website', 'https://www.google.ca');
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('not.be.disabled');

      cy.get('[data-cy=image-url-input').clear().type('https://via.placeholder.com/150');
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('be.disabled');

      typeInInput('Contact Email Address', 'asdf@asdf.ca');
      cy.get('.mat-error').should('be.visible');
      cy.get('[data-cy=image-url-input').clear();
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('not.be.disabled').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/organizations/Potato');

      cy.reload();
      cy.get('#notifButton').should('be.visible').click();
      cy.get('mat-icon').should('contain.text', '1');
    });
  });
  describe('Should have badge count of 1 with a rejected organization request', () => {
    it('visit the requests page', () => {
      cy.get('#notifButton').should('be.visible').click();
    });

    it('reject a pending organization', () => {
      cy.contains('button', 'Reject').should('be.visible').click();
      cy.get('#reject-pending-org-dialog').should('be.visible').click();
      cy.reload();
      cy.get('#notifButton').should('be.visible').click();
      cy.get('mat-icon').should('contain.text', '1');
    });
  });
  describe('Should have badge count of 3 with one pending organiaztion, one invitation, and one rejected organization request', () => {
    setTokenUserViewPortCurator();
    it('visit the organizations page from the home page', () => {
      cy.visit('');
      cy.contains('a', 'Organizations').should('be.visible').should('have.attr', 'href', '/organizations').click();
      cy.contains('No organizations found');
    });

    it('create a new unapproved organization and invite user', () => {
      cy.contains('button', 'Create Organization Request').should('be.visible').click();
      cy.contains('button', 'Next').should('be.visible').click();
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('be.disabled');
      typeInInput('Name', 'Potato111');
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('be.disabled');
      typeInInput('Display Name', 'Potato111');
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('be.disabled');
      typeInInput('Topic', "Boil 'em, mash 'em, stick 'em in a stew");
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('be.disabled');
      typeInInput('Email', 'fake11@potato.com');
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('not.be.disabled');
      typeInInput('Organization website', 'www.google.ca');
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('be.disabled');
      typeInInput('Location', 'Basement');
      cy.get('.mat-error').should('be.visible');
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('be.disabled');
      typeInInput('Organization website', 'https://www.google.ca');
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('not.be.disabled');

      cy.get('[data-cy=image-url-input').clear().type('https://via.placeholder.com/150');
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('be.disabled');

      typeInInput('Contact Email Address', 'a111sdf@asdf.ca');
      cy.get('.mat-error').should('be.visible');
      cy.get('[data-cy=image-url-input').clear();
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('not.be.disabled').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/organizations/Potato111');

      cy.reload();
      cy.get('#mat-tab-label-0-1').contains('Members').click();
      cy.contains('button', 'Add user').should('be.visible').click();
      typeInInput('Username', 'user_A');
      cy.contains('button', 'Add User').should('be.visible').click();
      cy.reload();
    });

    describe('Log back onto user_A', () => {
      setTokenUserViewPort();
      it('Badge count should be 3', () => {
        cy.visit('');
        cy.get('#notifButton').should('be.visible').click();
        cy.get('mat-icon').should('contain.text', '3');
      });
    });
  });
});
