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

describe('Notifications Banner', () => {
  const dockstorePaths = ['/search', '/organizations', '/my-services', '/my-workflows', '/starred'];

  function verifyNotificationExist() {
    cy.get('[data-cy=notification-banner]').should('exist');
  }

  function verifyNotificationAbsent() {
    cy.get('[data-cy=notification-banner]').should('not.exist');
  }

  beforeEach(() => {
    cy.server();
    cy.fixture('notification1.json').then(json => {
      cy.route({
        method: 'GET',
        url: '*/curation/notifications',
        response: json
      });
    });

    cy.visit('');
  });

  describe('Sitewide notification is displayed when when it is not dismissed', () => {
    it('should be appearing on any page before it is dismissed', () => {
      verifyNotificationExist();

      dockstorePaths.forEach(path => {
        cy.visit(path);
        verifyNotificationExist();
      });
    });
  });

  describe('Sitewide notification is not displayed when it is dismissed', () => {
    it('should not be appearing on any page when it is dismissed', () => {
      cy.get('[data-cy=dismiss-notification').click();

      verifyNotificationAbsent();

      dockstorePaths.forEach(path => {
        cy.visit(path);
        verifyNotificationAbsent();
      });
    });
  });
});
