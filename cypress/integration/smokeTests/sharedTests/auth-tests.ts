import { goToTab } from '../../../support/commands';

/**
 * To run these on tests you have the following:
 *    1. Base url for cypress must be set to dev.dockstore.net (or if local make sure user is in local database)
 *    2. DockstoreTestUser4 registered on dev.dockstore.net with github and quay accounts linked (at minimum)
 *        -- must have the entries on their github and quay accounts (dockstore-tool-md5sum and hello-dockstore-workflow)
 *    3. Dockstore token for DockstoreTestUser4 must be passed to cypress using the TOKEN environment variable
 *    4. The 'testtest' dockstore organization must exist with 'testcollection' Collection and DockstoreTestUser4 as member
 *    5. Tests will either fail or be flaky if artifacts are left behind from a failed run (ie tool not deleted or workflow unpublished)
 *        -- if tests keep failing double check that these were removed
 */

// TODO: for clarity and future debugging refactor variable names to use 'namespace', 'entry-name', call those variable names in methods
const username = 'dockstoretestuser4';
// tuples of registry, repo namespace (username), and entry-name (repo name)
const toolName = 'dockstore-tool-md5sum';
const toolTuple = ['github.com', username, toolName];
const workflowTuple = ['github.com', username, 'hello-dockstore-workflow'];
// tuple of organization name, collection name
const collectionTuple = ['test', 'testcollection'];
const hardcodedWaitTime = 8000;

// get the dockstore token from env variable and put it in local storage
function storeToken() {
  window.localStorage.setItem('ng2-ui-auth_token', Cypress.env('TOKEN'));
}

function unpublishTool() {
  it('unpublish the tool', () => {
    storeToken();
    cy.visit('/my-tools');
    cy.wait(hardcodedWaitTime);
    cy.contains('#publishToolButton', 'Unpublish').should('be.enabled').click();
    cy.contains('#publishToolButton', 'Publish').should('be.enabled');
    cy.contains('#deregisterButton', 'Delete').should('be.enabled');
  });
}

function deleteTool() {
  it('delete the tool', () => {
    storeToken();
    cy.server();
    cy.route('delete', '**/containers/**').as('containers');
    cy.contains('#deregisterButton', 'Delete').should('be.visible').click();
    cy.contains('div', 'Are you sure you wish to delete this tool?').within(() => {
      cy.contains('button', 'Delete').should('be.visible').click();
    });
    cy.wait('@containers');
    cy.contains('There are currently no tools registered under this account');
  });
}

function registerQuayTool(repo: string, name: string) {
  it('register and publish - quickly register quay.io tools option', () => {
    storeToken();

    // define routes to watch for
    cy.server();
    // get quay.io organization/namespaces accessible to user
    cy.route('/api/users/dockerRegistries/quay.io/organizations').as('orgs');
    cy.route('**/tokens').as('tokens');
    cy.route('**/repositories').as('repos');
    cy.route('**/containers').as('containers');
    cy.route('post', '**/publish').as('publish');

    cy.visit('/my-tools');
    cy.wait('@tokens');
    // click thru the steps of registering a tool
    cy.wait(hardcodedWaitTime); // The page loads asynchronously, and causes a detached DOM to be grabbed by Cypress. This is a 'fix'.
    cy.get('#register_tool_button').should('be.visible').click();
    cy.wait('@orgs');
    cy.get('mat-dialog-content').within(() => {
      cy.contains('mat-radio-button', 'Quickly register Quay.io tools').click();
      cy.contains('button', 'Next').should('be.visible').click();
      cy.contains('mat-form-field', 'Select namespace').should('be.visible').click();
    });
    cy.contains('mat-option', repo).should('be.visible').click();
    cy.wait('@repos');
    cy.get('mat-dialog-content').within(() => {
      cy.contains('div', name).within(() => {
        cy.contains('mat-icon', 'sync').should('be.visible').click();
      });
    });
    cy.wait('@containers');
    cy.contains('button', 'Finish').should('be.visible').click();
    cy.url().should('contain', toolName);
    cy.contains('button', 'Refresh').should('be.visible').click();
    cy.wait(hardcodedWaitTime); // The publish button is enabled even when publishing fails, so we need to wait for the refresh to complete.
    cy.get('#publishToolButton').should('be.visible').click();
    cy.wait('@publish');
  });
}

