import { goToTab } from '../../../support/commands';

/**
 * To run these on tests you have the following:
 *    1. Base url for cypress must be set to dev.dockstore.net (or if local make sure user is in local database)
 *    2. DockstoreTestUser4 registered on dev.dockstore.net with github and quay accounts linked (at minimum)
 *        -- must have the entries on their github and quay accounts (dockstore-tool-md5sum and hello-dockstore-workflow)
 *    3. Dockstore token for DockstoreTestUser4 must be passed to cypress using the TOKEN environment variable. The token environment variable should
 *    match the target Dockstore stage. DEV_TOKEN, STAGING_TOKEN, and PROD_TOKEN for the respective stages. Cypress env variables must be
 *    prepended with 'CYPRESS_', so to set the token for dev, you would make an environment variable named CYPRESS_DEV_TOKEN.
 *    4. The 'DockstoreAuthTestOrg' dockstore organization must exist with 'SimpleCollection' Collection and DockstoreTestUser4 as member
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
const collectionTuple = ['DockstoreAuthTestOrg', 'SimpleCollection'];
const hardcodedWaitTime = 4000;
const registerAliasName = 'register';
const registerAlias = '@' + registerAliasName;

// get the dockstore token from env variable and put it in local storage
function storeToken() {
  const baseUrl = Cypress.config('baseUrl');
  if (baseUrl === 'https://dockstore.org') {
    window.localStorage.setItem('ng2-ui-auth_token', Cypress.env('PROD_TOKEN'));
  } else if (baseUrl === 'https://staging.dockstore.org') {
    window.localStorage.setItem('ng2-ui-auth_token', Cypress.env('STAGING_TOKEN'));
  } else if (baseUrl === 'https://qa.dockstore.org') {
    window.localStorage.setItem('ng2-ui-auth_token', Cypress.env('QA_TOKEN'));
  } else if (baseUrl === 'https://dev.dockstore.net') {
    window.localStorage.setItem('ng2-ui-auth_token', Cypress.env('DEV_TOKEN'));
  } else {
    window.localStorage.setItem('ng2-ui-auth_token', Cypress.env('LOCAL_TOKEN'));
  }
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
    cy.visit('/my-tools');
    cy.intercept('delete', '**/containers/**').as('containers');
    cy.contains('#deregisterButton', 'Delete').should('be.visible').click();
    cy.contains('div', 'Are you sure you wish to delete this tool?').within(() => {
      cy.contains('button', 'Delete').should('be.visible').click();
    });
    cy.wait('@containers');
    // TODO: Revisit this -- with change to show GitHub orgs with no entries, this got broken
    cy.contains('There are currently no tools registered under this account');
  });
}

function registerQuayTool(repo: string, name: string) {
  it('register and publish - quickly register quay.io tools option', () => {
    storeToken();

    // define routes to watch for
    // get quay.io organization/namespaces accessible to user
    cy.intercept('/api/users/dockerRegistries/quay.io/organizations').as('orgs');
    cy.intercept('**/tokens').as('tokens');
    cy.intercept('**/repositories').as('repos');
    cy.intercept('**/containers').as('containers');
    cy.intercept('post', '**/publish').as('publish');

    cy.visit('/my-tools');
    cy.wait('@tokens');
    // click thru the steps of registering a tool
    cy.get('#register_tool_button').should('be.visible').as(registerAliasName);
    cy.get(registerAlias).click();
    cy.get('mat-dialog-content').within(() => {
      cy.contains('mat-radio-button', 'Quickly register Quay.io tools').click();
      cy.wait('@orgs');
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
    cy.wait(hardcodedWaitTime); // Get disconnected DOM without this
    cy.contains('button', 'Refresh').should('be.visible').click(); // Need to refresh because it sets the default version, which publish needs
    cy.wait(hardcodedWaitTime); // The publish button is enabled even when publishing fails, so we need to wait for the refresh to complete.
    cy.get('#publishToolButton').should('be.visible').click();
    cy.wait('@publish');
  });
}

function registerRemoteSitesTool(repo: string, name: string) {
  it('register and publish - create tool remote sites option', () => {
    storeToken();
    // define routes to watch for
    cy.intercept('post', '**/publish').as('publish');
    cy.intercept('**/tokens').as('tokens');

    cy.visit('/my-tools');
    cy.wait('@tokens');
    cy.wait(hardcodedWaitTime); // The page loads asynchronously, and causes a detached DOM to be grabbed by Cypress. This is a 'fix'.
    cy.get('#register_tool_button').should('be.visible').as(registerAliasName);
    cy.get(registerAlias).click();
    cy.get('mat-dialog-content').within(() => {
      cy.contains('mat-radio-button', 'Create tool with descriptor(s) on remote sites').click();
      cy.wait(1000); // Need previous line to "take effect" before clicking next
      cy.contains('button', 'Next').should('be.visible').click();
      cy.get('#sourceCodeRepositoryInput').type(`${repo}/${name}`);
      cy.get('#imageRegistryInput').type(`${repo}/${name}`);
      cy.contains('button', 'Add Tool').should('be.visible').click();
    });
    cy.url().should('contain', toolName);
    cy.wait(hardcodedWaitTime); // The publish button is enabled even when publishing fails, so we need to wait for the refresh to complete.
    cy.contains('button', 'Refresh').should('be.visible').click(); // Need to refresh because it sets the default version, which publish needs
    cy.get('#publishToolButton').should('be.visible').click();
    cy.wait('@publish');
  });
}

