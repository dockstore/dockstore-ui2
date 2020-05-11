describe('Test cypress env token', () => {
  it('is accessible in the browser', () => {
    cy.log(Cypress.env('TOKEN'));
  });
});
