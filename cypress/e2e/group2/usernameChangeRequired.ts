import { ExtendedUserData, User } from '../../../src/app/shared/openapi';
import { resetDB, setTokenUserViewPort } from '../../support/commands';

describe('Testing user with invalid username', () => {
  resetDB();
  setTokenUserViewPort();

  describe('Test UI for users with invalid usernames', () => {
    it('Check warnings', () => {
      const invalidUsernameUser: User = {
        platformPartner: false,
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
            location: undefined,
            name: '',
            username: 'user_A',
          },
        },
      };
      const canChangeUsername: ExtendedUserData = {
        canChangeUsername: true,
      };

      cy.intercept('GET', '*/users/user', {
        body: invalidUsernameUser,
      });
      cy.intercept('GET', '*/users/user/extended', {
        body: canChangeUsername,
      });

      cy.visit('/');
      cy.get('[data-cy=changeUsernameBanner]').contains('Your username contains one or more banned words.');

      cy.visit('/onboarding');
      cy.get('[data-cy=choose-username-next-button]').should('be.disabled');
      cy.get('.alert-warning').contains('Your username contains one or more banned words.');

      cy.visit('/accounts');
      cy.contains('Edit Dockstore Username').click();
      cy.get('.alert-warning').contains('Your username contains one or more banned words.');
    });
  });
});
