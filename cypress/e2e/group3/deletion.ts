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
import { resetDB, setTokenUserViewPort, insertNotebooks, insertAppTools, invokeSql, goToTab } from '../../support/commands';

describe('Entry Deletion', () => {
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

  function unpublicize(entry: Entry): void {
    invokeSql(`update ${entry.table} set ispublished = false, waseverpublic = false where id = ${entry.id}`);
    invokeSql(`update ${entry.table} set actualdefaultversion = ${entry.versionId} where id = ${entry.id}`);
    invokeSql(`delete from event where ${entry.table}id = ${entry.id}`);
  }

  function goToPrivatePage(entry: Entry): void {
    cy.visit('/');
    cy.visit(`${entry.myPrefix}/${entry.path}`);
    cy.wait(2000);
  }

  it('Should not be able to delete an entry that is published', () => {
    entries.forEach((entry) => {
      unpublicize(entry);
      goToPrivatePage(entry);
      cy.contains('button', 'Delete').should('be.visible').should('not.be.disabled');
      cy.contains('button', 'Publish').should('be.visible').should('not.be.disabled').click();
      goToPrivatePage(entry);
      cy.contains('button', 'Delete').should('not.exist');
    });
  });

  it('Should not be able to delete an entry that was previously published', () => {
    entries.forEach((entry) => {
      unpublicize(entry);
      goToPrivatePage(entry);
      cy.contains('button', 'Delete').should('be.visible').should('not.be.disabled');
      cy.contains('button', 'Publish').should('be.visible').should('not.be.disabled').click();
      goToPrivatePage(entry);
      cy.contains('button', 'Unpublish').should('be.visible').should('not.be.disabled').click();
      goToPrivatePage(entry);
      cy.contains('button', 'Delete').should('not.exist');
    });
  });

  it('Should be able to delete an entry that was never published', () => {
    entries.forEach((entry) => {
      unpublicize(entry);
      goToPrivatePage(entry);
      cy.contains('button', 'Delete').should('be.visible').should('not.be.disabled').click();
      cy.get('[data-cy=delete-no]').should('be.visible').should('not.be.disabled').click();
      goToPrivatePage(entry);
      cy.contains(entry.path).should('exist');
      cy.contains('button', 'Delete').should('be.visible').should('not.be.disabled').click();
      cy.get('[data-cy=delete-yes]').should('be.visible').should('not.be.disabled').click();
      cy.wait(1000);
      cy.contains(entry.path).should('not.exist');
      goToPrivatePage(entry);
      cy.contains(entry.path).should('not.exist');
    });
  });
});
