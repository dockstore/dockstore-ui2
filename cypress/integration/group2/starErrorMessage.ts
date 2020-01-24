/*
 *     Copyright 2018 OICR
 *
 *     Licensed under the Apache License, Version 2.0 (the "License")
 *     you may not use this file except in compliance with the License
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */
import { resetDB, setTokenUserViewPort } from '../../support/commands';

describe('Tool and workflow starring error messages', () => {
  resetDB();
  setTokenUserViewPort();

  function starringError(url: string, type: string, routePath: string, name: string) {
    cy.visit(url);
    cy.server();
    cy.route({
      url: routePath,
      method: 'PUT',
      status: 400,
      response: 'You cannot star the ' + type + ' ' + name + ' because you have not unstarred it.'
    });

    cy.get('#starringButtonIcon').click();

    cy.get('.alert').should('exist');

    cy.get('.error-output')
      .contains('You cannot star the ' + type + ' ' + name + ' because you have not unstarred it.')
      .should('exist');
  }

  function unstarringError(url: string, type: string, routePath: string, name: string) {
    cy.visit(url);

    cy.get('#starringButtonIcon').click();

    cy.server();
    cy.route({
      url: routePath,
      method: 'PUT',
      status: 400,
      response: 'You cannot unstar the ' + type + ' ' + name + ' because you have not starred it.'
    });

    cy.get('#unstarringButtonIcon').click();

    cy.get('.alert').should('exist');

    cy.get('.error-output')
      .contains('You cannot unstar the ' + type + ' ' + name + ' because you have not starred it.')
      .should('exist');
  }

  function starringServerError(url: string, routePath: string) {
    cy.visit(url);
    cy.server();

    cy.route({
      url: routePath,
      method: 'PUT',
      status: 500,
      response: {}
    });

    cy.get('#starringButtonIcon').click();

    cy.get('.alert').should('exist');

    cy.get('.error-output')
      .contains('[HTTP 500] Internal Server Error:')
      .should('exist');
  }

  describe('Workflow starring error message', () => {
    it('Workflow server error message', () => {
      starringServerError('/workflows/github.com/A/l', '*/workflows/11/star');
    });

    it('Workflow cannot be starred if not already unstarred.', () => {
      starringError('/workflows/github.com/A/l', 'workflow', '*/workflows/11/star', 'github.com/A/l');
    });

    it('Workflow cannot be unstarred if not already starred.', () => {
      unstarringError('/workflows/github.com/A/l', 'workflow', '*/workflows/11/star', 'github.com/A/l');
    });
  });

  describe('Tool starring error message', () => {
    it('Tool server error message', () => {
      starringServerError('/containers/quay.io/A2/a:latest?tab=info', '*/containers/5/star');
    });
    it('Tool cannot be starred if not already unstarred.', () => {
      starringError('/containers/quay.io/A2/a:latest?tab=info', 'tool', '*/containers/5/star', 'quay.io/A2/a');
    });

    it('Tool cannot be unstarred if not already starred.', () => {
      unstarringError('/containers/quay.io/A2/a:latest?tab=info', 'tool', '*/containers/5/star', 'quay.io/A2/a');
    });
  });
});
