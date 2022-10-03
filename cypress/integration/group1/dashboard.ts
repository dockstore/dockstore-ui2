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
import { resetDB, setTokenUserViewPort } from '../../support/commands';

describe('Dockstore dashboard', () => {
  resetDB();
  setTokenUserViewPort();

  it('have workflows visible from homepage', () => {
    cy.visit('/dashboard?newDashboard');
    cy.contains('Workflows');
    cy.contains('hosted-workflow');
    cy.get('[data-cy=all-entries-btn]').contains('All Workflows').should('have.attr', 'href').and('include', '/my-workflows');
  });

  it('have tools visible from homepage', () => {
    cy.visit('/dashboard?newDashboard');
    cy.contains('Tools');
    cy.contains('b1');
    cy.get('[data-cy=all-entries-btn]').contains('All Tools').should('have.attr', 'href').and('include', '/my-tools');
  });

  it('no services display correctly', () => {
    cy.visit('/dashboard?newDashboard');
    cy.contains('Services');
    cy.contains('You have not registered any services.');
    cy.get('[data-cy=no-entry-register-modal]').contains('service');
    cy.get('[data-cy=help-link')
      .contains('Learn more about services')
      .should('have.attr', 'href')
      .and('include', 'getting-started-with-services');
  });
  it('Registering new tool through Github redirects correctly', () => {
    cy.visit('/dashboard?newDashboard');
    cy.contains('Tools');
    cy.get('#registerToolButton').should('be.visible').click();
    cy.get('#3-register-workflow-option').should('be.visible').click();
    cy.contains('button', 'Next').should('be.visible').click();
    cy.contains('a', 'Manage Dockstore installations on GitHub')
      .should('have.attr', 'href')
      .and('include', 'https://github.com/apps/dockstore-testing-application');
  });
  it('Registering new workflow through Github redirects correctly', () => {
    cy.visit('/dashboard?newDashboard');
    cy.contains('Workflows');
    cy.get('#registerWorkflowButton').should('be.visible').click();
    cy.get('#0-register-workflow-option').should('be.visible').click();
    cy.contains('button', 'Next').should('be.visible').click();
    cy.contains('a', 'Manage Dockstore installations on GitHub')
      .should('have.attr', 'href')
      .and('include', 'https://github.com/apps/dockstore-testing-application');
  });
});
