describe('Test cypress env token', () => {
  it('is accessible in the browser', () => {
    cy.log(Cypress.env('TOKEN'));
    window.localStorage.setItem('ng2-ui-auth_token', Cypress.env('TOKEN'));
    cy.visit('/my-tools');
    cy.contains('button', 'Add Tool').click();
    cy.contains('mat-radio-button', 'Quickly register Quay.io tools').click();
    cy.contains('button', 'Next').click();
    cy.get('[data-cy=dropdownOrg]')
      .first()
      .click();
  });
});
