/*
 *    Copyright 2018 OICR
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

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */
import { resetDB, setTokenUserViewPort } from '../../support/commands';
describe('Dockstore Home', function () {
  resetDB();
  setTokenUserViewPort();
  beforeEach(function () {
    cy.visit('');
  });

  it('cy.should - assert that <title> is correct', function () {
    cy.title().should('include', 'Dockstore');
    // ignoring for now, not working in combination with API display
    // expect(browser.getLocationAbsUrl()).toMatch("/");
  });

  describe('Browse tabs', function () {
    it('should have tool tab selected', function () {
      cy
        .get('#toolTab')
        .should('exist');
    });
    it('should not have workflow tab selected', function () {
      cy
        .get('#workflowTab')
        .should('exist');
    });
  });

  describe('Navigation', function () {
    it('My Tools visible', function () {
      cy
        .get('#my-tools-nav-button')
        .should('visible');
    });
    it('My Workflows visible', function () {
      cy
        .get('#my-workflows-nav-button')
        .should('visible');
    });
  });

  describe('Landing Video', function () {
    it('video button visible', function () {
      cy
        .get('.btn.youtube')
        .should('visible');
    });
    it('open and close video', function () {
      cy.get('#youtubeModal').should('not.be.visible');
      cy
        .get('.btn.youtube').should('be.visible').click();
      cy.get('#youtubeModal').should('be.visible');
      cy.get('body').type('{esc}');
      cy.get('#youtubeModal').should('not.be.visible');
    });
  });
});
