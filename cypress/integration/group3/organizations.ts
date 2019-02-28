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
import { resetDB, setTokenUserViewPort, approvePotatoMembership } from '../../support/commands';

describe('Dockstore Organizations', () => {
  resetDB();
  setTokenUserViewPort();

  function typeInInput(fieldName: string, text: string) {
    cy.contains(fieldName).parentsUntil('.mat-form-field-wrapper')
      .find('input').first().clear().type(text);
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
    });

    it('create a new unapproved organization', () => {
      cy.contains('button', 'Create Organization Request').should('be.visible').click();
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('be.disabled');
      typeInInput('Name', 'Potato');
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('be.disabled');
      typeInInput('Display Name', 'Potato');
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('be.disabled');
      typeInTextArea('Topic', 'Boil \'em, mash \'em, stick \'em in a stew');
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('not.be.disabled');
      typeInInput('Organization website', 'www.google.ca');
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('be.disabled');
      typeInInput('Location', 'Basement');
      cy.get('.mat-error').should('be.visible');
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('be.disabled');
      typeInInput('Organization website', 'https://www.google.ca');
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
      cy.contains('No collections found');
    });
    it('be able to edit organization', () => {
      cy.get('#editOrgInfo').should('be.visible').click();
      typeInInput('Name', 'Potatoe');
      typeInInput('Display Name', 'Potatoe');
      typeInTextArea('Topic', 'Boil them, mash them, stick them in a stew');
      typeInInput('Organization website', 'https://www.google.com');
      typeInInput('Location', 'UCSC Basement');
      typeInInput('Contact Email Address', 'asdf@asdf.com');
      cy.get('#createOrUpdateOrganizationButton').should('be.visible').should('not.be.disabled').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/organizations/Potatoe');
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
      cy.get('#createCollection').click();
      cy.get('#createOrUpdateCollectionButton').should('be.visible').should('be.disabled');
      typeInInput('Name', 'fakeCollectionName');
      typeInInput('Display Name', 'fakeCollectionName');
      typeInTextArea('Description', 'fake collection description');
      cy.get('#createOrUpdateCollectionButton').should('be.visible').should('not.be.disabled').click();
      cy.contains('fakeCollectionName');
      cy.contains('fake collection description');
    });

    it('be able to update a collection', () => {
      cy.get('#editCollection').click();
      cy.get('#createOrUpdateCollectionButton').should('be.visible').should('not.be.disabled');
      typeInInput('Name', 'veryFakeCollectionName');
      typeInInput('Display Name', 'veryFakeCollectionName');
      typeInTextArea('Description', 'very fake collection description');
      cy.get('#createOrUpdateCollectionButton').should('be.visible').should('not.be.disabled').click();
      cy.get('#createOrUpdateCollectionButton').should('not.be.visible');
      cy.contains('veryFakeCollectionName');
      cy.contains('very fake collection description');
    });
  });

  describe('Should be able to update description', () => {
    it('be able to update an organization description with markdown', () => {
      cy.get('#editOrgDescription').click();
      cy.get('#updateOrganizationDescriptionButton').should('be.visible').should('not.be.disabled');
      typeInTextArea('Description', '* fake organization description');
      cy.contains('Preview Mode').click();
      cy.contains('fake organization description');
      cy.contains('* fake organization description').should('not.exist');
      cy.get('#updateOrganizationDescriptionButton').should('be.visible').should('not.be.disabled').click();
      cy.get('#updateOrganizationDescriptionButton').should('not.be.visible');
      cy.contains('fake organization description');
      cy.contains('* fake organization description').should('not.exist');
    });
  });

  describe('should be able to view a collection', () => {
    it('be able to see collection information', () => {
      cy.visit('/organizations/1/collections/1');
      cy.contains('veryFakeCollectionName').click();
      // Should retrieve the organization
      cy.contains('Potatoe');

      // Should retrieve the collection
      cy.contains('veryFakeCollectionName');
      cy.contains('very fake collection description');

      // Should have no entries
      cy.contains('This collection has no associated entries');
    });

    it('be able to edit collection information', () => {
      // Should be able to edit the collection description and see the changes reflected
      cy.get('#editCollection').click();
      cy.get('#createOrUpdateCollectionButton').should('be.visible').should('not.be.disabled');
      typeInInput('Name', 'veryFakeCollectionName');
      typeInInput('Display Name', 'veryFakeCollectionName');
      typeInTextArea('Description', 'very fake collection description2');
      cy.get('#createOrUpdateCollectionButton').should('be.visible').should('not.be.disabled').click();
      cy.contains('veryFakeCollectionName');
      cy.contains('very fake collection description2');
    });

    it('be able to add an entry to the collection', () => {
      cy.visit('/containers/quay.io/garyluu/dockstore-cgpmap/cgpmap-cramOut:3.0.0-rc8?tab=info');
      cy.get('#addToolToCollectionButton').should('be.visible').click();
      cy.get('#addEntryToCollectionButton').should('be.disabled');
      cy.get('#selectOrganization').click();
      cy.get('mat-option').contains('Potatoe').click();

      cy.get('#addEntryToCollectionButton').should('be.disabled');
      cy.get('#selectCollection').click();
      cy.get('mat-option').contains('veryFakeCollectionName').click();
      cy.get('#addEntryToCollectionButton').should('not.be.disabled').click();
    });

    it('be able to remove an entry from a collection', () => {
      cy.visit('/organizations/1/collections/1');
      cy.contains('quay.io/garyluu/dockstore-cgpmap/cgpmap-cramOut');
      cy.get('#removeToolButton').click();
      cy.get('#accept-remove-entry-from-org').click();
      cy.contains('This collection has no associated entries');
      cy.visit('/organizations/1');
    });
  });


  describe('Should be able to CRUD user', () => {
    beforeEach(() => {
      cy.contains('Members').click();
    });

    it('be able to Read organization user', () => {
      cy.get('mat-card-title').contains('user_A');
      cy.get('#edit-user-role-0').should('be.disabled');
    });

    it('be able to Create organization user', () => {
      cy.get('#addUserToOrgButton').click();
      typeInInput('Username', 'potato');
      cy.get('mat-select').click();
      cy.get('mat-option').contains('Member').click();
      cy.get('.mat-select-panel').should('not.be.visible');
      cy.get('#upsertUserDialogButton').should('be.visible').should('not.be.disabled').click();
      cy.get('#upsertUserDialogButton').should('not.be.visible');
      cy.contains('mat-card-title', 'potato').should('not.be.visible');

      // Need to approve membership and reload for it to be visible
      approvePotatoMembership();
      cy.visit('/organizations/1');
      cy.contains('Members').click();
      cy.contains('mat-card-title', 'potato').parent().parent().parent().contains('Member');
    });

    it('be able to Update organization user', () => {
      cy.get('#edit-user-role-1').should('not.be.disabled').click();
      cy.get('mat-select').click();
      cy.get('mat-option').contains('Maintainer').click();
      cy.get('.mat-select-panel').should('not.be.visible');
      cy.get('#upsertUserDialogButton').should('be.visible').should('not.be.disabled').click();
      cy.get('#upsertUserDialogButton').should('not.be.visible');
      cy.contains('mat-card-title', 'potato').parent().parent().parent().contains('Maintainer');
    });

    it('be able to Delete organization user', () => {
      cy.get('#remove-user-0').should('not.be.disabled').click();
      cy.contains('mat-card-title', 'potato').should('not.be.visible');
    });
  });

  describe('Verify title tags ', () => {
    it('Specific organization', () => {
      cy.visit('/organizations/1');
      cy.title().should('eq', 'Dockstore | Organization');
    });

    it('Collection', () => {
      cy.visit('/organizations/1/collections/1');
      cy.title().should('eq', 'Dockstore | Collection');
    });
  });
});
