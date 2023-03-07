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

describe('Notification updates banner', () => {
  setTokenUserViewPort();

  beforeEach(() => {
    cy.fixture('notificationUpdates.json').then((json) => {
      cy.intercept('GET', '*/curation/notifications', {
        body: json,
      });
    });
  });

  it('Notification updates banner appears on logged-in homepage', () => {
    cy.visit('/dashboard');
    // make sure items are in proper sort order
    cy.get('[data-cy=notification-updates-container] > [data-cy=notification-updates-item]').eq(0).contains('First Newsbody Item');
    cy.get('[data-cy=notification-updates-container] > [data-cy=notification-updates-item]').eq(1).contains('Middle Newsbody Item');
    cy.get('[data-cy=notification-updates-container] > [data-cy=notification-updates-item]').eq(2).contains('Last Newsbody Item');
    cy.get('[data-cy=dismiss-notification]').should('exist');
  });

  it('Notification updates banner appears on new dashboard', () => {
    cy.visit('/dashboard?newDashboard=');
    // make sure items are in proper sort order
    cy.get('[data-cy=notification-updates-container] > [data-cy=notification-updates-item]').eq(0).contains('First Newsbody Item');
    cy.get('[data-cy=notification-updates-container] > [data-cy=notification-updates-item]').eq(1).contains('Middle Newsbody Item');
    cy.get('[data-cy=notification-updates-container] > [data-cy=notification-updates-item]').eq(2).contains('Last Newsbody Item');
    cy.get('[data-cy=dismiss-notification]').should('exist');
  });
});
