import { LambdaEvent } from '../../../src/app/shared/openapi';
import { goToTab, insertAppTools, isActiveTab, resetDB, setTokenUserViewPort, typeInInput } from '../../support/commands';

describe('GitHub App Tools', () => {
  resetDB();
  insertAppTools();
  setTokenUserViewPort();

  function selectUnpublishedTab(org: string) {
    cy.get('#tool-path').should('be.visible');
    cy.get('mat-expansion-panel-header')
      .contains(org)
      .parentsUntil('mat-accordion')
      .should('be.visible')
      .contains('.mat-tab-label-content', 'Unpublished')
      .should('be.visible')
      .click();
  }

  function selectUnpublishedGitHubAppTab(org: string) {
    cy.get('#workflow-path').should('be.visible');
    cy.get('mat-expansion-panel-header')
      .contains(org)
      .parentsUntil('mat-accordion')
      .should('be.visible')
      .contains('.mat-tab-label-content', 'Unpublished')
      .click();
  }

  function selectGitHubAppTool(tool: string) {
    cy.get('#workflow-path').should('be.visible');
    cy.wait(5000);
    const alias = 'thetool';
    cy.contains('div .no-wrap', tool).should('be.visible').as(alias);
    // Cypress recommends using an alias like this to get around element being re-rendered
    cy.get('@' + alias).click();
    cy.get('#workflow-path').contains(tool);
  }

  describe('User Page', () => {
    it('Admins should see user GitHub app logs', () => {
      cy.visit('/users/user_A');
      const mockEvent: LambdaEvent[] = [
        {
          deliveryId: '1',
          entryName: 'entry1',
          eventDate: 1582165220000,
          githubUsername: 'testUser',
          id: 1,
          ignored: false,
          message: 'HTTP 400 ',
          organization: 'C',
          reference: 'refs/head/main',
          repository: 'test-github-app-tools',
          success: false,
          type: 'PUSH',
        },
        {
          deliveryId: '2',
          entryName: 'entry2',
          eventDate: 1582165220000,
          githubUsername: 'testUser',
          id: 1,
          ignored: false,
          message: 'HTTP 400 ',
          organization: 'C',
          reference: 'refs/head/main',
          repository: 'test-github-app-tools',
          success: false,
          type: 'PUSH',
        },
      ];
      cy.intercept('GET', '/api/lambdaEvents/user/**', {
        body: mockEvent,
        headers: {
          'X-total-count': '2',
        },
      }).as('lambdaEvents');
      cy.get('[data-cy=user-app-logs-button]').should('be.visible').click();
      cy.contains('refs/head/main');
      cy.contains('1 – 2 of 2');
      cy.contains('Close').click();
    });
  });

  describe('My Tools', () => {
    it('Side Bar', () => {
      cy.visit('/my-tools');

      // Registration
      cy.get('#register_tool_button').click();
      cy.contains('Register using GitHub Apps');
      cy.get('#GitHubApps-register-workflow-option').click();

      cy.contains('Install our GitHub App in');
      cy.get('.modal-footer').contains('Next').first().click();
      cy.get('[data-cy=install-dockstore-app]');
      cy.contains('Tool storage type').click();
      cy.contains('Close').click();

      // GitHub App Logs
      cy.contains('Apps Logs').click();
      cy.contains('There were problems retrieving the GitHub App logs for this organization.');
      cy.contains('Close').click();
      cy.intercept('GET', '/api/lambdaEvents/**', {
        body: [],
      }).as('lambdaEvents');
      cy.contains('Apps Logs').click();
      cy.contains('There are no GitHub App logs for this organization.');
      cy.contains('Close').click();

      const realResponse: LambdaEvent[] = [
        {
          deliveryId: '1',
          entryName: 'entry1',
          eventDate: 1582165220000,
          githubUsername: 'testUser',
          id: 1,
          ignored: false,
          message: 'HTTP 418 ',
          organization: 'C',
          reference: 'refs/head/main',
          repository: 'test-github-app-tools',
          success: true,
          type: 'PUSH',
        },
      ];
      cy.intercept('GET', '/api/lambdaEvents/**', {
        body: realResponse,
        headers: {
          'X-total-count': '1',
        },
      }).as('lambdaEvents');
      cy.contains('Apps Logs').click();

      // Check that app logs contain the correct columns
      const appLogColumns = [
        'Date',
        'GitHub Username',
        'Entry Name',
        'Delivery ID',
        'Organization',
        'Repository',
        'Reference',
        'Success',
        'Type',
      ];
      appLogColumns.forEach((column) => cy.contains(column));

      cy.contains('1 – 1 of 1');
      cy.contains('Close').click();

      selectGitHubAppTool('test-github-app-tools/testing');
      cy.get('#publishButton').should('not.be.disabled');
      cy.get('#publishButton').contains('Unpublish');
      cy.get('[data-cy=viewPublicWorkflowButton]').should('not.be.disabled');
      cy.get('[data-cy=refreshButton]').should('not.exist');

      goToTab('Info');
      isActiveTab('Info');

      // Add tests once fixed.
      goToTab('Launch');
      isActiveTab('Launch');

      goToTab('Versions');
      isActiveTab('Versions');
      cy.get('table>tbody>tr').should('have.length', 1);
      cy.contains('button', 'Actions').scrollIntoView().should('be.visible').click();
      cy.contains('button', 'Refresh Version').should('be.disabled');

      // Fix hiding a version. You have to refresh the page to see that it was hidden in the table
      cy.contains('Edit Info').click();
      cy.contains('Edit Tool');
      cy.contains('Tool Path');
      cy.get('[type="checkbox"]').check();
      cy.get('[data-cy=save-version]').click();
      cy.get('[data-cy=valid').should('exist');
      cy.get('[data-cy=hidden').should('exist');
      cy.contains('button', 'Actions').scrollIntoView().should('be.visible').click();
      cy.contains('Edit Info').click();
      cy.get('[type="checkbox"]').uncheck();
      cy.get('[data-cy=save-version]').click();
      cy.get('[data-cy=hidden').should('not.exist');

      goToTab('Files');
      isActiveTab('Files');
      cy.contains('tools/Dockstore.cwl');
      cy.contains('class: CommandLineTool');
      cy.get('[data-cy=download-file]')
        .invoke('attr', 'href')
        .then((href) => {
          cy.request(href as string)
            .its('status')
            .should('eq', 200);
        });
      goToTab('Configuration');
      cy.contains('Configuration');
      cy.contains('/.dockstore.yml');

      selectUnpublishedGitHubAppTab('C');
      selectGitHubAppTool('test-github-app-tools/md5sum');
      cy.get('#publishButton').should('not.be.disabled');
      cy.get('[data-cy=viewPublicWorkflowButton]').should('not.exist');
      cy.get('#publishButton').should('be.visible').contains('Publish').click();
      cy.contains('Default Version Required');
      cy.get('[data-cy=close-dialog-button]').click();
      goToTab('Versions');
      cy.contains('button', 'Actions').scrollIntoView().should('be.visible').click();
      cy.contains('button', 'Set as Default Version').should('be.visible').click();
      cy.wait(500);
      cy.get('#publishButton').should('not.be.disabled');
      cy.get('#publishButton').should('be.visible').contains('Publish').click();

      // Fix that the entry list on the left doesn't update without refreshing the page
      selectGitHubAppTool('test-github-app-tools/testing');

      selectGitHubAppTool('test-github-app-tools/md5sum');
      cy.get('[data-cy=viewPublicWorkflowButton]').click();

      // Look for something that is on public page that is not in My Tools; avoids detached DOM when clicking on versions below; also
      // ensures the subsequent checks below are checking the public page and not the My Tools Page
      cy.get('app-launch-third-party');

      cy.get('[data-cy=tool-icon]').should('exist');
      cy.contains('Tool Information');
      cy.contains('Tool Version Information');
      cy.get('[data-cy=workflowTitle]').contains('github.com/C/test-github-app-tools/md5sum:invalidTool');
      goToTab('Versions');
      cy.contains('main').click();
      cy.get('[data-cy=workflowTitle]').contains('github.com/C/test-github-app-tools/md5sum:main');
      cy.get('#starringButton').click();
      cy.get('#starCountButton').should('contain', '1');
      goToTab('Info');
      cy.get('[data-cy=trs-link]').contains('TRS: github.com/C/test-github-app-tools/md5sum');

      // Confirm that an ignored event is displayed correctly.
      realResponse[0].ignored = true;
      cy.intercept('GET', '/api/lambdaEvents/**', {
        body: realResponse,
      }).as('lambdaEvents');
      cy.visit('/my-tools');
      cy.contains('Apps Logs').click();
      cy.contains('Ignored');
    });

    it('Table view', () => {
      cy.visit('/apptools');
      cy.url().should('contain', 'apptools');
      cy.contains('Search app tools');
      cy.get('[data-cy=entry-link]').should('contain', 'test-github-app-tools');
    });
  });
});
