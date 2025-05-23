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
import { TokenUser } from '../../../src/app/shared/openapi';
import {
  approvePotatoMembership,
  approvePotatoOrganization,
  createPotatoMembership,
  rejectPotatoMembership,
  setTokenUserViewPort,
  addToCollection,
  insertNotebooks,
  resetDBWithService,
  createOrganization,
  invokeSql,
  typeInInput,
} from '../../support/commands';
import { TokenSource } from '../../../src/app/shared/enum/token-source.enum';

const imageURL = 'https://superduperfakepotatourl.com/potato.png';
describe('Dockstore Organizations', () => {
  resetDBWithService();
  setTokenUserViewPort();

  describe('Should need to link two external accounts', () => {
    beforeEach(() => {
      const userTokens: Array<TokenUser> = [{ tokenSource: TokenSource.DOCKSTORE, id: 1, username: 'user_A' }];
      cy.intercept('GET', '*/users/1/tokens', {
        body: userTokens,
      });
    });

    it('Next button should be disabled on form', () => {
      cy.visit('/organizations');
      cy.contains('button', 'Create Organization Request').should('be.visible').click();
      cy.contains('button', 'Link Accounts').should('be.visible');
      cy.contains('button', 'Next').should('be.disabled');
      cy.contains('button', 'Link Accounts').should('be.visible').click();
      cy.contains('Linked Accounts & Tokens');
    });
  });

  describe('Should be able to request new organization', () => {
    it('visit the organizations page from the home page', () => {
      cy.visit('/');
      cy.contains('a', 'Organizations').should('be.visible').should('have.attr', 'href', '/organizations').click();
      cy.contains('No organizations found');

      cy.contains('button', 'Create Organization Request').should('be.visible').click();
      cy.contains('button', 'Next').should('be.visible').click();
      cy.get('[data-cy=create-or-update-organization-button]').should('be.visible').should('be.disabled');
      typeInInput('name-input', 'Potato');
      cy.get('[data-cy=create-or-update-organization-button]').should('be.visible').should('be.disabled');
      typeInInput('display-name-input', 'Potato');
      cy.get('[data-cy=create-or-update-organization-button]').should('be.visible').should('be.disabled');
      typeInInput('topic-input', "Boil 'em, mash 'em, stick 'em in a stew");
      cy.get('[data-cy=create-or-update-organization-button]').should('be.visible').should('be.disabled');
      typeInInput('email-input', 'fake@potato.com');
      cy.get('[data-cy=create-or-update-organization-button]').should('be.visible').should('not.be.disabled');
      typeInInput('website-input', 'www.google.ca');
      cy.get('[data-cy=create-or-update-organization-button]').should('be.visible').should('be.disabled');
      typeInInput('location-input', 'Basement');
      cy.get('mat-error').should('be.visible');
      cy.get('[data-cy=create-or-update-organization-button]').should('be.visible').should('be.disabled');
      typeInInput('website-input', 'https://www.google.ca');
      cy.get('[data-cy=create-or-update-organization-button]').should('be.visible').should('not.be.disabled');

      typeInInput('image-url-input', 'https://www.gravatar.com/avatar/');
      cy.get('[data-cy=create-or-update-organization-button]').should('be.visible').should('be.disabled');

      typeInInput('email-input', 'asdf@asdf.ca');
      cy.get('mat-error').should('be.visible');
      cy.get('[data-cy=image-url-input').clear();
      cy.get('[data-cy=create-or-update-organization-button]').should('be.visible').should('not.be.disabled').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/organizations/Potato');

      cy.contains('Potato');
      cy.contains("Boil 'em, mash 'em, stick 'em in a stew");
      cy.contains('https://www.google.ca');
      cy.contains('Basement');
      // Why does next line work in Cypress 8? Dangling DOM? I don't see it in screenshot; removing for Cypress 9
      // cy.contains('asdf@asdf.ca');
      cy.contains('No collections found');

      cy.get('[data-cy=edit-org-info-button]').should('be.visible').click();
      cy.wait(2000);
      typeInInput('name-input', 'Potatoe');
      typeInInput('display-name-input', 'Potatoe');
      typeInInput('topic-input', 'Boil them, mash them, stick them in a stew');
      typeInInput('website-input', 'https://www.google.com');
      typeInInput('location-input', 'UCSC Basement');
      typeInInput('email-input', 'asdf@asdf.com');
      // Verify you can add and remove and image url successfully. Add image back for further testing below.
      typeInInput('image-url-input', imageURL);
      cy.get('[data-cy=image-url-input]').should('have.value', imageURL);
      cy.get('[data-cy=create-or-update-organization-button]').should('be.visible').should('not.be.disabled').click();
      cy.get('[data-cy=create-or-update-organization-button]').should('not.exist');
      cy.get('[data-cy=edit-org-info-button]').should('be.visible').click();
      // I don't even
      cy.wait(2000);
      cy.get('[data-cy=image-url-input]').should('be.visible').clear();
      cy.get('[data-cy=image-url-input]').should('not.have.value', imageURL);
      cy.get('[data-cy=create-or-update-organization-button]').should('be.visible').should('not.be.disabled').click();
      cy.get('[data-cy=create-or-update-organization-button]').should('not.exist');
      cy.get('[data-cy=edit-org-info-button]').should('be.visible').click();
      cy.get('[data-cy=image-url-input]').should('be.visible').clear();
      cy.get('[data-cy=image-url-input]').should('not.have.value', imageURL);
      typeInInput('image-url-input', imageURL);
      cy.get('[data-cy=image-url-input]').should('have.value', imageURL);
      cy.get('[data-cy=create-or-update-organization-button]').should('be.visible').should('not.be.disabled').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/organizations/Potatoe');

      cy.contains('Potatoe');
      cy.contains('Boil them, mash them, stick them in a stew');
      cy.contains('https://www.google.com');
      cy.contains('UCSC Basement');
      // Why does next line work in Cypress 8? Dangling DOM? I don't see it in screenshot; removing for Cypress 9
      // cy.contains('asdf@asdf.ca');

      cy.visit('/dashboard');
      cy.contains('1 Pending Request');
      cy.get('[data-cy=view-my-organizations]').click();
      cy.contains('My Organizations');
      cy.contains('Potatoe');
    });
  });

  describe('Should be able to add/update collection', () => {
    it('be able to add a collection', () => {
      cy.visit('/organizations/Potatoe');
      cy.get('#createCollection').click();
      cy.get('#createOrUpdateCollectionButton').should('be.visible').should('be.disabled');
      typeInInput('name-input', 'fakeCollectionName');
      typeInInput('display-name-input', 'fakeCollectionName');
      typeInInput('topic-input', 'fake collection topic');
      cy.get('#createOrUpdateCollectionButton').should('be.visible').should('not.be.disabled').click();
      cy.wait(2000);
      cy.contains('fakeCollectionName');
      cy.contains('fake collection topic');

      cy.get('#editCollection').click();
      cy.wait(2000);
      cy.get('#createOrUpdateCollectionButton').should('be.visible').should('not.be.disabled');
      typeInInput('name-input', 'veryFakeCollectionName');
      typeInInput('display-name-input', 'veryFakeCollectionName');
      typeInInput('topic-input', 'very fake collection topic');
      cy.get('#createOrUpdateCollectionButton').should('be.visible').should('not.be.disabled').click();
      cy.get('#createOrUpdateCollectionButton').should('not.exist');
      cy.contains('veryFakeCollectionName');
      cy.contains('very fake collection topic');

      cy.visit('/organizations/Potatoe');
      cy.get('#editOrgDescription').click();
      cy.wait(2000);
      cy.get('#updateOrganizationDescriptionButton').should('be.visible').should('not.be.disabled');
      typeInInput('description-input', '* fake organization description');
      cy.contains('Preview Mode').click();
      cy.contains('fake organization description');
      // narrowed search to popup window so as to not search the JSON LD containing the description, which doesn't display markdown
      cy.get('[data-cy=updateOrganizationDescriptionWindow]').contains('* fake organization description').should('not.exist');
      cy.get('#updateOrganizationDescriptionButton').should('be.visible').should('not.be.disabled').click();
      cy.get('#updateOrganizationDescriptionButton').should('not.exist');
      cy.contains('fake organization description');
      cy.get('[data-cy=organizationDetails]').contains('* fake organization description').should('not.exist');
    });
  });

  describe('should be able to view a collection', () => {
    beforeEach(() => {
      const memberships = [
        {
          id: 1,
          role: 'MAINTAINER',
          status: 'ACCEPTED',
          organization: { id: 2, status: 'APPROVED', name: 'Potatoe', displayName: 'Potatoe' },
        },
      ];
      cy.intercept('GET', '*/users/user/memberships', {
        body: memberships,
      });
    });

    it('be able to see collection information', () => {
      cy.visit('/organizations/Potatoe/collections/veryFakeCollectionName');
      cy.contains('veryFakeCollectionName').click();
      // Should retrieve the organization
      cy.contains('Potatoe');

      // Should retrieve the collection
      cy.contains('veryFakeCollectionName');
      cy.contains('very fake collection topic');

      // Should have no entries
      cy.contains('This collection has no associated entries');

      cy.visit('/organizations/Potatoe/collections/veryFakeCollectionName');
      cy.get('#editCollectionDescription').click();
      cy.wait(2000);
      cy.get('#updateOrganizationDescriptionButton').should('be.visible').should('not.be.disabled');
      typeInInput('description-input', '* fake collection description');
      cy.contains('Preview Mode').click();
      cy.contains('fake collection description');
      cy.contains('* fake collection description').should('not.exist');
      cy.get('#updateOrganizationDescriptionButton').should('be.visible').should('not.be.disabled').click();
      cy.get('#updateOrganizationDescriptionButton').should('not.exist');
      cy.contains('fake collection description');
      cy.contains('* fake collection description').should('not.exist');

      // Should be able to edit the collection topic and see the changes reflected
      cy.get('#editCollection').click();
      cy.wait(2000);
      cy.get('#createOrUpdateCollectionButton').should('be.visible').should('not.be.disabled');
      typeInInput('name-input', 'veryFakeCollectionName');
      typeInInput('display-name-input', 'veryFakeCollectionName');
      typeInInput('topic-input', 'very fake collection topic2');
      cy.get('#createOrUpdateCollectionButton').should('be.visible').should('not.be.disabled').click();
      cy.contains('veryFakeCollectionName');
      cy.contains('very fake collection topic2');

      const toolPath = '/containers/quay.io/garyluu/dockstore-cgpmap/cgpmap-cramOut:3.0.0-rc8?tab=info';
      const organization = 'Potatoe';
      const collection = 'veryFakeCollectionName';
      cy.visit('/containers/quay.io/garyluu/dockstore-cgpmap/cgpmap-cramOut:3.0.0-rc8?tab=info');
      addToCollection(toolPath, organization, collection);

      addToCollection(toolPath, organization, collection, '3.0.0-rc8');

      cy.visit('/organizations/Potatoe/collections/veryFakeCollectionName');
      cy.contains('quay.io/garyluu/dockstore-cgpmap/cgpmap-cramOut:3.0.0-rc8');
      cy.contains('quay.io/garyluu/dockstore-cgpmap/cgpmap-cramOut');

      // test the fix for DOCK-1945
      const url: string = '/organizations/Potatoe/collections/veryFakeCollectionName';
      cy.visit(url);
      cy.url().should('include', url);
      cy.get('#removeEntryButton').click();
      cy.url().should('include', url);
      cy.get('[data-cy=cancel-remove-entry-from-org]').click();
      cy.url().should('include', url);
      cy.get('app-collection-entry-confirm-remove').should('not.exist');
      cy.get('#removeEntryButton').click();
      cy.url().should('include', url);
      cy.get('[data-cy=accept-remove-entry-from-org]').click();
      cy.url().should('include', url);

      cy.visit('/organizations/Potatoe/collections/veryFakeCollectionName');
      cy.contains('quay.io/garyluu/dockstore-cgpmap/cgpmap-cramOut:3.0.0-rc8');
      cy.get('#removeEntryButton').click();
      cy.contains('quay.io/garyluu/dockstore-cgpmap/cgpmap-cramOut');
      cy.get('[data-cy=accept-remove-entry-from-org]').click();
      cy.contains('This collection has no associated entries');
      cy.visit('/organizations/Potatoe');
      cy.contains('Members').should('be.visible');
      approvePotatoOrganization();
      for (const url of ['/organizations', '/organizations/Potatoe', '/organizations/Potatoe/collections/veryFakeCollectionName']) {
        cy.visit(url);
        cy.wait(1000);
        cy.get('img[src*="default-org-logo"]').should('be.visible');
      }
    });
    it('Should be able to add a service to collection', () => {
      const servicePath = '/services/github.com/garyluu/another-test-service';
      addToCollection(servicePath, 'Potatoe', 'veryFakeCollectionName');
      cy.get('[data-cy=collectionLink]').should('contain', 'veryFakeCollectionName');
      cy.visit('/organizations/Potatoe');
      cy.get('[data-cy=collections-services-count-bubble]').should('be.visible');
      cy.visit('/organizations/Potatoe/collections/veryFakeCollectionName');
      cy.contains('github.com/garyluu/another-test-service');
    });
    insertNotebooks();
    it('Should be able to add notebook to collection', () => {
      const notebookPath = '/notebooks/github.com/dockstore-testing/simple-notebook';
      addToCollection(notebookPath, 'Potatoe', 'veryFakeCollectionName');
      cy.get('[data-cy=collectionLink]').should('contain', 'veryFakeCollectionName');
      cy.visit('/organizations/Potatoe');
      cy.get('[data-cy=collections-notebooks-count-bubble]').should('be.visible');
      cy.visit('/organizations/Potatoe/collections/veryFakeCollectionName');
      cy.contains('github.com/dockstore-testing/simple-notebook');
    });

    it('Should be able to remove collection', () => {
      cy.visit('/organizations/Potatoe/collections/veryFakeCollectionName');
      cy.get('[data-cy=removeCollectionButton]').click();
      cy.get('[data-cy=cancel-remove-collection]').click();
      cy.visit('/organizations/Potatoe/collections/veryFakeCollectionName');
      cy.contains('veryFakeCollectionName');
      cy.get('[data-cy=removeCollectionButton]').click();
      cy.get('[data-cy=accept-remove-collection]').click();
      cy.visit('/organizations/Potatoe/collections/veryFakeCollectionName');
      cy.contains('veryFakeCollectionName').should('not.exist');
      cy.visit('/organizations/Potatoe');
      cy.get('[data-cy=collections-services-count-bubble]').should('not.exist');
      cy.visit('/organizations/Potatoe');
      cy.get('[data-cy=collections-notebooks-count-bubble]').should('not.exist');
    });
  });

  describe('Should be able to CRUD user', () => {
    setTokenUserViewPort();
    beforeEach(() => {
      cy.visit('/organizations/Potatoe');
      cy.contains('Members').click();
    });

    it('be able to Read organization user', () => {
      cy.get('mat-progress-bar').should('not.exist');
      cy.get('[data-cy=organization-member-0]').should('be.visible').should('contain', 'user_A').should('contain', 'Admin');
      cy.get('[data-cy=edit-user-role-0]').should('not.exist');
    });

    it('be able to Create organization user', () => {
      createPotatoMembership();
      cy.get('[data-cy=organization-member-1]').should('be.visible').should('contain', 'potato').should('contain', 'Pending Invitation');
      cy.get('[data-cy=edit-user-role-1]').should('exist').should('be.enabled');

      // Need to approve membership and reload for it to be visible
      approvePotatoMembership();
      cy.visit('/organizations/Potatoe');
      cy.contains('Members').click();
      cy.get('[data-cy=organization-member-1]').should('be.visible').should('contain', 'potato').should('contain', 'Member');
    });

    it('be able to edit an approved organization', () => {
      cy.get('[data-cy=edit-org-info-button]').should('be.visible').click();
      cy.get('[data-cy=create-or-update-organization-button]').should('be.visible').should('not.be.disabled').click();
      cy.get('[data-cy=create-or-update-organization-button]').should('not.exist');
    });

    it('be able to Update organization user', () => {
      cy.get('[data-cy=edit-user-role-1]').should('not.be.disabled').click();
      cy.get('[data-cy=upsert-member-dialog-title]').should('contain', 'Edit Member');
      cy.get('mat-select').click();
      cy.get('mat-option').contains('Maintainer').click();
      cy.get('.mat-select-panel').should('not.exist');
      cy.get('[data-cy=upsert-member-button]').should('be.visible').should('not.be.disabled').click();
      cy.get('[data-cy=upsert-member-button]').should('not.exist');
      cy.get('[data-cy=organization-member-1]').should('be.visible').should('contain', 'potato').should('contain', 'Maintainer');
    });

    it('be able to Delete organization user', () => {
      cy.get('[data-cy=remove-user-1]').should('not.be.disabled').click();
      cy.get('[data-cy=confirmation-dialog-title]').should('contain', 'Remove Member from Organization');
      cy.get('[data-cy=confirm-dialog-button]').should('not.be.disabled').click();
      cy.get('app-organization-members').contains('potato').should('not.exist');
    });

    it('Reject organization member invite', () => {
      createPotatoMembership();
      cy.get('[data-cy=organization-member-1]').should('be.visible').should('contain', 'potato').should('contain', 'Pending Invitation');

      // Need to reject membership and reload for it to be visible
      rejectPotatoMembership();
      cy.visit('/organizations/Potatoe');
      cy.contains('Members').click();
      cy.get('app-organization-members').should('contain', 'potato').should('contain', 'Rejected Invitation');
      cy.get('[data-cy=remove-user-1]').should('exist').should('be.enabled');
    });

    it('Resend invitation to organization user who rejected previous invite', () => {
      cy.get('[data-cy=edit-user-role-1]').should('exist').should('be.enabled').click();
      cy.get('[data-cy=upsert-member-dialog-title]').should('contain', 'Resend Invitation');
      cy.get('[data-cy=upsert-member-button]').should('be.visible').should('not.be.disabled').click();
      cy.get('[data-cy=upsert-member-button]').should('not.exist');
      cy.get('app-organization-members').should('contain', 'potato').should('contain', 'Pending Invitation');

      // Reject membership again and reload for it to be visible
      rejectPotatoMembership();
      cy.visit('/organizations/Potatoe');
      cy.contains('Members').click();
      cy.get('app-organization-members').should('contain', 'potato').should('contain', 'Rejected Invitation');
    });

    it('Delete rejected invitation', () => {
      cy.get('[data-cy=remove-user-1]').should('exist').should('be.enabled').click();
      cy.get('[data-cy=confirmation-dialog-title]').should('contain', 'Delete Invitation');
      cy.get('[data-cy=confirm-dialog-button]').should('not.be.disabled').click();
      cy.get('app-organization-members').contains('potato').should('not.exist');
    });
  });

  describe('Verify title tags ', () => {
    it('Specific organization', () => {
      cy.visit('/organizations/Potatoe');
      cy.title().should('eq', 'Dockstore | Organization');
    });

    it('Collection', () => {
      cy.visit('/organizations/Potatoe/collections/veryFakeCollectionName');
      cy.title().should('eq', 'Dockstore | Collection');
    });
  });

  describe('Find organization and collection by alias', () => {
    it('organization alias', () => {
      cy.intercept('GET', '*/organizations/fakeAlias/aliases', {
        body: { name: 'Potatoe' },
        statusCode: 200,
      });
      cy.visit('/aliases/organizations/fakeAlias');
      cy.url().should('eq', Cypress.config().baseUrl + '/organizations/Potatoe');
    });

    it('collection alias', () => {
      cy.intercept('GET', '*/organizations/collections/fakeAlias/aliases', {
        body: { organizationName: 'Potatoe', name: 'veryFakeCollectionName' },
        statusCode: 200,
      });
      cy.visit('/aliases/collections/fakeAlias');
      cy.url().should('eq', Cypress.config().baseUrl + '/organizations/Potatoe/collections/veryFakeCollectionName');
    });

    it('invalid alias type', () => {
      cy.visit('/aliases/foobar/fakeAlias');
      cy.url().should('eq', Cypress.config().baseUrl + '/aliases/foobar/fakeAlias');
      cy.contains('foobar is not a valid type');
    });

    it('organization alias incorrect', () => {
      cy.intercept('GET', '*/organizations/incorrectAlias/aliases', {
        body: {},
        statusCode: 404,
      });
      cy.visit('/aliases/organizations/incorrectAlias');
      cy.url().should('eq', Cypress.config().baseUrl + '/aliases/organizations/incorrectAlias');
      cy.contains('No organizations with the alias incorrectAlias found');
    });

    it('collection alias incorrect', () => {
      cy.intercept('GET', '*/organizations/collections/incorrectAlias/aliases', {
        body: {},
        statusCode: 404,
      });
      cy.visit('/aliases/collections/incorrectAlias');
      cy.url().should('eq', Cypress.config().baseUrl + '/aliases/collections/incorrectAlias');
      cy.contains('No collections with the alias incorrectAlias found');
    });
  });

  describe('Sort organizations', () => {
    it('Sort by name', () => {
      cy.visit('/organizations');
      createOrganization('Apple', 'Apple', 'Keeps the doctor away', 'OICR', 'https://www.google.com', 'abcd@abcd.com');
      invokeSql("update organization set status='APPROVED' where name like 'Apple'");
      cy.visit('/organizations');
      createOrganization('grapes', 'grapes', 'Walked up to the lemonade stand', 'Toronto', 'https://www.google.com', '123@123.com');
      invokeSql("update organization set status='APPROVED' where name like 'grapes'");
      cy.visit('/organizations');
      cy.contains('Potatoe');
      cy.contains('Apple');
      cy.contains('grapes');
      cy.get('mat-select[formControlName=sort]').click();
      cy.get('mat-option').contains('Name').click();
      cy.get('mat-card').eq(0).contains('Apple');
      cy.get('mat-card').eq(1).contains('grapes');
      cy.get('mat-card').eq(2).contains('Potatoe');
    });
  });
});
