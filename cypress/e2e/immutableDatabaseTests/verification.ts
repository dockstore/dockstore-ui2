import { ga4ghExtendedPath } from '../../../src/app/shared/constants';
import { Dockstore } from '../../../src/app/shared/dockstore.model';
import { setTokenUserViewPort } from '../../support/commands';

describe('See verification information and logs', () => {
  setTokenUserViewPort();
  it('should see logs', () => {
    cy.exec(
      `curl -X POST "${Dockstore.API_URI}${ga4ghExtendedPath}/quay.io%2Fgaryluu%2Fdockstore-cgpmap%2Fcgpmap-cramOut/versions/3.0.0-rc8/CWL/tests/..%2Fexamples%2Fcgpmap%2FcramOut%2Ffastq_gz_input.json?platform=Dockstore%20CLI&platform_version=1.6.0&verified=true&metadata=Potato" -H "accept: application/json" -H "Authorization: Bearer imamafakedockstoretoken2"`
    );
    cy.fixture('toolTesterLogs').then((json) => {
      cy.intercept('GET', `${Dockstore.API_URI}/toolTester/logs/**`, {
        body: json,
      });
    });
    cy.visit(Cypress.config().baseUrl + '/containers/quay.io/garyluu/dockstore-cgpmap/cgpmap-cramOut:3.0.0-rc8?tab=info');

    cy.url().should('eq', Cypress.config().baseUrl + '/containers/quay.io/garyluu/dockstore-cgpmap/cgpmap-cramOut:3.0.0-rc8?tab=info');
    cy.get('[data-cy=verificationLogsDialog]').click();
    cy.get('[data-cy=fulllog]').should(
      'have.attr',
      'href',
      `${Dockstore.API_URI}/toolTester/logs?tool_id=quay.io%2Fgaryluu%2Fdockstore-cgpmap%2Fcgpmap-cramOut&tool_version_name=3.0.0-rc8&test_filename=Dockerfile&runner=cwl-runner&log_type=FULL&filename=1554477718978.log`
    );
  });
});
