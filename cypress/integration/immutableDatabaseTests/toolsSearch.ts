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

describe('Dockstore tool list page', () => {
  setTokenUserViewPort();
  describe('Select a tool', () => {
    it('Should be able to go to the tools search page', () => {
      cy.visit('/search-containers');
    });
    it('Should display the correct url', () => {
      cy.get('mat-cell')
        .find('a')
        .contains(/\ba\b/)
        .should('have.attr', 'href', '/containers/quay.io/A2/a')
        .should('not.have.attr', 'href', '/containers/quay.io%20A2%20a');
      cy.get('mat-cell')
        .find('a')
        .contains('b3')
        .should('have.attr', 'href', '/containers/quay.io/A2/b3')
        .should('not.have.attr', 'href', '/containers/quay.io%20A2%20b3');
    });
    // a, b3, dockstore-cgpmap
    it('Should have 3 tools', () => {
      cy.get('mat-row').should('have.length', 3);
    });
    it('Should be able to go to the quay.io/A2/a tool', () => {
      cy.get('mat-cell')
        .find('a')
        .contains(/\ba\b/)
        .first()
        .click()
        .get('#tool-path')
        .should('contain', 'quay.io/A2/a');
    });
  });
});
