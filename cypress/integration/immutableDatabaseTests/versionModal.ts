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
import { setTokenUserViewPort, goToTab } from '../../support/commands';

describe('Public Version Modal', () => {
  setTokenUserViewPort();
  beforeEach(() => {
    cy.visit('/containers/quay.io/garyluu/dockstore-cgpmap/cgpmap-cramOut');
    cy.get('.mat-tab-label').should('have.length', 4);
  });

  it('Change tab to versions', () => {
    goToTab('Versions');

    cy.contains('View').click();
    cy.get('form');
    cy.get('#dockerPullCommand')
      .should('be.visible')
      .should('have.value', 'docker pull quay.io/garyluu/dockstore-cgpmap:3.0.0-rc8');
  });
});