function registerToolOnDockstore(repo: string, name: string) {
  it('register - create tool on Dockstore option', () => {
    storeToken();

    // define routes to watch for
    // for some reason watching and waiting for all the responses is still flaky
    cy.intercept('**/containers').as('containers');
    cy.intercept('**/tokens').as('tokens');
    cy.intercept('**/user').as('user');
    cy.intercept('**/extended').as('extended');
    cy.intercept('**/metadata').as('metadata');
    cy.intercept('**/dockerRegistryList').as('docker');
    cy.intercept('**/sourceControlList').as('sourceControl');
    cy.intercept('**/notifications').as('notifications');

    cy.visit('/my-tools');
    cy.wait('@tokens');
    cy.wait(hardcodedWaitTime); // The page loads asynchronously, and causes a detached DOM to be grabbed by Cypress. This is a 'fix'.
    cy.get('#register_tool_button').should('be.visible').click();
    cy.get('mat-dialog-content').within(() => {
      cy.contains('mat-radio-button', 'Create tool with descriptor(s) on Dockstore.org').should('be.visible').click();
      cy.wait(1000);
      cy.contains('button', 'Next').should('be.visible').click();
      cy.get('#hostedImagePath').type(`${repo}/${name}`);
      cy.contains('button', 'Add Tool').should('be.visible').click();
    });
    cy.url().should('contain', toolName);
    // should not be able to publish because there should be no files or versions
    cy.contains('button', 'Publish').should('be.disabled');
  });
}

function toggleHiddenToolVersion() {
  cy.contains('button', 'Actions').should('be.visible');
  cy.contains('td', 'Actions').first().click();
  cy.contains('button', 'Edit').click();
  cy.contains('div', 'Hidden:').within(() => {
    cy.get('[name=checkbox]').click();
  });
  cy.contains('button', 'Save Changes').click();
}

function toggleHiddenWorkflowVersion() {
  cy.get('[data-cy=versionRow]').last().scrollIntoView().contains('button', 'Actions').should('be.visible').click();
  cy.contains('button', 'Edit').click();
  // TODO: Use [data-cy=hiddenCheck] -- do after 1.14 deployed
  cy.contains('div', 'Hidden:').within(() => {
    cy.get('[name=checkbox]').click();
  });
  cy.contains('button', 'Save Changes').click();
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

  describe('Hide and un-hide a tool version', () => {
    registerQuayTool(repo, name);
    it('hide a version', () => {
      storeToken();
      cy.visit('/my-tools');
      goToTab('Versions');
      toggleHiddenToolVersion();
      cy.get('[data-cy=hiddenCheck]').should('have.length', 1);
      // un-hide and verify
      toggleHiddenToolVersion();
      cy.get('[data-cy=hiddenCheck]').should('not.exist');
    });
    it('refresh namespace', () => {
      storeToken();
      cy.visit('/my-tools');
      cy.contains('button', 'Refresh Namespace').first().click();
      // check that the 'refresh succeeded' message appears
      cy.contains('succeeded');
    });
    unpublishTool();
    deleteTool();
  });
}

function testWorkflow(registry: string, repo: string, name: string) {
  describe('Refresh, publish, unpublish, and restub a workflow', () => {
    it('refresh and publish', () => {
      storeToken();

      // define routes to watch for
      cy.intercept('**/tokens').as('tokens');
      cy.intercept('**/workflows/path/workflow/**').as('workflow');

      cy.visit(`/my-workflows`);
      cy.wait('@tokens');
      cy.wait('@workflow');

      //  refresh stubbed workflow to full and publish
      cy.intercept('**/refresh?hardRefresh=false').as('refresh');
      cy.get('[data-cy=refreshButton]').click();
      cy.wait('@refresh');
      cy.intercept('post', '**/publish').as('publish');
      cy.contains('button', 'Publish').should('be.enabled').click();
      cy.wait('@publish');

      // Test some snapshot and versions stuff
      // WARNING: don't actually snapshot since it can't be undone
      // define routes to watch for

      goToTab('Versions');

      cy.contains('button', 'Actions').should('be.visible');
      cy.contains('td', 'Actions').first().click();
      cy.get('.mat-menu-content').within(() => {
        cy.contains('button', 'Snapshot');
        cy.contains('button', 'Edit').click();
      });
      cy.contains('button', 'Cancel').click();

      storeToken();
      cy.get('#publishButton').contains('Unpublish').click({ force: true });

      goToTab('Info');
      cy.contains('button', 'Restub').click();
      cy.contains('button', 'Publish').should('be.disabled');

      cy.get('[data-cy=refreshButton]').click();
      goToTab('Versions');
      // hide
      toggleHiddenWorkflowVersion();
      cy.get('[data-cy=hidden]').should('have.length', 1);
      // un-hide
      toggleHiddenWorkflowVersion();
      cy.get('[data-cy=hidden]').should('not.exist');
    });
  });
}

function testCollection(org: string, collection: string, registry: string, repo: string, name: string) {
  describe('add entry to and remove from collection', () => {
    registerQuayTool(repo, name);
    it('be able to add an entry to the collection', () => {
      storeToken();
      // define routes to watch for
      cy.intercept('post', '**/collections/**').as('postToCollection');
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
      cy.visit(`/organizations/${org}/collections/${collection}`);
      cy.contains(`quay.io/${repo}/${name}`);
      cy.get('#removeEntryButton').should('be.visible').click();
      cy.get('[data-cy=accept-remove-entry-from-org]').should('be.visible').click();
      cy.contains('This collection has no associated entries');
      cy.visit(`/organizations/${org}`);
      cy.contains('Members').should('be.visible');

      cy.intercept('**/tokens').as('tokens');
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
