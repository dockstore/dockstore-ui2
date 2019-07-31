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
import { setTokenUserViewPort } from '../../support/commands';

describe('elasticsearch from logged-out homepage', () => {
  it('Should be able to search entries for using text', () => {
    cy.visit('/');
    cy.get('#searchBar')
      .should('have.attr', 'placeholder', 'Search...')
      .type('asdf{enter}');
    cy.url().should('eq', Cypress.config().baseUrl + '/search?search=asdf');
  });
});

describe('elasticsearch from logged-in homepage', () => {
  setTokenUserViewPort();
  // Use this test when beta mode turned off
    // it('Should be able to search entries for using text', () => {
    //   cy.visit('/');
    //   cy.get('[data-cy=loggedInSearchBar]')
    //     .should('have.attr', 'placeholder', 'Search...')
    //     .type('asdf{enter}');
    //   cy.url().should('eq', Cypress.config().baseUrl + '/search?search=asdf');
    // });
    it('Should be able to search entries for using text', () => {
      cy.visit('/');
      cy.get('#searchBar')
        .should('have.attr', 'placeholder', 'Enter Keyword...')
        .type('asdf{enter}');
      cy.url().should('eq', Cypress.config().baseUrl + '/search?search=asdf');
    });
});
