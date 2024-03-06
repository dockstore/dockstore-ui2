/*
 * Copyright 2022 OICR and UCSC
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
import { setTokenUserViewPort } from '../../support/commands';

describe('Dockstore not found page', () => {
  setTokenUserViewPort();

  it('have 404 page work', () => {
    cy.visit('/bewareoftheleopard');
    cy.contains("Don't panic.");
    cy.contains('Page Not Found');
    cy.url().should('eq', Cypress.config().baseUrl + '/bewareoftheleopard');

    cy.visit('/workflows/asdf');
    cy.contains('Page Not Found');
    cy.url().should('eq', Cypress.config().baseUrl + '/workflows/asdf');

    cy.visit('/organizations/abcdefg');
    cy.url().should('eq', Cypress.config().baseUrl + '/organizations/abcdefg');

    cy.visit('/users/notarealuser');
    cy.contains('Page Not Found');
    cy.url().should('eq', Cypress.config().baseUrl + '/users/notarealuser');

    cy.visit('/notebooks/github.con/entrywithtypo');
    cy.contains('Page Not Found');
    cy.url().should('eq', Cypress.config().baseUrl + '/notebooks/github.con/entrywithtypo');

    cy.visit('/services/github.com/invalidentrypath');
    cy.contains('Page Not Found');
    cy.url().should('eq', Cypress.config().baseUrl + '/services/github.com/invalidentrypath');

    cy.visit('/apptools/ghjkl');
    cy.contains('Page Not Found');
    cy.url().should('eq', Cypress.config().baseUrl + '/apptools/ghjkl');

    cy.visit('/containers/thistooldoesnotexist');
    cy.contains('Page Not Found');
    cy.url().should('eq', Cypress.config().baseUrl + '/containers/thistooldoesnotexist');

    cy.visit('/tools/lmnop');
    cy.contains('Page Not Found');
    cy.url().should('eq', Cypress.config().baseUrl + '/tools/lmnop');
  });
});
