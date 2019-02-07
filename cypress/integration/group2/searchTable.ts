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
import { resetDB, setTokenUserViewPort } from '../../support/commands';

describe('Dockstore tool/workflow search table', () => {
  resetDB();
  setTokenUserViewPort();
  it('Tool Star Count', () => {
    cy.visit('/search');
    cy.get(':nth-child(2) > .description-cell')
      .should('be.visible');
    cy.visit('/containers/quay.io/garyluu/dockstore-cgpmap/cgpmap-cramOut:3.0.0-rc8');
    cy.get('#starringButton')
      .click();
    cy.visit('/search');
    cy.get(':nth-child(2) > .description-cell')
      .contains('1 star_border');
  });

  it('Workflow Star Count', () => {
    cy.visit('/search');
    cy.get(':nth-child(2) > .description-cell')
      .should('be.visible');
    cy.visit('/workflows/github.com/A/l');
    cy.get('#starringButton')
      .click();
    cy.visit('/search');
    cy.get('#workflowTab-link')
      .click();
    cy.get(':nth-child(2) > .description-cell')
      .contains('1 star_border');
  });
});
