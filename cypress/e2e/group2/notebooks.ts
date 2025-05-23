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

import {
  getTab,
  goToFilesTab,
  goToInfoTab,
  goToPreviewTab,
  goToVersionsTab,
  insertNotebooks,
  resetDB,
  setTokenUserViewPort,
  snapshot,
} from '../../support/commands';

describe('Dockstore notebooks', () => {
  resetDB();
  insertNotebooks();
  setTokenUserViewPort();

  const name = 'github.com/dockstore-testing/simple-notebook';

  it('should have /notebooks/<name> page for single notebook', () => {
    cy.visit('/notebooks/' + name);
    // Check the labels on the tabs.
    checkTabLabels();
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
    goToInfoTab();
    cy.contains('Source Code');
    cy.get('[data-cy=sourceRepository]').contains(name);
    cy.get('[data-cy=sourceRepository]')
      .should('have.attr', 'href')
      .and('include', 'https://' + name);
  });

  it('should have Info tab with TRS information', () => {
    cy.visit('/notebooks/' + name);
    goToInfoTab();
    cy.get('[data-cy=trs-link]').contains('TRS');
    cy.get('[data-cy=trs-link] a').contains('#notebook/' + name);
    cy.get('[data-cy=trs-link] a')
      .should('have.attr', 'href')
      .and('include', 'ga4gh/trs/v2/tools/' + encodeURIComponent('#notebook/' + name));
  });

  it('should have Preview tab with formatted notebook', () => {
    cy.visit('/notebooks/' + name);
    goToPreviewTab();
    // Confirm the appearance of the text from the markdown and code cells.
    cy.contains('A simple notebook.');
    cy.contains('print("Hello world!")');
    cy.contains('Hello world!');
  });

  it('should have Versions tab', () => {
    cy.visit('/notebooks/' + name);
    goToVersionsTab();
    // Check for Format column.
    cy.get('thead').contains('Format');
    // Check for version name and format.
    cy.get('[data-cy=versionRow]').contains('simple-published-v1');
    cy.get('[data-cy=versionRow]').contains(/jupyter/i);
    // Click on Info button and check content.
    cy.get('[data-cy=versionRow] button').click();
    cy.get('.label-value').contains('simple-published-v1');
    cy.get('.label-value').contains('/notebook.ipynb');
  });

  it('should have Files tab', () => {
    cy.visit('/notebooks/' + name);
    goToFilesTab();
    // Check for notebook file name and some notebook-specific json content.
    cy.get('app-source-file-tabs').contains('/notebook.ipynb');
    cy.get('app-source-file-tabs').contains('"nbformat"');
  });

  it('should have my-notebooks page', () => {
    cy.visit('/my-notebooks/' + name);
    // Check the labels on the tabs.
    checkTabLabels();
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
    // Check for view public page button
    cy.get('[data-cy=viewPublicWorkflowButton]').should('be.visible').click();
  });
  it('should have Preview tab with formatted TeX equations', () => {
    substituteNotebookContent(['{ "cell_type": "markdown", "source": "$\\\\frac{123}{x}$" }']);
    cy.visit('/notebooks/' + name);
    goToPreviewTab();
    // Confirm that there's a mathjax container tag and that the original TeX is gone.
    cy.get('.markdown mjx-container').should('be.visible');
    cy.get('.markdown').contains('$').should('not.exist');
    cy.get('.markdown').contains('\\frac{123}{x}').should('not.exist');
  });

  it('should be able to snapshot', () => {
    cy.visit('/my-notebooks/' + name);
    goToVersionsTab();
    cy.get('td').contains('Actions').click();
    snapshot();
  });

  it('should have discover existing notebooks button', () => {
    cy.fixture('myWorkflows.json').then((json) => {
      cy.intercept('PATCH', '/api/users/1/workflows', {
        body: json,
        statusCode: 200,
      });
    });

    cy.visit('/my-notebooks');
    cy.fixture('myNotebooks.json').then((json) => {
      cy.intercept('GET', '/api/users/1/notebooks', {
        body: json,
        statusCode: 200,
      }).as('getNotebooks');
    });
    cy.get('[data-cy=addToExistingWorkflows]').should('be.visible').click();
    cy.visit('/my-notebooks/' + name);

    cy.wait('@getNotebooks');
    cy.contains('addedthisnotebookviasync');
  });

  it('should have Preview tab with highlighted syntax', () => {
    substituteNotebookContent(['{ "cell_type": "code", "source": [ "import xyz;" ] }']);
    cy.visit('/notebooks/' + name);
    goToPreviewTab();
    // Confirm that spans have been introduced into the source code.
    cy.get('.source span').should('be.visible');
  });

  it('should have Preview tab that sanitizes user-supplied HTML', () => {
    substituteNotebookContent([
      // Exploit via markdown link:
      '{ "cell_type": "markdown", "source": "good text A [an evil link](javascript:alert(1))" }',
      // Exploit via mathjax TeX:
      // Based on an actual recent exploit: https://github.com/mathjax/MathJax/issues/2885
      '{ "cell_type": "markdown", "source": "good text B $$E = mc^2\\\\href{java\\nscript:alert(2)}{Click Me}$$" }',
      // Exploit via text/html display_data output cell:
      '{ "cell_type": "code", "source": "x = 1", "outputs": [ { "output_type": "display_data", "data": { "text/html": "good text C <a href=\\"javascript:alert(3)\\">Click Me</a>" } } ] }',
    ]);
    cy.spy(window, 'alert').as('alert');
    cy.visit('/notebooks/' + name);
    goToPreviewTab();
    cy.get('.markdown');
    // Wait and then check if the alert() was executed.
    cy.wait(5000);
    cy.get('.markdown').contains('good text A');
    cy.get('.markdown').contains('good text B');
    cy.get('.markdown').contains('$$').should('not.exist');
    cy.get('.output').contains('good text C');
    cy.get('@alert').its('callCount').should('equal', 0);
  });

  function substituteNotebookContent(cells: string[]): void {
    cy.intercept('GET', '/api/workflows/*/workflowVersions/*/sourcefiles*', [
      {
        path: '/notebook.ipynb',
        content: '{ "nbformat_major": 4, "nbformat_minor": 0, "cells": [' + cells.join(',') + '] }',
        state: 'COMPLETE',
      },
    ]);
  }

  function checkTabLabels() {
    getTab('Info');
    getTab('Preview');
    getTab('Versions');
    getTab('Files');
  }
});
