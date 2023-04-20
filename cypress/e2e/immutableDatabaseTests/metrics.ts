import { goToTab, setTokenUserViewPort } from '../../support/commands';

describe('Dockstore Metrics', () => {
  setTokenUserViewPort();
  it('Should see no metrics banner', () => {
    cy.visit('/workflows/github.com/A/l:master?metrics');
    cy.get('.mat-tab-header-pagination-after').click();
    goToTab('Executions');
    cy.get('[data-cy=no-metrics-banner]').should('be.visible');
  });

  it('Should see metrics data', () => {
    cy.fixture('sampleMetrics.json').then((json) => {
      cy.intercept('GET', '*/api/ga4gh/v2/extended/*/versions/*/aggregatedMetrics', {
        body: json,
        statusCode: 200,
      }).as('getMetrics');
    });
    cy.visit('/workflows/github.com/A/l:master?metrics');
    cy.get('.mat-tab-header-pagination-after').click();
    cy.wait('@getMetrics');
    goToTab('Executions');

    cy.get('[data-cy=no-metrics-banner]').should('not.exist');
    cy.get('[data-cy=metrics-partner-dropdown]').should('contain', 'DNA_STACK');
    cy.get('[data-cy=metrics-table]').should('be.visible');
    cy.get('[data-cy=metrics-total-executions-div]').should('contain', 39);
    cy.get('[data-cy=validations-table]').should('be.visible');
    cy.get('[data-cy=metrics-validatorTool]').should('contain', 'MINIWDL');
    cy.get('[data-cy=validations-mostRecentErrorMessage-col]').should('be.visible');
    cy.get('[data-cy=metrics-partner-dropdown]').click();
    //change partner to AGC
    cy.get('[data-cy=metrics-partner-options]').contains('AGC').click();
    cy.get('[data-cy=metrics-table]').should('be.visible');
    cy.get('[data-cy=metrics-partner-dropdown]').should('contain', 'AGC');
    cy.get('[data-cy=metrics-total-executions-div]').should('contain', 7);
    cy.get('[data-cy=metrics-validatorTool]').should('contain', 'CWLTOOL');
    cy.get('[data-cy=validations-mostRecentErrorMessage-col]').should('not.exist'); //since the most recent run was valid, there shouldn't be an error message column
  });
});
