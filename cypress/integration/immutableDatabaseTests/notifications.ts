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
 * */

describe('Notifications Banner', () => {
  function verifyNotificationExist() {
    cy
      .get('[data-cy=notification-banner]')
      .should('exist');
  }

  function verifyNotificationAbsent() {
    cy
      .get('[data-cy=notification-banner]')
      .should('not.exist');
  }

  beforeEach(() => {
    cy.visit('');
  });

  describe('Sitewide notification is displayed when when it is not dismissed', () => {
    it('should be appearing on any page before it is dismissed', () => {
      cy.server();
      cy.fixture('notification1.json').then(json => {
        cy.route({
          method: 'POST',
          url: '/*',
          response: json
        });
      });

      verifyNotificationExist();

      cy.visit('/search');
      verifyNotificationExist();

      cy.visit('/organizations');
      verifyNotificationExist();

      cy.visit('/my-services');
      verifyNotificationExist();

      cy.visit('/my-workflows');
      verifyNotificationExist();
    });
  });

  describe('Sitewide notification is not displayed when it is dismissed', () => {
    it('should not be appearing on any page when it is dismissed', () => {
      cy.server();
      cy.fixture('notification1.json').then(json => {
        cy.route({
          method: 'POST',
          url: '/*',
          response: json
        });
      });

      cy
        .get('[data-cy=dismiss-notification')
        .click();

      verifyNotificationAbsent();

      cy.visit('/search');
      verifyNotificationAbsent();

      cy.visit('/organizations');
      verifyNotificationAbsent();

      cy.visit('/my-services');
      verifyNotificationAbsent();

      cy.visit('/my-workflows');
      verifyNotificationAbsent();
    });
  });
});
