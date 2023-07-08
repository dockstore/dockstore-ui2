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
    { table: 'apptool', id: 51, versionId: 14, myPrefix: 'my-tools', path: 'github.com/C/test-github-app-tools/md5sum' },
    { table: 'notebook', id: 1000, versionId: 1000, myPrefix: 'my-notebooks', path: 'github.com/dockstore-testing/simple-notebook' },
  ];

  function unpublicize(entry: Entry): void {
    invokeSql(`update ${entry.table} set ispublished = false, waseverpublic = false where id = ${entry.id}`);
    invokeSql(`update ${entry.table} set actualdefaultversion = ${entry.versionId} where id = ${entry.id}`);
  }

  function goToPrivatePage(entry: Entry): void {
    console.log(`${entry.myPrefix}/${entry.path}`);
    cy.visit(`${entry.myPrefix}/${entry.path}`);
  }

  it('Should not be able to delete an entry that is published', () => {
    entries.forEach((entry) => {
      unpublicize(entry);
      goToPrivatePage(entry);
      cy.contains('button', 'Delete').should('be.visible');
      cy.contains('button', 'Publish').should('be.visible').click();
      goToPrivatePage(entry);
      cy.contains('button', 'Delete').should('not.exist');
    });
  });

  it('Should not be able to delete an entry that was previously published', () => {
    entries.forEach((entry) => {
      unpublicize(entry);
      goToPrivatePage(entry);
      cy.contains('button', 'Delete').should('be.visible');
      cy.contains('button', 'Publish').should('be.visible').click();
      goToPrivatePage(entry);
      cy.contains('button', 'Unpublish').should('be.visible').click();
      goToPrivatePage(entry);
      cy.contains('button', 'Delete').should('not.exist');
    });
  });

  it('Should be able to delete an entry that was never published', () => {
    entries.forEach((entry) => {
      unpublicize(entry);
      goToPrivatePage(entry);
      cy.contains('button', 'Delete').should('be.visible').click();
      cy.get('[data-cy=delete-no]').should('be.visible').click();
      goToPrivatePage(entry);
      cy.contains(entry.path).should('exist');
      cy.contains('button', 'Delete').should('be.visible').click();
      cy.get('[data-cy=delete-yes]').should('be.visible').click();
      goToPrivatePage(entry);
      cy.wait(1000);
      cy.contains(entry.path).should('not.exist');
    });
  });
});
