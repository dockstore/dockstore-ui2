import { resetDB, setTokenUserViewPort, invokeSql, goToTab } from '../../support/commands';

describe('Entry Deletion', () => {
  resetDB();
  setTokenUserViewPort();

  type Entry = {
    path: string;
    id: number;
    table: string;
    myPrefix: string;
  };

  function unpublicize(entry: Entry): void {
    invokeSql(`update ${entry.table} set ispublished = false, waseverpublic = false where id = ${entry.id}`);
    invokeSql(`update ${entry.table} set actualdefaultversion = ${entry.versionId} where id = ${entry.id}`);
    /*
    goToPrivatePage(entry);
    goToTab('Versions');
    cy.contains('button', 'Actions').should('be.visible').click();
    cy.contains('button', 'Set as Default Version').should('be.visible').click();
    */
  }

  function goToPrivatePage(entry: Entry): void {
    console.log(`${entry.myPrefix}/${entry.path}`);
    cy.visit(`${entry.myPrefix}/${entry.path}`);
  }

  function doesEntryExist(entry: Entry): boolean {
    return invokeSql(`select count(*) from ${entry.table} where id = ${entry.id}`).then((result) => result.stdout > 0);
  }

  const entries: Entry[] = [{ table: 'workflow', id: 11, versionId: 14, myPrefix: 'my-workflows', path: 'github.com/A/l' }];

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
      cy.contains('button', 'No').should('be.visible').click(); // TODO reference the data-cy attribute
      expect(doesEntryExist(entry)).to.be.true;
      cy.contains('button', 'Delete').should('be.visible').click();
      cy.contains('button', 'Yes').should('be.visible').click(); // TODO reference the data-cy attribute
      expect(doesEntryExist(entry)).to.be.false;
      // TODO confirm that location is dashboard
    });
  });
});
