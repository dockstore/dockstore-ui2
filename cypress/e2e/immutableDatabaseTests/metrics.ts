import { goToTab, isActiveTab, setTokenUserViewPort } from '../../support/commands';

describe('Dockstore Metrics', () => {
  setTokenUserViewPort();
  it('Should see No Metrics banner', () => {
    cy.visit('/workflows/github.com/A/l:master?tab=executions');
    cy.get('[data-cy=no-metrics-banner]').should('be.visible');
  });
  // cy.fixture('sampleMetrics.json').then((json) => {
  //   cy.intercept('GET', '*/api/ga4gh/v2/extended/{id}/versions/master/aggregatedMetrics', {
  //     body: json,
  //     statusCode: 200,
  //   });
  // });
});
