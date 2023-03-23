/*
 *    Copyright 2023 OICR, UCSC
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

import { goToTab, insertNotebooks, resetDB, setTokenUserViewPort } from '../../support/commands';

describe('Dockstore notebooks', () => {
  resetDB();
  insertNotebooks();
  setTokenUserViewPort();

  const name = 'github.com/dockstore-testing/simple-notebook';

  it('should have /notebooks/<name> page for single notebook', () => {
    cy.visit('/notebooks/' + name);
    // Check the labels on the tabs.
    cy.get('.mat-tab-list').contains('Info');
    cy.get('.mat-tab-list').contains('Code');
    cy.get('.mat-tab-list').contains('Versions');
    cy.get('.mat-tab-list').contains('Files');
    // Should initially display the Info tab.
    // Check for some key information.
    cy.contains(name);
    cy.contains(/Notebook/i);
    cy.contains(/Format/i);
    cy.contains(/Jupyter/i);
    cy.contains(/Programming Language/i);
    cy.contains(/Python/i);
    cy.contains(/Export as ZIP/i);
    cy.contains(/Author One/i);
    cy.contains(/Author Two/i);
  });

  it('should have Info tab with link to source code', () => {
    cy.visit('/notebooks/' + name);
    goToTab('Info');
    cy.contains('Source Code');
    cy.get('[data-cy=sourceRepository]').contains(name);
    cy.get('[data-cy=sourceRepository]')
      .should('have.attr', 'href')
      .and('include', 'https://' + name);
  });

  it('should have Info tab with TRS information', () => {
    cy.visit('/notebooks/' + name);
    goToTab('Info');
    cy.get('[data-cy=trs-link]').contains('TRS');
    cy.get('[data-cy=trs-link] a').contains('#notebook/' + name);
    cy.get('[data-cy=trs-link] a')
      .should('have.attr', 'href')
      .and('include', 'ga4gh/trs/v2/tools/' + encodeURIComponent('#notebook/' + name));
  });

  it('should have Code tab', () => {
    cy.visit('/notebooks/' + name);
    goToTab('Code');
    // Confirm the appearance of the text from the markdown and code cells.
    cy.contains('A simple notebook.');
    cy.contains('print("Hello world!")');
    cy.contains('Hello world!');
  });

  it('should have Versions tab', () => {
    cy.visit('/notebooks/' + name);
    goToTab('Versions');
    // Check for Format column.
    cy.get('thead').contains('Format');
    // Check for version name and format.
    cy.get('[data-cy=versionRow]').contains('simple-published-v1');
    cy.get('[data-cy=versionRow]').contains(/jupyter/i);
    // Click on Info button and check content.
    cy.get('[data-cy=versionRow] button').click();
    cy.get('input[name=reference]').should('have.value', 'simple-published-v1');
    cy.get('input[name=workflow_path]').should('have.value', '/notebook.ipynb');
  });

  it('should have Files tab', () => {
    cy.visit('/notebooks/' + name);
    goToTab('Files');
    // Check for notebook file name and some notebook-specific json content.
    cy.get('app-source-file-tabs').contains('Primary');
    cy.get('app-source-file-tabs').contains('/notebook.ipynb');
    cy.get('app-source-file-tabs').contains('"nbformat"');
  });
});
