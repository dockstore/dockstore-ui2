/*
 *     Copyright 2023 OICR, UCSC
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
import {
  resetDB,
  setTokenUserViewPort,
  insertNotebooks,
  insertAppTools,
  invokeSql,
  assertVisibleTab,
  assertNoTab,
} from '../../support/commands';

describe('Entry Archival', () => {
  resetDB();
  setTokenUserViewPort();
  insertAppTools();
  insertNotebooks();

  type Entry = {
    path: string;
    id: number;
    table: string;
    myPrefix: string;
  };

  const entries: Entry[] = [
    { table: 'workflow', id: 11, versionId: 14, myPrefix: 'my-workflows', path: 'github.com/A/l' },
    { table: 'apptool', id: 50, versionId: 1000, myPrefix: 'my-tools', path: 'github.com/C/test-github-app-tools/testing' },
    { table: 'notebook', id: 1000, versionId: 1000, myPrefix: 'my-notebooks', path: 'github.com/dockstore-testing/simple-notebook' },
  ];

  function reset(entry: Entry): void {
    invokeSql(`update ${entry.table} set archived = false, ispublished = false, waseverpublic = false where id = ${entry.id}`);
    invokeSql(`update ${entry.table} set actualdefaultversion = ${entry.versionId} where id = ${entry.id}`);
    invokeSql(`delete from event where ${entry.table}id = ${entry.id}`);
  }

  function goToPrivatePage(entry: Entry): void {
    cy.visit('/');
    cy.visit(`${entry.myPrefix}/${entry.path}`);
    cy.contains(entry.path);
  }

  it('Should be able to archive/unarchive an entry', () => {
    entries.forEach((entry) => {
      reset(entry);

      // Entry is not archived, is deletable
      // "Archive" button should not appear
      goToPrivatePage(entry);
      cy.contains('app-workflow', 'was archived').should('not.exist');
      cy.contains('button', 'Archive').should('not.exist');

      // Publish the entry
      cy.contains('button', 'Publish').should('be.visible').should('not.be.disabled').click();

      // Entry is not archived, not deletable
      // "Archived" column should not appear in sidebar
      // "Archive" button should appear
      goToPrivatePage(entry);
      cy.contains('app-workflow', 'was archived').should('not.exist');
      assertNoTab('Archived');
      cy.contains('button', 'Archive').should('be.visible').should('not.be.disabled').click();

      // Confirmation dialog should appear, select "yes".
      cy.get('[data-cy=archive-yes]').should('be.visible').should('not.be.disabled').click();

      // Entry is archived
      // "Archived" column should appear in sidebar
      // Entry modification UI should be disabled
      // "Unarchive" button should appear
      goToPrivatePage(entry);
      cy.contains('app-workflow', 'was archived').should('exist');
      assertVisibleTab('Archived');
      cy.get('[data-cy=topicEditButton]').should('be.visible').should('be.disabled');
      cy.contains('button', 'Unarchive').should('be.visible').should('not.be.disabled').click();

      // Entry is not archived, not deletable
      // "Archived" column should not appear in sidebar
      // "Archive" button should appear
      goToPrivatePage(entry);
      cy.contains('app-workflow', 'was archived').should('not.exist');
      assertNoTab('Archived');
      cy.contains('button', 'Archive').should('be.visible').should('not.be.disabled');
    });
  });
});
