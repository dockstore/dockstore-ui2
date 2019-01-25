/*
 *     Copyright 2019 OICR
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
import { resetDB } from '../../support/commands';

describe('Tool and Workflow starring', () => {
  resetDB();

  function setTokenAdminUserViewPort() {
    localStorage.setItem('dockstore.ui.userObj', '{\"id\": 1, \"username\": \"user_A\", \"isAdmin\": \"true\", \"name\": \"user_A\"}');
    localStorage.setItem('ng2-ui-auth_token', 'imamafakedockstoretoken');
  }

  function setTokenCuratorUserViewPort() {
    localStorage.setItem('dockstore.ui.userObj', '{\"id\": 1, \"username\": \"user_A\", \"isAdmin\": \"false\", \"name\": \"user_A\", "curator": "true"}');
    localStorage.setItem('ng2-ui-auth_token', 'imamafakedockstoretoken');
  }

  describe('Navigation bar icons', () => {
    it('Admin user sees lock icon', () => {
      setTokenAdminUserViewPort();
      cy.visit('');

    });

    it('Curator user sees pen icon', () => {

    });

    it('Regular user does not see icon', () => {

    });
  });

});
