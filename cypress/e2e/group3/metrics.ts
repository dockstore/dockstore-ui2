import { goToTab, insertNotebooks, resetDB, setTokenUserViewPort } from '../../support/commands';

describe('Dockstore Metrics', () => {
  resetDB();
  insertNotebooks();
  setTokenUserViewPort();
  it('Should see no metrics banner', () => {
    cy.visit('/workflows/github.com/A/l:master');
    goToTab('Metrics');
    cy.get('[data-cy=no-metrics-banner]').should('be.visible');

    cy.visit('/notebooks/github.com/dockstore-testing/simple-notebook');
    goToTab('Metrics');
    cy.get('[data-cy=no-metrics-banner]').should('be.visible');
  });

  it('Should see metrics data', () => {
    cy.fixture('sampleMetrics.json').then((json) => {
      cy.intercept('GET', '*/api/ga4gh/v2/extended/*/versions/*/aggregatedMetrics', {
        body: json,
        statusCode: 200,
      }).as('getMetrics');
    });
    cy.visit('/workflows/github.com/A/l:master');
    cy.wait('@getMetrics');
    goToTab('Metrics');

    cy.get('[data-cy=no-metrics-banner]').should('not.exist');
    cy.get('[data-cy=metrics-partner-dropdown]').should('contain', 'All Platforms');
    cy.get('[data-cy=execution-metrics-table]').should('be.visible');
    cy.get('[data-cy=execution-metrics-total-executions-div]').should('contain', 9);
    cy.get('[data-cy=validations-table]').should('be.visible');
    cy.get('[data-cy=metrics-validator-tool-dropdown]').should('contain', 'MINIWDL');
    cy.get('[data-cy=metrics-validator-tool-dropdown]').click();
    cy.get('[data-cy=metrics-validator-tool-options]').should('contain', 'WOMTOOL');
    cy.get('[data-cy=metrics-validator-tool-options]').contains('WOMTOOL').click();
    cy.get('[data-cy=validations-table]').should('be.visible');
    // Change partner to Galaxy, which only has validator tool metrics
    cy.get('[data-cy=metrics-partner-dropdown]').click();
    cy.get('[data-cy=metrics-partner-options]').contains('Galaxy').click();
    cy.get('[data-cy=metrics-partner-dropdown]').should('contain', 'Galaxy');
    cy.get('[data-cy=execution-metrics-table]').should('not.exist');
    cy.get('[data-cy=execution-metrics-total-executions-div]').should('not.exist');
    cy.get('[data-cy=validations-table]').should('be.visible');
    cy.get('[data-cy=metrics-validator-tool-dropdown]').should('contain', 'MINIWDL');
    cy.get('[data-cy=metrics-validator-tool-dropdown]').click();
    cy.get('[data-cy=metrics-validator-tool-options]').should('contain', 'WOMTOOL');
    cy.get('[data-cy=metrics-validator-tool-options]').contains('WOMTOOL').click();
    cy.get('[data-cy=validations-table]').should('be.visible');
    cy.get('[data-cy=metrics-partner-dropdown]').click();
    //change partner to AGC
    cy.get('[data-cy=metrics-partner-options]').contains('AGC').click();
    cy.get('[data-cy=execution-metrics-table]').should('be.visible');
    cy.get('[data-cy=metrics-partner-dropdown]').should('contain', 'AGC');
    cy.get('[data-cy=execution-metrics-total-executions-div]').should('contain', 4);
    cy.get('[data-cy=validations-table]').should('not.exist');
  });

  it('Should not see metrics checked on versions table if no metrics', () => {
    cy.visit('/my-workflows/github.com/A/l:master');
    goToTab('Versions');
    cy.get('[data-cy=metrics]').should('not.exist');
  });
});
