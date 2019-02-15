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
import { resetDB, setTokenUserViewPort } from '../../support/commands';

describe('Dockstore Home', () => {
  resetDB();
  setTokenUserViewPort();
  beforeEach(() => {
    cy.visit('');
  });

  it('cy.should - assert that <title> is correct', () => {
    cy.title().should('include', 'Dockstore');
    // ignoring for now, not working in combination with API display
    // expect(browser.getLocationAbsUrl()).toMatch("/");
  });

  describe('Browse tabs', () => {
    it('should have tool tab selected', () => {
      cy
        .get('#toolTab')
        .should('exist');
    });
    it('should not have workflow tab selected', () => {
      cy
        .get('#workflowTab')
        .should('exist');
    });
  });

  describe('Navigation', () => {
    it('My Tools visible', () => {
      cy
        .get('#my-tools-nav-button')
        .should('visible');
    });
    it('My Workflows visible', () => {
      cy
        .get('#my-workflows-nav-button')
        .should('visible');
    });
  });

  describe('Landing Video', () => {
    it('video button visible', () => {
      cy
        .get('.btn.youtube')
        .should('visible');
    });
    it('open and close video', () => {
      cy.get('#youtubeModal').should('not.be.visible');
      cy
        .get('.btn.youtube').should('be.visible').click();
      cy.get('#youtubeModal').should('be.visible');
      cy.get('body').type('{esc}');
      cy.get('#youtubeModal').should('not.be.visible');
    });
  });

  function starColumn(url: string, type: string) {
    if(type === 'workflow'){
      cy.get('#workflowTab-link')
        .click();
    }
    cy.get('.mat-icon.star')
      .should('not.exist');
    cy.visit(url);
    cy.get('#starringButton')
      .click();
    cy.visit('');
    if(type === 'workflow'){
      cy.get('#workflowTab-link')
        .click();
    }
    cy.get('.mat-icon.star')
      .should('exist');
    cy.visit(url);
    cy.get('#starringButton')
      .click();
  }

  describe('Workflow and Tool Star Count', () => {
    it('Workflow Star Count', () => {
      starColumn('/workflows/github.com/A/l', 'workflow');
    });

    it('Tool Star Count', () => {
      starColumn('/containers/quay.io/garyluu/dockstore-cgpmap/cgpmap-cramOut:3.0.0-rc8', 'tool');
    });
  });
});
