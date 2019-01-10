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
import { setTokenUserViewPort } from '../../support/commands';

describe('Dropdown test', () => {
  // TODO: GitLab tests are commented out
  setTokenUserViewPort();

  beforeEach(() => {
    cy
      .server()
      .route({
        method: 'GET',
        url: /extended/,
        response: { 'canChangeUsername': true }
      });
    cy.visit('');

    // Select dropdown
    cy
      .get('#dropdown-main')
      .click();
  });

  describe('Go to starred page', () => {
    beforeEach(() => {
      // Select dropdown tokens
      cy
        .get('#dropdown-starred')
        .click();
    });

    it('Should have nothing starred', () => {
      cy
        .get('#starCountButton')
        .should('not.be.visible');
      cy
        .get('#starringButton')
        .should('not.be.visible');
    });
  });

  describe('Go to accounts page', () => {
    beforeEach(() => {
      // Select dropdown accounts
      cy
        .get('#dropdown-accounts')
        .click();
    });

    it('Should show all accounts as linked (except GitLab and Bitbucket)', () => {
      everythingOk();
    });
  });
  describe('Go to enabled Dockstore Account Controls', () => {
    beforeEach(() => {
      // Select dropdown accounts
      cy
        .server()
        .route({
          method: 'DELETE',
          url: '/users/user',
          response: 'true'
        });
      cy
        .get('#dropdown-accounts')
        .click();
      cy.contains('Dockstore Account Controls').click();
    });
    it('Should have the delete button enabled', () => {
      cy.contains('Delete Dockstore Account').should('not.be.disabled').click();
      cy.contains('Yes, delete my account').should('be.disabled');
      cy.get('#deleteUserUsernameInput').type('potato');
      cy.contains('Yes, delete my account').should('be.disabled');
      cy.get('#deleteUserUsernameInput').clear().type('user_A');
      cy.contains('Yes, delete my account').should('not.be.disabled').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/login');
    });
    it('Should have the change username button enabled', () => {
      cy.contains('Update Username').should('not.be.disabled');
    });
  });
  const everythingOk = () => {
    cy.get('#unlink-GitHub').should('be.visible');
    cy.get('#unlink-Quay').should('be.visible');
    cy.get('#link-Bitbucket').should('be.visible');
    cy.get('#link-GitLab').should('be.visible');
  };

  const goToAccountsOnboarding = () => {
    cy
      .contains('Link External Accounts')
      .click();
  };
  describe('Go to setup page', () => {
    beforeEach(() => {

      // Select dropdown setup
      cy
        .get('#dropdown-onboarding')
        .click();
    });

    it('Should let you change your username if possible', () => {

      cy
        .get('#updateUsername')
        .should('not.be.disabled');
      cy
        .get('#username')
        .type('-');
      cy
        .get('#updateUsername')
        .should('be.disabled');
      cy
        .get('#username')
        .type('a');
      cy
        .get('#updateUsername')
        .should('not.be.disabled');
      cy
        .get('#username')
        .type('@');
      cy
        .get('#updateUsername')
        .should('be.disabled');
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
      cy.visit('/auth/bitbucket.org?code=somefakeid', { 'failOnStatusCode': false }).then((resp) => {
        expect(resp.status).to.eq('');
      });
      goToAccountsOnboarding();
      everythingOk();
      goToAccountsOnboarding();
      cy.visit('/auth/potato.com?code=somefakeid', { 'failOnStatusCode': false }).then((resp) => {
        expect(resp.status).to.eq('');
      });
      goToAccountsOnboarding();
      everythingOk();
      goToAccountsOnboarding();
      cy.visit('/auth/github.com?code=somefakeid', { 'failOnStatusCode': false }).then((resp) => {
        expect(resp.status).to.eq('');
      });
      goToAccountsOnboarding();
      everythingOk();
      goToAccountsOnboarding();
      cy.visit('/auth/quay.io?code=somefakeid', { 'failOnStatusCode': false }).then((resp) => {
        expect(resp.status).to.eq('');
      });
      goToAccountsOnboarding();
      everythingOk();
    });
    // TODO: this part of the wizard has been reworked
    // it('Go through steps', () => {
    //     // Should start on step 1
    //     cy
    //         .get('h3').contains('Step 1')
    //         .should('be.visible')
    //     cy
    //         .get('h3').contains('Step 2')
    //         .should('not.be.visible')
    //     cy
    //         .get('h3').contains('Step 3')
    //         .should('not.be.visible')
    //     cy
    //         .get('#next_step')
    //         .click()
    //
    //     // Should now be on step 2
    //     cy
    //         .get('h3').contains('Step 1')
    //         .should('not.be.visible')
    //     cy
    //         .get('h3').contains('Step 2')
    //         .should('be.visible')
    //     cy
    //         .get('h3').contains('Step 3')
    //         .should('not.be.visible')
    //     cy
    //         .get('#next_step')
    //         .click()
    //
    //     // Should now be on step 3
    //     cy
    //         .get('h3').contains('Step 1')
    //         .should('not.be.visible')
    //     cy
    //         .get('h3').contains('Step 2')
    //         .should('not.be.visible')
    //     cy
    //         .get('h3').contains('Step 3')
    //         .should('be.visible')
    //     cy
    //         .get('#finish_step')
    //         .click()
    // });
  });
});
