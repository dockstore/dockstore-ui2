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
import {
  goToAccountPreferencesTab,
  goToRequestsTab,
  isActiveTab,
  setTokenUserViewPort,
  setTokenUserViewPortCurator,
  typeInInput,
} from '../../support/commands';

describe('Dropdown test', () => {
  // TODO: GitLab tests are commented out
  setTokenUserViewPortCurator();

  beforeEach(() => {
    cy.intercept('GET', /extended/, {
      body: { canChangeUsername: true },
    });

    cy.visit('');

    // Select dropdown
    cy.get('[data-cy=dropdown-main]:visible').click();
  });

  describe('Go to starred page', () => {
    beforeEach(() => {
      // Select dropdown tokens
      cy.visit('/starred');
    });

    it('Should have nothing starred', () => {
      cy.get('#starCountButton').should('not.exist');
      cy.get('#starringButton').should('not.exist');
    });

    it('cy.should - assert that <title> is correct', () => {
      cy.title().should('include', 'Dockstore');
    });
  });

  describe('Go to profile page', () => {
    beforeEach(() => {
      // Select dropdown profile
      cy.get('[data-cy=dropdown-profile-button]').should('be.visible').click();
    });

    it('Should show user profile', () => {
      cy.url().should('eq', Cypress.config().baseUrl + '/users/user_curator');
      cy.contains('Activity');
    });
  });

  describe('Go to profile page from another profile page', () => {
    it('Should show user correct profile', () => {
      const fromUser = 'potato';
      const currentUser = 'user_curator';
      cy.visit(`/users/${fromUser}`);
      cy.contains('Activity');
      cy.get('app-user-page').contains(fromUser);
      cy.get('app-user-page').contains(currentUser).should('not.exist');
      cy.get('[data-cy=dropdown-main]:visible').click();
      cy.get('[data-cy=dropdown-profile-button]').should('be.visible').click();
      cy.contains('Activity');
      cy.get('app-user-page').contains(currentUser);
      cy.get('app-user-page').contains(fromUser).should('not.exist');
    });
  });

  describe('Go to accounts page', () => {
    beforeEach(() => {
      // Select dropdown accounts
      cy.get('#dropdown-accounts').click();
    });

    it('Should show all accounts as linked (except GitLab and Bitbucket)', () => {
      everythingOk();
    });
    setTokenUserViewPort();
    // Check that changing the tab changes the url
    it('should default to accounts tab', () => {
      cy.visit('/accounts');
      cy.url().should('eq', Cypress.config().baseUrl + '/accounts?tab=accounts');
    });
    it('should default to accounts tab when tab name misspelled', () => {
      cy.visit('/accounts?tab=abcd');
      cy.url().should('eq', Cypress.config().baseUrl + '/accounts?tab=accounts');
    });
    it('Change tab to Dockstore Account & Preferences', () => {
      goToAccountPreferencesTab();
      cy.url().should('eq', Cypress.config().baseUrl + '/accounts?tab=dockstore%20account%20and%20preferences');
    });
    it('Change tab to requests', () => {
      goToRequestsTab();
      cy.url().should('eq', Cypress.config().baseUrl + '/accounts?tab=requests');
    });
    // Check that changing the url changes the tab
    it('Link to accounts tab', () => {
      cy.visit('/accounts?tab=accounts');
      isActiveTab('Accounts');
    });
    it('Link to Dockstore Account & Preferences tab', () => {
      cy.visit('/accounts?tab=dockstore%20account%20and%20preferences');
      isActiveTab('Dockstore Account & Preferences');
    });
    it('Link to requests tab', () => {
      cy.visit('/accounts?tab=requests');
      isActiveTab('Requests');
    });
    // Check that link to user profile exists
    it('Should have the view profile button', () => {
      cy.contains('View Public Profile').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/users/user_curator');
      cy.contains('Activity');
    });
  });

  describe('Go to requests page', () => {
    beforeEach(() => {
      // Pending orgs starts with two
      const pendingOrganizations = [
        { id: 1000, name: 'OrgOne', status: 'PENDING' },
        { id: 1001, name: 'OrgTwo', status: 'PENDING' },
      ];

      cy.intercept('GET', '*/organizations/all?type=pending', {
        body: pendingOrganizations,
      });

      // Logged in user has two memberships, one is not accepted
      const memberships = [
        {
          id: 1,
          role: 'MAINTAINER',
          status: 'PENDING',
          organization: { id: 1000, status: 'PENDING', name: 'orgOne', displayName: 'orgOne' },
        },
        {
          id: 2,
          role: 'MAINTAINER',
          status: 'ACCEPTED',
          organization: { id: 1001, status: 'PENDING', name: 'orgTwo', displayName: 'orgTwo' },
        },
        {
          id: 3,
          role: 'MAINTAINER',
          status: 'ACCEPTED',
          organization: { id: 1002, status: 'REJECTED', name: 'orgThree', displayName: 'orgThree' },
        },
      ];
      cy.intercept('GET', '*/users/user/memberships', {
        body: memberships,
      });
      // Choose dropdown
      cy.get('#dropdown-accounts').click();
      goToRequestsTab();
    });

    it('Should have one rejected org', () => {
      // Mock request re-review
      cy.intercept('POST', '*/organizations/1002/request', {
        body: { id: 1002, name: 'OrgThree', status: 'PENDING' },
      });

      // Mock new pending orgs
      const pendingOrganizations = [
        { id: 1000, name: 'OrgOne', status: 'PENDING' },
        { id: 1001, name: 'OrgTwo', status: 'PENDING' },
        { id: 1002, name: 'OrgThree', status: 'PENDING' },
      ];

      cy.intercept('GET', '*/organizations/all?type=pending', {
        body: pendingOrganizations,
      });

      // Mock new my pending orgs
      const memberships = [
        { id: 1, role: 'MAINTAINER', status: 'PENDING', organization: { id: 1000, status: 'PENDING', name: 'orgOne' } },
        { id: 2, role: 'MAINTAINER', status: 'ACCEPTED', organization: { id: 1001, status: 'PENDING', name: 'orgTwo' } },
        { id: 3, role: 'MAINTAINER', status: 'ACCEPTED', organization: { id: 1002, status: 'PENDING', name: 'orgThree' } },
      ];
      cy.intercept('GET', '*/users/user/memberships', {
        body: memberships,
      });

      // Ensure that there is one org
      cy.get('#my-rejected-org-card-0').should('be.visible');
      cy.get('#my-rejected-org-card-1').should('not.exist');

      // Request re-review
      cy.get('#request-re-review-0').should('be.visible').click();
      cy.get('#my-rejected-org-card-0').should('not.exist');

      // Should now have org in pending (3 Total)
      cy.get('#pending-org-card-0').should('be.visible');
      cy.get('#pending-org-card-1').should('be.visible');
      cy.get('#pending-org-card-2').should('be.visible');

      // Should now have org in my pending (2 Total)
      cy.get('#my-pending-org-card-0').should('be.visible');
      cy.get('#my-pending-org-card-1').should('be.visible');
    });

    it('Should have two pending orgs', () => {
      // Endpoint should return only one pending organization after approval
      const pendingOrganizations = [{ id: 1001, name: 'OrgTwo', status: 'PENDING' }];
      cy.intercept('GET', '*/organizations/all?type=pending', {
        body: pendingOrganizations,
      });

      // Stub approve response
      cy.intercept('POST', '*/organizations/1000/approve', {
        body: [],
      });

      // Ensure that there are two orgs
      cy.get('#pending-org-card-0').should('be.visible');
      cy.get('#pending-org-card-1').should('be.visible');

      // Accept first org
      cy.get('#reject-pending-org-0').should('be.visible');
      cy.get('#approve-pending-org-0').should('be.visible').click();
      cy.get('#approve-pending-org-dialog').should('be.visible').click();

      // Ensure that only one org exists now
      cy.get('#pending-org-card-0').should('be.visible');
      cy.get('#pending-org-card-1').should('not.exist');
    });

    it('Should have a pending invite', () => {
      // Stub the accept invite response
      cy.intercept('POST', '*/organizations/1000/invitation?accept=true', {
        body: [],
      });

      // Membership should have two accepted entries
      const memberships = [
        { id: 1, role: 'MAINTAINER', status: 'ACCEPTED', organization: { id: 1000, status: 'PENDING', name: 'orgOne' } },
        { id: 2, role: 'MAINTAINER', status: 'ACCEPTED', organization: { id: 1001, status: 'PENDING', name: 'orgTwo' } },
      ];
      cy.intercept('GET', '*/users/user/memberships', {
        body: memberships,
      });

      // One invite should be visible
      cy.get('#my-org-invites-card-0').should('be.visible');

      // Accept org invite
      cy.get('#reject-invite-org-0').should('be.visible');
      cy.get('#accept-invite-org-0').should('be.visible').click();
      cy.get('#accept-pending-org-dialog').should('be.visible').click();

      // Should have two orgs in pending list
      cy.get('#my-pending-org-card-0').should('be.visible');
      cy.get('#my-pending-org-card-1').should('be.visible');
    });

    it('Should have a pending org request', () => {
      // One pending org request should be visible
      cy.get('#my-pending-org-card-0').should('be.visible');
    });

    it('Should be able to delete pending/reject org request', () => {
      // Both pending and rejected orgs should be visible
      cy.get('#my-pending-org-card-0').should('be.visible');
      cy.get('#my-rejected-org-card-0').should('be.visible');

      // JSON object for the membership that is not affiliated with the user
      const nonAffiliatedMembership = {
        id: 1,
        role: 'MAINTAINER',
        status: 'PENDING',
        organization: { id: 1000, status: 'PENDING', name: 'orgOne', displayName: 'orgOne' },
      };

      // New mocked memberships after deleting the rejected organization
      const membershipsAfterFirstDeletion = [
        nonAffiliatedMembership,
        {
          id: 2,
          role: 'MAINTAINER',
          status: 'ACCEPTED',
          organization: { id: 1001, status: 'PENDING', name: 'orgTwo', displayName: 'orgTwo' },
        },
      ];

      // Route all DELETE API calls to organizations respond with with an empty JSON object
      cy.intercept('DELETE', '*/organizations/*', {
        body: [],
      }).as('delete');

      // Route GET API call to user/membership with the mocked membership JSON object after first deletion
      cy.intercept('GET', '*/users/user/memberships', {
        body: membershipsAfterFirstDeletion,
      });

      // Delete the rejected organization
      // Should result with the rejected organization no longer existing, and only the pending and non-affiliated org existing
      cy.get('#delete-my-rejected-org-0').should('be.visible').click();
      cy.contains('div', 'Delete Organization').within(() => {
        cy.contains('button', 'Delete').click();
      });
      cy.wait('@delete');
      cy.get('#my-pending-org-card-0').should('be.visible');
      cy.get('#my-rejected-org-card-0').should('not.exist');

      // Route GET API call to user/memberships to respond with the membership JSON object that the user is not affiliated with
      cy.intercept('GET', '*/users/user/memberships', {
        body: [nonAffiliatedMembership],
      });

      // Route all GET requests to organizations/all?type=pending to the non affiliated organization
      cy.intercept('GET', '*/organizations/all?type=pending', {
        body: [nonAffiliatedMembership],
      });

      // Delete the pending organization
      // Should result with the organization no longer existing and the request page empty of rejected/pending orgs
      cy.get('#delete-my-pending-org-0').should('be.visible').click();
      cy.contains('div', 'Delete Organization').within(() => {
        cy.contains('button', 'Delete').click();
      });
      cy.get('#my-pending-org-card-0').should('not.exist');
      cy.get('#my-rejected-org-card-0').should('not.exist');
    });
  });

  describe('Go to enabled Dockstore Account & Preferences', () => {
    beforeEach(() => {
      // Select dropdown accounts
      cy.intercept('DELETE', '*/users/user', {
        body: 'true',
      });
      cy.get('[data-cy=dropdown-account-button]').should('be.visible').click();
      goToAccountPreferencesTab();
    });
    it('Should have the danger alert', () => {
      cy.get('.alert-danger').should('be.visible');
    });
    it('Should have the delete button enabled', () => {
      cy.contains('Delete Dockstore Account').should('not.be.disabled').click();
      cy.get('[data-cy=confirm-delete-button]').should('be.disabled');
      typeInInput('delete-username-input', 'potato');
      cy.get('[data-cy=confirm-delete-button]').should('be.disabled');
      typeInInput('delete-username-input', 'user_curator');
      cy.get('[data-cy=confirm-delete-button]').should('not.be.disabled').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/logout');
    });
    it('Should have the change username button disabled for current username', () => {
      cy.contains('Edit Dockstore Username').click();
      cy.contains('Save').should('be.disabled');
    });
  });
  const everythingOk = () => {
    cy.get('#unlink-GitHub').should('be.visible');
    cy.get('#unlink-Quay').should('be.visible');
    cy.get('#link-Bitbucket').should('be.visible');
    cy.get('#link-GitLab').should('be.visible');
  };

  const goToAccountsOnboarding = () => {
    cy.visit('/accounts');
  };
  describe('Go to setup page', () => {
    beforeEach(() => {
      cy.visit('/onboarding');
    });

    it('Should let you change your username if possible', () => {
      cy.get('#updateUsername').should('not.be.disabled');
      cy.get('#username').type('-');
      cy.get('#updateUsername').should('be.disabled');
      cy.get('#username').type('a');
      cy.get('#updateUsername').should('not.be.disabled');
      cy.get('#username').type('@');
      cy.get('#updateUsername').should('be.disabled');
    });

    it('Should show all accounts as linked (except GitLab and Bitbucket)', () => {
      // everythingOk();
      // goToAccountsOnboarding();
      // cy.visit( '/auth/gitlab.com?code=somefakeid', {'failOnStatusCode': false}).then((resp) => {
      //     expect(resp.status).to.eq('')
      // })
      // goToAccountsOnboarding();
      // TODO: Gitlab is being very slow, hopefully one day we can remove this
      // cy.wait(10000);

      goToAccountsOnboarding();
      everythingOk();
      goToAccountsOnboarding();
      cy.visit('/auth/bitbucket.org?code=somefakeid', { failOnStatusCode: false }).then((resp) => {
        expect(resp.status).to.eq('');
      });
      goToAccountsOnboarding();
      everythingOk();
      goToAccountsOnboarding();
      cy.visit('/auth/potato.com?code=somefakeid', { failOnStatusCode: false }).then((resp) => {
        expect(resp.status).to.eq('');
      });
      goToAccountsOnboarding();
      everythingOk();
      goToAccountsOnboarding();
      cy.visit('/auth/github.com?code=somefakeid', { failOnStatusCode: false }).then((resp) => {
        expect(resp.status).to.eq('');
      });
      goToAccountsOnboarding();
      everythingOk();
      goToAccountsOnboarding();
      cy.visit('/auth/quay.io?code=somefakeid', { failOnStatusCode: false }).then((resp) => {
        expect(resp.status).to.eq('');
      });
      goToAccountsOnboarding();
      everythingOk();
      cy.get('[data-cy=dropdown-main]:visible').click();
      cy.get('[data-cy=dropdown-logout-button]').should('be.visible').click();
      cy.get('[data-cy=header]').should('contain', 'Logged Out');
    });
    // TODO: this part of the wizard has been reworked
    // it('Go through steps', () => {
    //     // Should start on step 1
    //     cy
    //         .get('h3').contains('Step 1')
    //         .should('be.visible')
    //     cy
    //         .get('h3').contains('Step 2')
    //         .should('not.exist')
    //     cy
    //         .get('h3').contains('Step 3')
    //         .should('not.exist')
    //     cy
    //         .get('#next_step')
    //         .click()
    //
    //     // Should now be on step 2
    //     cy
    //         .get('h3').contains('Step 1')
    //         .should('not.exist')
    //     cy
    //         .get('h3').contains('Step 2')
    //         .should('be.visible')
    //     cy
    //         .get('h3').contains('Step 3')
    //         .should('not.exist')
    //     cy
    //         .get('#next_step')
    //         .click()
    //
    //     // Should now be on step 3
    //     cy
    //         .get('h3').contains('Step 1')
    //         .should('not.exist')
    //     cy
    //         .get('h3').contains('Step 2')
    //         .should('not.exist')
    //     cy
    //         .get('h3').contains('Step 3')
    //         .should('be.visible')
    //     cy
    //         .get('#finish_step')
    //         .click()
    // });
  });
});
