import { ga4ghPath } from '../../../../src/app/shared/constants';
import { goToTab } from '../../../support/commands';

// pairs of [workflow URL without version number, verified version number, another verified version number, workflow.trsUrl]
const workflowVersionTuples = [
  [
    'github.com/briandoconnor/dockstore-workflow-md5sum/dockstore-wdl-workflow-md5sum',
    '1.4.0',
    'develop',
    window.location.origin +
      '/api' +
      ga4ghPath +
      '/tools/%23workflow%2Fgithub.com%2Fbriandoconnor%2Fdockstore-workflow-md5sum%2Fdockstore-wdl-workflow-md5sum/versions/develop',
    'WDL',
  ],
  [
    'github.com/NCI-GDC/gdc-dnaseq-cwl/GDC_DNASeq',
    'dev',
    'master',
    window.location.origin + '/api' + ga4ghPath + '/tools/%23workflow%2Fgithub.com%2FNCI-GDC%2Fgdc-dnaseq-cwl%2FGDC_DNASeq/versions/master',
    'CWL',
  ],
  ['github.com/nf-core/vipr', 'dev', 'master', '', 'NFL'],
];
describe('Monitor workflows', () => {
  workflowVersionTuples.forEach((t) => testWorkflow(t[0], t[1], t[2], t[3], t[4]));
});
function testWorkflow(url: string, version1: string, version2: string, trsUrl: string, type: string) {
  it('info tab works', () => {
    cy.visit('/workflows/' + url + ':' + version1);
    goToTab('Launch');
    cy.url().should('contain', '?tab=launch');
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
    cy.get('[data-cy=descriptorFiles]');
    goToTab('Test Parameter Files');
    if (type === 'NFL') {
      cy.contains('Nextflow does not have the concept of a test parameter file.');
    } else {
      cy.get('[data-cy=testParamFiles]');
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

  let launchWithTuples: any[] = [];
  if (type === 'WDL') {
    it('get the img icons', () => {
      cy.get('[data-cy=dnanexusLaunchWith] svg').should('exist');
      cy.get('[data-cy=terraLaunchWith] svg').should('exist');
      cy.get('[data-cy=anvilLaunchWith] svg').should('exist');
    });
  }
  if (type === 'CWL') {
    launchWithTuples = [
      // pairs of [launch button text, expected href]
      ['cgcLaunchWith', '?trs=' + trsUrl],
      ['nhlbiLaunchWith', '?trs=' + trsUrl],
      ['cavaticaLaunchWith', '?trs=' + trsUrl],
    ];
  } else if (type === 'WDL') {
    launchWithTuples = [
      // pairs of [launch button text, expected href]
      ['dnanexusLaunchWith', '?source=' + trsUrl],
      ['terraLaunchWith', url + ':' + version2],
      ['anvilLaunchWith', url + ':' + version2],
      ['nhlbiLaunchWith', url + ':' + version2],
    ];
  } else if (type === 'NFL') {
    launchWithTuples = [['nextflowtowerLaunchWith', url + '&revision=' + version2]];
  } else {
    launchWithTuples = [];
  }

  // click on each launch button and confirm the url changes
  launchWithTuples.forEach((t) => {
    it('launch with buttons go to external site', () => {
      cy.get('[data-cy=' + t[0] + ']').should(($el) => {
        // @ts-ignore
        expect($el.attr('href')).to.contain(t[1]);
      });
    });
  });
}
