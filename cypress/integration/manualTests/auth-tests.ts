describe('Test cypress env token', () => {
  it('register and publish a tool', () => {
    cy.log(Cypress.env('TOKEN'));
    window.localStorage.setItem('ng2-ui-auth_token', Cypress.env('TOKEN'));
    cy.visit('/my-tools');
    // click thru the steps of registering a tool
    cy.get('#register_tool_button').click();
    cy.contains('mat-radio-button', 'Quickly register Quay.io tools').click();
    cy.contains('button', 'Next').click();
    cy.contains('mat-form-field', 'Select namespace').click();
    cy.contains('mat-option', 'emlys').click();
    cy.contains('div', 'dockstore-tool-md5sum').within(() => {
      cy.get('[matTooltip="Refresh on Dockstore"]').click();
    });
    cy.contains('button', 'Finish').click();
    cy.contains('button', 'Publish').click();
  });
  it('unpublish and delete the tool', () => {
    cy.contains('button', 'Unpublish').click();
    cy.contains('button', 'Delete').should('not.be.disabled');
    cy.contains('button', 'Delete').click();
    cy.contains('div', 'Are you sure you wish to delete this tool?').within(() => {
      cy.contains('button', 'Delete').click();
    });
    cy.contains('There are currently no tools registered under this account');
  });
});
