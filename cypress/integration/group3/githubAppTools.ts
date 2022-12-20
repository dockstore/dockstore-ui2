import { LambdaEvent } from '../../../src/app/shared/swagger';
import { goToTab, insertAppTools, isActiveTab, resetDB, setTokenUserViewPort } from '../../support/commands';

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
    cy.contains('div .no-wrap', tool).should('be.visible').click();
    cy.get('#workflow-path').contains(tool);
  }

  describe('My Tools', () => {
    it('Side Bar', () => {
      cy.visit('/my-tools');

      // Registration
      cy.get('#register_tool_button').click();
      cy.contains('Register using GitHub Apps');
      cy.get('#GitHubApps-register-workflow-option').click();
      cy.contains('Install our GitHub App on your');
      cy.get('.modal-footer').contains('Next').first().click();
      cy.contains('Navigate to GitHub to install our GitHub app');
      cy.contains('Tool storage type').click();
      cy.contains('Close').click();

      // GitHub App Logs
      cy.contains('Apps Logs').click();
      cy.contains('There were problems retrieving GitHub App logs for this organization.');
      cy.contains('Close').click();
      cy.intercept({
        method: 'GET',
        url: '/api/lambdaEvents/**',
        response: [],
      }).as('lambdaEvents');
      cy.contains('Apps Logs').click();
      cy.contains('There are no GitHub App logs for this organization.');
      cy.contains('Close').click();

      const realResponse: LambdaEvent[] = [
        {
          eventDate: 1582165220000,
          githubUsername: 'testUser',
          id: 1,
          message: 'HTTP 418 ',
          organization: 'C',
          reference: 'refs/head/main',
          repository: 'test-github-app-tools',
          success: true,
          type: 'PUSH',
        },
      ];
      cy.intercept({
        method: 'GET',
        url: '/api/lambdaEvents/**',
        response: realResponse,
      }).as('lambdaEvents');
      cy.contains('Apps Logs').click();
      cy.contains('1 – 1 of 1');
      cy.contains('Close').click();
    });

    it('GitHub Tool Private View', () => {
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
      cy.contains('button', 'Actions').should('be.visible').click();
      cy.contains('button', 'Refresh Version').should('be.disabled');

      // Fix hiding a version. You have to refresh the page to see that it was hidden in the table
      cy.contains('Edit').click();
      cy.contains('Edit Tool');
      cy.contains('Tool Path');
      cy.get('[type="checkbox"]').check();
      cy.get('[data-cy=save-version]').click();
      cy.get('[data-cy=valid').should('exist');
      cy.get('[data-cy=hidden').should('exist');
      cy.contains('button', 'Actions').should('be.visible').click();
      cy.contains('Edit').click();
      cy.get('[type="checkbox"]').uncheck();
      cy.get('[data-cy=save-version]').click();
      cy.get('[data-cy=hidden').should('not.exist');

      goToTab('Files');
      isActiveTab('Files');
      cy.contains('tools/Dockstore.cwl');
      cy.contains('class: CommandLineTool');
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
      cy.contains('button', 'Actions').should('be.visible').click();
      cy.contains('button', 'Set as Default Version').should('be.visible').click();
      cy.wait(500);
      cy.get('#publishButton').should('not.be.disabled');
      cy.get('#publishButton').should('be.visible').contains('Publish').click();

      // Fix that the entry list on the left doesn't update without refreshing the page
      selectGitHubAppTool('test-github-app-tools/testing');
    });

    it('Public view', () => {
      selectGitHubAppTool('test-github-app-tools/md5sum');
      cy.get('[data-cy=viewPublicWorkflowButton]').click();
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
    });

    it('Table view', () => {
      cy.visit('/apptools');
      cy.url().should('contain', 'apptools');
      cy.contains('Search app tools');
      cy.get('[data-cy=entry-link]').should('contain', 'test-github-app-tools');
    });
  });
});
