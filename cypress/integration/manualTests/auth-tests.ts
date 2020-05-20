function unpublishTool() {
  it('unpublish the tool', () => {
    cy.contains('button', 'Unpublish').should('not.be.disabled');
    cy.contains('button', 'Unpublish').click();
  });
}

function deleteTool() {
  it('delete the tool', () => {
    cy.contains('button', 'Delete').should('not.be.disabled');
    cy.contains('button', 'Delete').click();
    cy.contains('div', 'Are you sure you wish to delete this tool?').within(() => {
      cy.contains('button', 'Delete').click();
    });
    cy.contains('There are currently no tools registered under this account');
  });
}
describe('Register, publish, unpublish, and delete a tool', () => {
  it('register and publish - quickly register quay.io tools option', () => {
    cy.log(Cypress.env('TOKEN'));
    window.localStorage.setItem('ng2-ui-auth_token', Cypress.env('TOKEN'));
    cy.visit('/my-tools');
    // click thru the steps of registering a tool
    cy.get('#register_tool_button').should('not.be.disabled');
    cy.get('#register_tool_button').click();
    cy.get('mat-dialog-content').within(() => {
      cy.contains('mat-radio-button', 'Quickly register Quay.io tools').click();
      cy.contains('button', 'Next').click();
      cy.contains('mat-form-field', 'Select namespace').click();
    });
    cy.contains('mat-option', 'emlys').click();
    cy.contains('div', 'dockstore-tool-md5sum').within(() => {
      cy.get('[matTooltip="Refresh on Dockstore"]').click();
    });
    cy.contains('button', 'Finish').click();
    cy.contains('button', 'Publish').click();
  });
  unpublishTool();
  deleteTool();

  it('register and publish - create tool remote sites option', () => {
    cy.log(Cypress.env('TOKEN'));
    window.localStorage.setItem('ng2-ui-auth_token', Cypress.env('TOKEN'));
    cy.visit('/my-tools');
    // click thru the steps of registering a tool
    cy.get('#register_tool_button').click();
    cy.get('mat-dialog-content').within(() => {
      cy.contains('mat-radio-button', 'Create tool with descriptor(s) on remote sites').click();
      cy.contains('button', 'Next').click();
      cy.get('#sourceCodeRepositoryInput').type('emlys/dockstore-tool-md5sum');
      cy.get('#imageRegistryInput').type('emlys/dockstore-tool-md5sum');
      cy.contains('button', 'Add Tool').click();
    });
    cy.contains('button', 'Publish').click();
  });
  unpublishTool();
  deleteTool();

  it('register - create tool on Dockstore option', () => {
    cy.log(Cypress.env('TOKEN'));
    window.localStorage.setItem('ng2-ui-auth_token', Cypress.env('TOKEN'));
    cy.get('#register_tool_button').click();
    cy.get('mat-dialog-content').within(() => {
      cy.contains('mat-radio-button', 'Create tool with descriptor(s) on Dockstore.org').click();
      cy.contains('button', 'Next').click();
      cy.get('#hostedImagePath').type('emlys/dockstore-tool-md5sum');
      cy.contains('button', 'Add Tool').click();
    });
    // should not be able to publish because there should be no files or versions
    cy.contains('button', 'Publish').should('be.disabled');
  });
  deleteTool();
});
