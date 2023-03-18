// TODO add copyright header
import { goToTab, insertNotebooks, isActiveTab, resetDB, setTokenUserViewPort, setTokenUserViewPortCurator } from '../../support/commands';

describe('Dockstore notebooks', () => {
  resetDB();
  insertNotebooks();
  setTokenUserViewPort();

  const name = 'github.com/dockstore-testing/simple-notebook';

  it('should have /notebooks/<name> page for single notebook', () => {
    cy.visit('/notebooks/' + name);
    // Should initially display the info tab.
    // Check for some key information.
    cy.contains(name);
    cy.contains(/Notebook/i);
    cy.contains(/Format/i);
    cy.contains(/Jupyter/i);
    cy.contains(/Programming Language/i);
    cy.contains(/Python/i);
  });
});
