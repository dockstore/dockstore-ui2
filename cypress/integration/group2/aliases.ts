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

import { goToTab, isActiveTab, resetDB, setTokenUserViewPort } from '../../support/commands';

describe('Dockstore aliases', () => {
  resetDB();
  setTokenUserViewPort();

  describe('Find workflow version by alias', () => {
    it('workflow version alias', () => {
      cy.server();
      cy.route({
        url: '*/aliases/workflow-versions/w11wv13alias',
        method: 'GET',
        status: 200,
        response: { fullWorkflowPath: 'github.com/A/l', tagName: 'master' }
      });
      cy.visit('/aliases/workflow-versions/w11wv13alias');
      cy.url().should('eq', Cypress.config().baseUrl + '/workflows/github.com/A/l:master?tab=info');
    });

    it('invalid workflow version alias type', () => {
      cy.server();
      cy.visit('/aliases/foobar/fakeAlias');
      cy.url().should('eq', Cypress.config().baseUrl + '/aliases/foobar/fakeAlias');
      cy.contains('foobar is not a valid type');
    });

    it('workflow version alias incorrect', () => {
      cy.server();
      cy.route({
        url: '*/aliases/workflow-versions/incorrectAlias',
        method: 'GET',
        status: 404,
        response: {}
      });
      cy.visit('/aliases/workflow-versions/incorrectAlias');
      cy.url().should('eq', Cypress.config().baseUrl + '/aliases/workflow-versions/incorrectAlias');
      cy.contains('No workflow-versions with the alias incorrectAlias found');
    });
  });
});
