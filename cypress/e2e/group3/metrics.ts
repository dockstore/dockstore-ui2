import { goToMetricsTab, goToVersionsTab, insertNotebooks, resetDB, setTokenUserViewPort } from '../../support/commands';

describe('Dockstore Metrics', () => {
  resetDB();
  insertNotebooks();
  setTokenUserViewPort();
  it('Should see no metrics banner', () => {
    cy.visit('/workflows/github.com/A/l:master');
    goToMetricsTab();
    cy.get('[data-cy=no-metrics-banner]').should('be.visible');

    cy.visit('/notebooks/github.com/dockstore-testing/simple-notebook');
    goToMetricsTab();
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
    cy.fixture('versionWithMetrics.json').then((json) => {
      cy.intercept('GET', '/api/workflows/published/11/workflowVersions?limit=10&offset=0&sortOrder=desc&include=metrics', {
        body: json,
        statusCode: 200,
      }).as('getVersionWithMetrics');
    });
    cy.wait('@getVersionWithMetrics');
    goToVersionsTab();

    cy.wait('@getMetrics');
    goToMetricsTab();

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
    // Successful status is selected by default
    cy.get('[data-cy=metrics-execution-status-dropdown]').should('contain', 'Successful');
    cy.get('[data-cy=execution-metrics-table]').should('be.visible');
    cy.get('[data-cy=execution-metrics-table]').contains('td', 'Not Available').should('not.exist');
    cy.get('[data-cy=metrics-partner-dropdown]').should('contain', 'AGC');
    cy.get('[data-cy=execution-metrics-total-executions-div]').should('contain', 4);
    cy.get('[data-cy=validations-table]').should('not.exist');
    // Change execution status to All Statuses
    cy.get('[data-cy=metrics-execution-status-dropdown]').click();
    cy.get('[data-cy=metrics-execution-status-options]').contains('All Statuses').click();
    cy.get('[data-cy=metrics-execution-status-dropdown]').should('contain', 'All Statuses');
    cy.get('[data-cy=execution-metrics-table]').should('be.visible');
    cy.get('[data-cy=execution-metrics-table]').contains('td', 'Not Available').should('not.exist');
    // Change execution status to FAILED_RUNTIME_INVALID
    cy.get('[data-cy=metrics-execution-status-dropdown]').click();
    cy.get('[data-cy=metrics-execution-status-options]').contains('Failed Runtime Invalid').click();
    cy.get('[data-cy=metrics-execution-status-dropdown]').should('contain', 'Failed Runtime Invalid');
    cy.get('[data-cy=execution-metrics-table]').should('exist');
    cy.get('[data-cy=execution-metrics-table]').contains('td', 'Not Available').should('be.visible'); // There were no other metrics for the FAILED_RUNTIME_INVALID executions
  });

  it('Should not see metrics checked on versions table if no metrics', () => {
    cy.visit('/my-workflows/github.com/A/l:master');
    goToVersionsTab();
    cy.get('[data-cy=metrics]').should('not.exist');
  });
});
