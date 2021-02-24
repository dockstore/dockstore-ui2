describe('Test existence of Logs', () => {
  it('Find Logs in Workflows', () => {
    cy.visit('/workflows/github.com/DataBiosphere/topmed-workflows/UM_variant_caller_wdl:1.32.0?tab=info');
    cy.get('[data-cy=verificationLogsDialog]').click();

    cy.contains('.mat-card-title', 'Verification Information');
    cy.get('.mat-table')
      .first()
      .within(() => {
        cy.get('.mat-row').should('have.length.of.at.least', 1);
        cy.contains('Dockstore CLI');
      });

    cy.contains('.mat-card-title', 'Logs');
    cy.get('.mat-table')
      .eq(1)
      .within(() => {
        cy.get('.mat-row').should('have.length.of.at.least', 3);
        cy.contains('variant-caller/variant-caller-wdl/topmed_freeze3_calling.json');
        cy.contains('View FULL log');
      });
  });
});
