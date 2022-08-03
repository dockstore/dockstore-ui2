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
import { contains } from 'cypress/types/jquery';
import { Repository } from '../../../src/app/shared/openapi/model/repository';
import { goToTab, isActiveTab, resetDB, setTokenUserViewPort } from '../../support/commands';

describe('Dockstore dashboard', () => {
  resetDB();
  setTokenUserViewPort();

  const cwlDescriptorType = 'CWL';
  const wdlDescriptorType = 'WDL';
  const nextflowDescriptorType = 'Nextflow';
  //   it('can open register modals from the homepage', () => {
  //     cy.visit('/dashboard?newDashboard');
  //     cy.get('#registerWorkflowButton').contains('Register a Workflow').should('be.visible').click();
  //     cy.contains('Register Workflow');
  //     cy.contains('Create workflows on Dockstore.org');
  //     cy.get('[data-cy=close-modal-btn]').should('have.text', 'Close').click();
  //     cy.contains('Tools');
  //     cy.get('#registerToolButton').contains('Register a Tool').should('be.visible').click();
  //     cy.contains('Register Tool');
  //     cy.contains('Close').click();
  //   });

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
    cy.get('[data-cy=help-link').should('have.attr', 'href').and('include', 'getting-started-with-services');
  });
});
