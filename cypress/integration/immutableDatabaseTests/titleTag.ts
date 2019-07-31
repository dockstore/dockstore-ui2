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
describe('Verify Title Tags', () => {
  setTokenUserViewPort();

  describe('Dropdown links', () => {
    it('/starred', () => {
      cy.visit('/starred');
      cy.title().should('eq', 'Dockstore | Starred Tools & Workflows');
    });

    it('/accounts', () => {
      cy.visit('/accounts');
      cy.title().should('eq', 'Dockstore | Accounts');
    });
  });

  describe('Navbar Links', () => {
    it('/search', () => {
      cy.visit('/search');
      cy.title().should('eq', 'Dockstore | Search');
    });

    it('/organizations', () => {
      cy.visit('/organizations');
      cy.title().should('eq', 'Dockstore | Organizations');
    });

    it('/my-tools', () => {
      cy.visit('/my-tools');
      cy.title().should('eq', 'Dockstore | My Tools');
    });

    it('/my-workflows', () => {
      cy.visit('/my-workflows');
      cy.title().should('eq', 'Dockstore | My Workflows');
    });
  });

  describe('Header Links', () => {
    it('/quick-start', () => {
      cy.visit('/quick-start');
      cy.title().should('eq', 'Dockstore | Quick Start');
    });

    it('/login', () => {
      cy.visit('/login');
      cy.title().should('eq', 'Dockstore | Login');
    });
  });

  describe('Tools/Workflows', () => {
    it('individual tool', () => {
      cy.visit('/containers/quay.io/garyluu/dockstore-cgpmap/cgpmap-cramOut:3.0.0-rc8?tab=info');
      cy.title().should('eq', 'Dockstore | Tool');
    });

    it('individual workflow', () => {
      cy.visit('/workflows/github.com/A/l:master?tab=info');
      cy.title().should('eq', 'Dockstore | Workflow');
    });

    it('/tools', () => {
      cy.visit('/tools');
      cy.title().should('eq', 'Dockstore | Tools');
    });

    it('/workflows', () => {
      cy.visit('/workflows');
      cy.title().should('eq', 'Dockstore | Workflows');
    });
  });

  describe('Miscellaneous ', () => {
    it('/sitemap', () => {
      cy.visit('/sitemap');
      cy.title().should('eq', 'Dockstore | Sitemap');
    });

    it('/funding', () => {
      cy.visit('/funding');
      cy.title().should('eq', 'Dockstore | Funding');
    });

    it('/maintenance', () => {
      cy.visit('/maintenance');
      cy.title().should('eq', 'Dockstore | Maintenance');
    });

    it('/onboarding', () => {
      cy.visit('/onboarding');
      cy.title().should('eq', 'Dockstore | Onboarding');
    });
  });
});
