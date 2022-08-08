import { ga4ghPath } from '../../../../src/app/shared/constants';
import { goToTab } from '../../../support/commands';
import { ToolDescriptor } from '../../../../src/app/shared/swagger/model/toolDescriptor';

// pairs of [workflow URL without version number, verified version number, another verified version number, workflow.trsUrl]
const workflowVersionTuples = [
  [
    'github.com/dockstore-testing/galaxy-workflow-dockstore-example-2',
    '0.9.6',
    '0.9.7',
    'workflow/github.com/dockstore-testing/galaxy-workflow-dockstore-example-2',
    'Galaxy',
  ],
];

describe('Monitor Galaxy Workflows', () => {
  // This test shouldn't be run for smoke tests as it depends on 'real' entries
  if (Cypress.config('baseUrl') !== 'http://localhost:4200') {
    workflowVersionTuples.forEach((t) => testWorkflow(t[0], t[1], t[2], t[3], t[4]));
  }
});

// Based off ../sharedTests/basic-enduser.ts
function testWorkflow(url: string, version1: string, version2: string, trsUrl: string, type: string) {
  it('info tab works', () => {
    cy.visit('/workflows/' + url + ':' + version1);
    goToTab('Launch');
    cy.url().should('contain', '?tab=launch');
    goToTab('Info');
    cy.url().should('contain', '?tab=info');
    cy.contains('mat-card-header', 'Workflow Information');
  });

  it('versions tab works', () => {
    goToTab('Versions');
    cy.url().should('contain', '?tab=versions');

    // check that clicking on a different version goes to that version's url
    cy.contains('[data-cy=versionName]', version2).click();
    cy.url().should('contain', url + ':' + version2);
  });

  it('files tab works', () => {
    goToTab('Files');
    cy.url().should('contain', '?tab=files');
    cy.contains('Descriptor Files');
    cy.get('.ace_editor').should('be.visible');
    goToTab('Test Parameter Files');
    if (type === ToolDescriptor.TypeEnum.NFL) {
      cy.contains('This version has no files of this type.');
    }
  });

  it('tools tab works', () => {
    goToTab('Tools');
    cy.url().should('contain', '?tab=tools');
  });

  it('DAG tab works', () => {
    /// New material have to click twice
    cy.contains('.mat-tab-label', 'DAG').click();
    cy.contains('.mat-tab-label', 'DAG').click();
    cy.url().should('contain', '?tab=dag');
    cy.get('[data-cy=dag-holder]').children().should('have.length.of.at.least', 1);
  });

  if (type === 'Galaxy') {
    it('test that galaxy button exists', () => {
      cy.get('[data-cy=galaxyLaunchWith] button').should('exist');
      cy.get('[data-cy=galaxyLaunchWith] button').click();
      cy.get('[data-cy=multiCloudLaunchOption]').should('have.length.of.at.least', 1);
      cy.get('[data-cy=multiCloudLaunchOption]').should('contain', 'usegalaxy.org');
      cy.get('[data-cy=multiCloudLaunchOption]').each(($el, index) => {
        cy.wrap($el).click();
        cy.get(`[data-cy=multiCloudLaunchButton]`)
          .invoke('attr', 'href')
          .should('contain', trsUrl)
          .should('contain', $el.text().trim().split(' ')[0]);
        // .trim().split(' ')[0]) is required as $el.text() can be equal to " usegalaxy.org (Main) "
      });
      const testUrl = 'https://www.test.com';
      cy.get('[data-cy=multiCloudLaunchText]').type(testUrl);
      cy.get('[data-cy=multiCloudLaunchText]').click();
      cy.get(`[data-cy=multiCloudLaunchButton]`).invoke('attr', 'href').should('contain', trsUrl).should('contain', testUrl);
    });
  }
}
