/*
 *     Copyright 2022 OICR, UCSC
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

import { resetDB, setTokenUserViewPort, testNoGithubEntriesText } from '../../support/commands';

describe('Mock create a GitHub repository', () => {
  resetDB();
  setTokenUserViewPort();

  beforeEach(() => {
    cy.intercept('GET', /github.com\/organizations/, {
      body: ['dockstore'],
    });
  });

  describe('Testing My Tools page', () => {
    testNoGithubEntriesText('tool', 'dockstore');
  });
  describe('Testing My Workflows page', () => {
    testNoGithubEntriesText('workflow', 'dockstore');
  });
  describe('Testing My Services page', () => {
    testNoGithubEntriesText('service', 'dockstore');
  });
});
