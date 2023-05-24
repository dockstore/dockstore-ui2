/*
 *    Copyright 2018 OICR
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

describe('Dockstore workflow list page', () => {
  setTokenUserViewPort();
  describe('Select a workflow', () => {
    it('Should be able to go to the workflows search page', () => {
      cy.visit('/search-workflows');

      cy.get('mat-cell')
        .find('a')
        .contains(/^A\/l$/)
        .should('have.attr', 'href', '/workflows/github.com/A/l')
        .should('not.have.attr', 'href', '/workflows/github.com%20A%20l');
      // 1 workflow A/l, no checkers from other tests added
      cy.get('mat-row').should('have.length', 1);

      cy.get('mat-cell')
        .find('a')
        .contains(/^A\/l$/)
        .click()
        .get('#workflow-path')
        .should('contain', 'github.com/A/l');
    });
  });
});
