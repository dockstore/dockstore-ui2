/*
 *    Copyright 2023 OICR, UCSC
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

describe('Notebooks Page', () => {
  resetDB();
  setTokenUserViewPort();
  it('should contain header and search', () => {
    cy.visit('/notebooks');
    cy.url().should('contain', 'notebooks');
    cy.get('[data-cy=header]').contains('h3', 'Notebooks');
    cy.contains('Search notebooks');
  });

  it('should star notebook', () => {
    cy.visit('/starred?tab=notebooks');
    cy.get('[data-cy=no-notebooks-banner]').should('contain', 'You have no starred notebooks.');
    cy.fixture('sampleNotebook.json').then((json) => {
      cy.intercept('GET', '*/users/starredNotebooks', {
        body: json,
        statusCode: 200,
      });
    });
    cy.visit('/starred?tab=notebooks');
    cy.get('[data-cy=starred-notebooks-count]').should('contain', '1');
  });
});
