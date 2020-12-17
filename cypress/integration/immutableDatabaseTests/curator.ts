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
import { setTokenUserViewPortCurator } from '../../support/commands';
describe('Curator UI', () => {
  setTokenUserViewPortCurator();
  beforeEach(() => {
    cy.visit('');

    // Select dropdown
    cy.get('[data-cy=dropdown-main]:visible').click();
  });

  describe('Dropdown for curators', () => {
    it('Curator user sees edit icon', () => {
      cy.get('#dropdown-accounts > .mat-icon').contains('edit');
    });
  });

  describe('Profile', () => {
    it('Curator status indicated on profile page', () => {
      cy.get('#dropdown-accounts').click();
      cy.get('#mat-tab-label-0-1').click();
      cy.get('#account-is-curator').should('exist');
      cy.get('#account-is-curator > .mat-icon').contains('edit');
    });
  });
});
