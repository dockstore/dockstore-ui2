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

describe('Go to disabled Dockstore Account Controls', () => {
  resetDB();
  setTokenUserViewPort();
  beforeEach(() => {
    cy.visit('');
    cy.get('#dropdown-main').click();
    cy.get('#dropdown-accounts').click();
    cy.contains('Dockstore Account Controls').click();
  });
  it('Should have the danger alert', () => {
    cy.contains('caution');
  });
  it('Should have the delete button disabled', () => {
    cy.contains('Delete Dockstore Account').should('be.disabled');
  });
  it('Should have the change username button disabled', () => {
    cy.contains('Update Username').should('be.disabled');
  });
});
