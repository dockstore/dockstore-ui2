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
import { resetDB, setTokenUserViewPort, getTab, goToTab } from '../../support/commands';

describe('Dockstore my workflows', () => {
  resetDB();
  setTokenUserViewPort();

  function typeInInput(fieldName: string, text: string) {
    cy.contains(fieldName).parentsUntil('.mat-form-field-wrapper')
      .find('input').clear().type(text);
  }

  function typeInTextArea(fieldName: string, text: string) {
    cy.contains(fieldName).parentsUntil('.mat-form-field-wrapper')
      .find('textarea').clear().type(text);
  }

  describe('Should be able to request new organization', () => {
    it('visit the organizations page from the home page', () => {
      cy.visit('/');
      cy.contains('a', 'Organizations').should('be.visible').should('have.attr', 'href', '/organizations').click();
      cy.contains('No organizations found');
      cy.get('mat-card').should('not.exist');
    });

    it('create a new unapproved organization', () => {
      cy.contains('button', 'Create Organization').should('be.visible').click();
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('be.disabled');
      typeInInput('Name', 'Potato');
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('be.disabled');
      typeInTextArea('Topic', 'Boil \'em, mash \'em, stick \'em in a stew');
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('not.be.disabled');
      typeInInput('Link to Organization Website', 'www.google.ca');
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('be.disabled');
      typeInInput('Location', 'Basement');
      cy.get('.mat-error').should('be.visible');
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('be.disabled');
      typeInInput('Link to Organization Website', 'https://www.google.ca');
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('not.be.disabled');
      typeInInput('Contact Email Address', 'asdf@asdf.ca');
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('not.be.disabled').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/organizations/Potato');
    });
  });

  describe('Should be able to view new unapproved organization', () => {
    it('have the fields just entered in during registration', () => {
      cy.contains('Potato');
      cy.contains('Boil \'em, mash \'em, stick \'em in a stew');
      cy.contains('https://www.google.ca');
      cy.contains('Basement');
      cy.contains('asdf@asdf.ca');
      cy.contains('Collections not found');
    });
    it('be able to edit organization', () => {
      cy.contains('EDIT ORGANIZATION INFO').should('be.visible').click();
      typeInInput('Name', 'Potatoe');
      typeInTextArea('Topic', 'Boil them, mash them, stick them in a stew');
      typeInInput('Link to Organization Website', 'https://www.google.com');
      typeInInput('Location', 'UCSC Basement');
      typeInInput('Contact Email Address', 'asdf@asdf.com');
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('not.be.disabled').click();
    });

    it('have new fields reflected', () => {
      cy.contains('Potatoe');
      cy.contains('Boil them, mash them, stick them in a stew');
      cy.contains('https://www.google.com');
      cy.contains('UCSC Basement');
      cy.contains('asdf@asdf.com');
    });
  });

  describe('Should be able to add/update collection', () => {
    it('be able to add a collection', () => {
      cy.contains('CREATE COLLECTION').click();
      cy.get('#createOrUpdateCollectionButton').should('be.visible').should('be.disabled');
      typeInInput('Name', 'fakeCollectionName');
      typeInTextArea('Description', 'fake collection description');
      cy.get('#createOrUpdateCollectionButton').should('be.visible').should('not.be.disabled').click();
      cy.contains('fakeCollectionName');
      cy.contains('fake collection description');
    });

    it('be able to update a collection', () => {
      cy.contains('EDIT COLLECTION').click();
      cy.get('#createOrUpdateCollectionButton').should('be.visible').should('not.be.disabled');
      typeInInput('Name', 'veryFakeCollectionName');
      typeInTextArea('Description', 'very fake collection description');
      cy.get('#createOrUpdateCollectionButton').should('be.visible').should('not.be.disabled').click();
      // Webservice 1.6.0-alpha.3 is broken at the time of this test, revert once new webservice comes out
      // cy.contains('veryFakeCollectionName');
      // cy.contains('very fake collection description');
    });
  });

  describe('Should be able to update description', () => {
    it('be able to update an organization description with markdown', () => {
      cy.contains('EDIT ORGANIZATION DESCRIPTION').click();
      cy.get('#updateOrganizationDescriptionButton').should('be.visible').should('not.be.disabled');
      typeInTextArea('Description', '* fake organization description');
      cy.get('#updateOrganizationDescriptionButton').should('be.visible').should('not.be.disabled').click();
      cy.contains('fake organization description');
      cy.contains('* fake organization description').should('not.exist');
    });
  });

});