function registerRemoteSitesTool(repo: string, name: string) {
  it('register and publish - create tool remote sites option', () => {
    storeToken();
    // define routes to watch for
    cy.server();
    cy.route('post', '**/publish').as('publish');
    cy.route('**/tokens').as('tokens');

    cy.visit('/my-tools');
    cy.wait('@tokens');
    cy.wait(hardcodedWaitTime); // The page loads asynchronously, and causes a detached DOM to be grabbed by Cypress. This is a 'fix'.
    cy.get('#register_tool_button').should('be.visible').click();
    cy.get('mat-dialog-content').within(() => {
      cy.contains('mat-radio-button', 'Create tool with descriptor(s) on remote sites').click();
      cy.contains('button', 'Next').should('be.visible').click();
      cy.get('#sourceCodeRepositoryInput').type(`${repo}/${name}`);
      cy.get('#imageRegistryInput').type(`${repo}/${name}`);
      cy.contains('button', 'Add Tool').should('be.visible').click();
    });
    cy.url().should('contain', toolName);
    cy.get('#publishToolButton').should('be.visible').click();
    cy.wait('@publish');
  });
}

function registerToolOnDockstore(repo: string, name: string) {
  it('register - create tool on Dockstore option', () => {
    storeToken();

    // define routes to watch for
    cy.server();
    // for some reason watching and waiting for all the responses is still flaky
    cy.route('**/containers').as('containers');
    cy.route('**/tokens').as('tokens');
    cy.route('**/user').as('user');
    cy.route('**/extended').as('extended');
    cy.route('**/metadata').as('metadata');
    cy.route('**/dockerRegistryList').as('docker');
    cy.route('**/sourceControlList').as('sourceControl');
    cy.route('**/notifications').as('notifications');

    cy.visit('/my-tools');
    cy.wait('@containers');
    cy.wait('@notifications');
    cy.wait('@tokens');
    cy.wait('@user');
    cy.wait('@extended');
    cy.wait('@metadata');
    cy.wait('@docker');
    cy.wait('@sourceControl');
    cy.wait(hardcodedWaitTime); // The page loads asynchronously, and causes a detached DOM to be grabbed by Cypress. This is a 'fix'.
    cy.get('#register_tool_button').should('be.visible').click();
    cy.get('mat-dialog-content').within(() => {
      cy.contains('mat-radio-button', 'Create tool with descriptor(s) on Dockstore.org').should('be.visible').click();
      cy.contains('button', 'Next').should('be.visible').click();
      cy.get('#hostedImagePath').type(`${repo}/${name}`);
      cy.contains('button', 'Add Tool').should('be.visible').click();
    });
    cy.url().should('contain', toolName);
    // should not be able to publish because there should be no files or versions
    cy.contains('button', 'Publish').should('be.disabled');
  });
}

function testTool(registry: string, repo: string, name: string) {
  describe('Register, publish, unpublish, and delete a tool', () => {
    registerQuayTool(repo, name);
    unpublishTool();
    deleteTool();

    registerRemoteSitesTool(repo, name);
    unpublishTool();
    deleteTool();

    registerToolOnDockstore(repo, name);
    deleteTool();
  });

  // disable test until hiding versions for Tools are working on dev

  // describe('Hide and un-hide a tool version', () => {
  //   registerQuayTool(repo, name);
  //   it('hide a version', () => {
  //     goToTab('Versions');
  //     cy.contains('button', 'Actions').should('be.visible');
  //     cy.contains('td', 'Actions')
  //       .first()
  //       .click();
  //     cy.contains('button', 'Edit').click();
  //     cy.contains('div', 'Hidden:').within(() => {
  //       cy.get('[name=checkbox]').click();
  //     });
  //     cy.contains('button', 'Save Changes').click();
  //     cy.get('[data-cy=hiddenCheck]').should('have.length', 1);
  //   });
  //   it('refresh namespace', () => {
  //     cy.contains('button', 'Refresh Namespace')
  //       .first()
  //       .click();
  //     // check that the 'refresh succeeded' message appears
  //     cy.contains('succeeded');
  //   });
  //   unpublishTool();
  //   deleteTool();
  // });
}

