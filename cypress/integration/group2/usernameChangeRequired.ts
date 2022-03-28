import { resetDB, setTokenUserViewPort } from '../../support/commands';
import { ExtendedUserData, User } from '../../../src/app/shared/swagger';

describe('Testing user with invalid username', () => {
  resetDB();
  setTokenUserViewPort();

  describe('Test UI for users with invalid usernames', () => {
    it('Check warnings', () => {
      const invalidUsernameUser: User = {
        isAdmin: true,
        curator: true,
        name: 'user_A',
        setupComplete: false,
        tosversion: 'TOS_VERSION_2',
        privacyPolicyVersion: 'PRIVACY_POLICY_VERSION_2_5',
        username: 'user_A',
        usernameChangeRequired: true,
        userProfiles: {
          'github.com': {
            avatarURL: undefined,
            bio: undefined,
            company: undefined,
            email: undefined,
            location: undefined,
            name: '',
            username: 'user_A',
          },
        },
      };
      const canChangeUsername: ExtendedUserData = {
        canChangeUsername: true,
      };

      cy.server();
      cy.route({
        method: 'GET',
        url: '*/users/user',
        response: invalidUsernameUser,
      });
      cy.route({
        method: 'GET',
        url: '*/users/user/extended',
        response: canChangeUsername,
      });

      cy.visit('/');
      cy.get('[data-cy=changeUsernameBanner]').contains('Your username contains one or more banned words.');

      cy.visit('/onboarding');
      cy.get('[data-cy=choose-username-next-button]').should('be.disabled');
      cy.get('.alert-warning').contains('Your username contains one or more banned words.');

      cy.visit('/accounts');
      cy.contains('Dockstore Account & Preferences').click();
      cy.get('.alert-warning').contains('Your username contains one or more banned words.');
    });
  });
});
