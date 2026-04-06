/*
 *    Copyright 2020 OICR
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
 * */

import { setTokenUserViewPort } from '../../support/commands';

describe('News notifications banner', () => {
  setTokenUserViewPort();

  beforeEach(() => {
    cy.fixture('newsNotifications.json').then((json) => {
      cy.intercept('GET', '*/curation/notifications', {
        body: json,
      });
    });
  });

  it('News notifications banner appears on dashboard', () => {
    cy.visit('/dashboard');
    // Make sure items are in proper sort order
    cy.get('[data-cy=news-notifications-container] [data-cy=news-notifications-item]').eq(0).contains('First Newsbody Item');
    cy.get('[data-cy=news-notifications-container] [data-cy=news-notifications-item]').eq(1).contains('Middle Newsbody Item');
    cy.get('[data-cy=news-notifications-container] [data-cy=news-notifications-item]').eq(2).contains('Last Newsbody Item');
    // Check for dismiss button
    cy.get('[data-cy=dismiss-notification]').should('exist');
  });
});