function testWorkflow(registry: string, repo: string, name: string) {
  describe('Refresh, publish, unpublish, and restub a workflow', () => {
    it('refresh and publish', () => {
      storeToken();

      // define routes to watch for
      cy.server();
      cy.route('**/tokens').as('tokens');
      cy.route('**/workflows/path/workflow/**').as('workflow');

      cy.visit(`/my-workflows`);
      cy.wait('@tokens');
      cy.wait('@workflow');

      //  refresh stubbed workflow to full and publish
      cy.route('**/refresh?hardRefresh=false').as('refresh');
      cy.get('[data-cy=refreshButton]').click();
      cy.wait('@refresh');
      cy.route('post', '**/publish').as('publish');
      cy.contains('button', 'Publish').should('be.enabled').click();
      cy.wait('@publish');
    });

    // Test some snapshot and versions stuff
    // WARNING: don't actually snapshot since it can't be undone
    it('snapshot', () => {
      // define routes to watch for
      cy.server();

      goToTab('Versions');

      cy.contains('button', 'Actions').should('be.visible');
      cy.contains('td', 'Actions').first().click();
      cy.get('.mat-menu-content').within(() => {
        cy.contains('button', 'Snapshot');
        cy.contains('button', 'Edit').click();
      });
      cy.contains('button', 'Cancel').click();
    });
    it('unpublish and stub', () => {
      storeToken();
      cy.get('#publishButton').contains('Unpublish').click({ force: true });

      goToTab('Info');
      cy.contains('button', 'Restub').click();
      cy.contains('button', 'Publish').should('be.disabled');
    });
  });
}

function testCollection(org: string, collection: string, registry: string, repo: string, name: string) {
  describe('add entry to and remove from collection', () => {
    registerQuayTool(repo, name);
    it('be able to add an entry to the collection', () => {
      storeToken();
      // define routes to watch for
      cy.server();
      cy.route('post', '**/collections/**').as('postToCollection');
      cy.visit(`/containers/quay.io/${repo}/${name}:develop?tab=info`);
      cy.get('#addToolToCollectionButton').should('be.visible').click();
      cy.get('#addEntryToCollectionButton').should('be.disabled');
      cy.get('#selectOrganization').should('be.visible').click();
      cy.get('mat-option').contains(org).should('be.visible').click();
      cy.get('#addEntryToCollectionButton').should('be.disabled');
      cy.get('#selectCollection').should('be.visible').click();
      cy.get('mat-option').contains(collection).click();
      cy.get('#addEntryToCollectionButton').should('not.be.disabled').click();
      cy.wait('@postToCollection');
      cy.get('#addEntryToCollectionButton').should('not.exist');
      cy.get('mat-progress-bar').should('not.exist');
    });

    it('be able to remove an entry from a collection', () => {
      storeToken();
      cy.server();
      cy.visit(`/organizations/${org}/collections/${collection}`);
      cy.contains(`quay.io/${repo}/${name}`);
      cy.get('#removeEntryButton').should('be.visible').click();
      cy.get('[data-cy=accept-remove-entry-from-org]').should('be.visible').click();
      cy.contains('This collection has no associated entries');
      cy.visit(`/organizations/${org}`);
      cy.contains('Members').should('be.visible');

      cy.route('**/tokens').as('tokens');
      cy.visit('/my-tools');
      cy.wait('@tokens');
    });
    unpublishTool();
    deleteTool();
  });
}

testCollection(collectionTuple[0], collectionTuple[1], toolTuple[0], toolTuple[1], toolTuple[2]);
testTool(toolTuple[0], toolTuple[1], toolTuple[2]);
testWorkflow(workflowTuple[0], workflowTuple[1], workflowTuple[2]);
