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

import { setTokenUserViewPort } from '../../support/commands';
describe('TOS Banner', () => {
  function checkForBanner() {
    cy.get('[data-cy=tos-banner]').contains('By using our site, you acknowledge that you have read and understand our');
  }

  beforeEach(() => {
    cy.visit('');
  });

  describe('TOS banner visibility when logged out', () => {
    it('Local storage has never been set', () => {
      checkForBanner();
    });

    it('Still visible if scrolled down', () => {
      cy.scrollTo(0, 500);
      checkForBanner();
    });

    it('Visible on other pages', () => {
      cy.visit('/organizations');
      checkForBanner();

      cy.visit('/search');
      checkForBanner();

      cy.visit('/sitemap');
      checkForBanner();

      cy.visit('/funding');
      checkForBanner();
    });

    it('Disappear once dismissed and reappear if TOS or Privacy policy updated', () => {
      cy.get('[data-cy=dismiss-tos-banner]').click();
      cy.get('[data-cy=tos-banner]').should('not.exist');

      cy.clearLocalStorage('dismissedLatestTOS');
      cy.visit('');
      checkForBanner();

      cy.get('[data-cy=dismiss-tos-banner]').click();

      cy.clearLocalStorage('dismissedLatestPrivacyPolicy');
      cy.visit('');
      checkForBanner();
    });
  });

  describe('TOS banner visibility when logged in', () => {
    setTokenUserViewPort();
    it('Disappears once logged in', () => {
      cy.visit('');
      cy.wait(500);
      cy.get('[data-cy=tos-banner]').should('not.exist');
    });
  });
});
