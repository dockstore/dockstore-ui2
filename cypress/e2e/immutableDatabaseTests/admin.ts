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
import { goToTab, setTokenUserViewPort } from '../../support/commands';
describe('Admin UI', () => {
  setTokenUserViewPort();
  beforeEach(() => {
    cy.visit('');

    // Select dropdown
    cy.get('[data-cy=dropdown-main]:visible').click();
  });

  describe('Profile', () => {
    it('Admin status indicated on profile page', () => {
      cy.get('#dropdown-accounts').click();
      cy.get('[data-cy=account-is-admin]').should('exist');
    });
  });
  describe('Userpage', () => {
    it('Admin can view other linked accounts of a user', () => {
      cy.visit('/users/user_A');
      goToTab('Other Linked Accounts');
      cy.get('[data-cy=other-linked-accounts-Quay]').should('be.visible');
      cy.get('[data-cy=Quay-username]').contains('user_A').should('be.visible');

      //log out and confirm the tab does not exist
      cy.get('[data-cy=dropdown-main]:visible').click();
      cy.get('[data-cy=dropdown-logout-button]').click();
      cy.visit('/users/user_A');
      cy.get('.mat-tab-label').contains('Other Linked Accounts').should('not.exist');
    });
  });
});
