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
import { resetDB, setTokenUserViewPort } from '../../support/commands';

describe('Test revoke token button opens confirmation dialog successfully and log out user', () => {
  resetDB();
  setTokenUserViewPort();

  it('Revoke token button should open confirmation dialog', () => {
    cy.visit('/accounts?tab=accounts');
    cy.get('[data-cy=revoke-token-button]').should('be.visible').click();
    cy.get('[data-cy=confirm-revoke-token-button]').should('be.disabled');
  });
  it('Confirm button should log out user', () => {
    cy.get('[data-cy=revoke-token-username-input]').should('be.visible').clear().type('user_A');
    cy.get('[data-cy=confirm-revoke-token-button]').should('not.be.disabled').click();
    cy.get('[data-cy=header]').should('contain', 'Logged Out');
  });
});
