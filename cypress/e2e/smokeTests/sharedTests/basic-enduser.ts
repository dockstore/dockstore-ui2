import { ga4ghPath } from '../../../../src/app/shared/constants';
import { ToolDescriptor } from '../../../../src/app/shared/openapi';
import { goToTab, checkFeaturedContent, checkNewsAndUpdates, checkMastodonFeed } from '../../../support/commands';

// Test an entry, these should be ambiguous between tools, workflows, and notebooks.
describe('run stochastic smoke test', () => {
  testEntry('Tools');
  testEntry('Workflows');
  testEntry('Notebooks');
});
function testEntry(tab: string) {
  function goToRandomEntry() {
    cy.visit('/search');
    cy.get('[data-cy=workflowColumn] a');
    goToTab(tab);
    const linkName = getLinkName(tab);
    // select a random entry on the first page and navigate to it
    let chosen_index = 0;
    cy.get('[data-cy=' + linkName + ']')
      .then(($list) => {
        chosen_index = Math.floor(Math.random() * $list.length);
      })
      .eq(chosen_index)
      .within(() => {
        cy.get('a').then((el) => {
          cy.log(el.prop('href')); // log the href in case a test fails
          cy.visit(el.prop('href'));
        });
      });
  }

  it('check info tab', () => {
    goToRandomEntry();
    goToTab('Info');
    // test export to zip button
    cy.get('[data-cy=downloadZip]').within(() => {
      cy.get('a').then((el) => {
        cy.request(el.prop('href')).its('status').should('eq', 200);
      });
    });
  });

  it('check files tab', () => {
    goToRandomEntry();
    goToTab('Files');
    cy.url().should('contain', '?tab=files');
    cy.contains(tab === 'Notebooks' ? 'Notebook Files' : 'Descriptor Files');
  });

  it('check versions tab', () => {
    goToRandomEntry();
    goToTab('Versions');
    cy.url().should('contain', '?tab=versions');
    cy.get('[data-cy=versionRow]').should('have.length.of.at.least', 1);
  });
}

function getLinkName(tab: string): string {
  switch (tab) {
    case 'Tools':
      return 'toolNames';
    case 'Workflows':
      return 'workflowColumn';
    case 'Notebooks':
      return 'notebookColumn';
    default:
      throw new Error('unknown tab');
  }
}

function isStagingOrProd() {
  const baseUrl = Cypress.config('baseUrl');
  return baseUrl === 'https://staging.dockstore.org' || baseUrl === 'https://dockstore.org';
}

describe('Check organizations page', () => {
  it('has multiple organizations and org with content', () => {
    cy.visit('/');
    cy.contains('a', 'Organizations').click();
    cy.url().should('contain', '/organizations');
    cy.get('[data-cy=orgName]').should('have.length.of.at.least', 1);

    // Makes the assumption that the first org has at least 1 collection and at least 1 entry in
    cy.get('[data-cy=orgName]').first().click();
    cy.get('[data-cy=collectionName').should('have.length.of.at.least', 1);
    cy.get('[data-cy=collectionName').first().click();
    cy.url().should('contain', 'collections');
    cy.get('[data-cy=collectionEntry]').should('have.length.of.at.least', 1);
  });
});

describe('Test logged out home page', () => {
  it('find buttons', () => {
    cy.visit('/');
    cy.contains('[data-cy=register-button]', 'Register');
  });
  it('home page search bar works', () => {
    cy.visit('/');
    cy.get('input[id=searchBar]').type('test{enter}');
    cy.url().should('include', '/search?entryType=workflows&search=test');
  });
});

describe('Test search page functionality', () => {
  it('displays tools', () => {
    cy.visit('/search');
    cy.get('[data-cy=workflowColumn]').should('have.length.of.at.least', 1);
  });
  it('has working tag cloud', () => {
    cy.visit('/search');
    cy.get('[data-cy=tagCloud]').should('not.exist');
    cy.contains('button', 'Popular Keywords').click();
    cy.get('[data-cy=tagCloud]').should('exist');
    cy.contains('button', 'Popular Keywords').click();
    cy.get('[data-cy=tagCloud]').should('not.exist');
  });
  it('searches', () => {
    cy.visit('/search');
    cy.get('[data-cy=basic-search]').type('topmed{enter}');
    cy.url().should('contain', '/search?entryType=workflows&search=topmed');
  });
  it('filters and unfilters by facets', () => {
    cy.visit('/search');
    cy.wait(2500); // Wait less than ideal, facets keep getting rerendered is the problem
    cy.contains('mat-checkbox', 'Nextflow').click();
    cy.get('[data-cy=workflowColumn] a');
    cy.wait(2500); // Wait less than ideal, facets keep getting rerendered is the problem
    cy.contains('mat-checkbox', 'Nextflow'); // wait for the checkbox to reappear, indicating the filtering is almost complete
    cy.get('[data-cy=descriptorType]').each(($el, index, $list) => {
      cy.wrap($el).contains('Nextflow');
    });
    cy.url().should('contain', 'descriptorType=NFL');
    cy.url().should('contain', 'searchMode=files');
    cy.contains('mat-checkbox', 'Nextflow').click();
    cy.url().should('not.contain', 'descriptorType=NFL');
    cy.url().should('contain', 'searchMode=files');
  });
  it('boolean facet filters', () => {
    cy.visit('/search');
    cy.contains('mat-checkbox', /^[ ]*verified/).click();
    cy.url().should('contain', 'verified=1');
    cy.get('[data-cy=workflowColumn] a');
    cy.contains('mat-checkbox', /^[ ]*verified/);
  });
});

describe('Test workflow page functionality', () => {
  it('find a WDL workflow', () => {
    cy.visit('/search');
    cy.contains('.mat-tab-label', 'Workflows');
    cy.get('[data-cy=workflowColumn]').should('have.length.of.at.least', 1);

    // click twice to sort by descriptor type descending so WDL is at the top
    cy.get('[data-cy=descriptorTypeHeader]').click().click();
    cy.get('[data-cy=workflowColumn] a').first().click();
  });
});

describe('Check external links', () => {
  it('github, twitter, discuss links are correct', () => {
    cy.visit('');
    cy.get('[data-cy=GitHubFooterLink]').should('have.attr', 'href', 'https://github.com/dockstore/dockstore');
    cy.contains('a', '@DockstoreOrg').should('have.attr', 'href', 'https://twitter.com/DockstoreOrg');
    cy.contains('a', 'Help Desk').should('have.attr', 'href', 'https://discuss.dockstore.org/t/opening-helpdesk-tickets/1506');
  });
});

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
  [
    'github.com/iwc-workflows/sars-cov-2-pe-illumina-wgs-variant-calling/COVID-19-PE-WGS-ILLUMINA',
    'main',
    'v0.2.2',
    'github.com/iwc-workflows/sars-cov-2-pe-illumina-wgs-variant-calling/COVID-19-PE-WGS-ILLUMINA',
    'Galaxy',
  ],
];
const notebookVersionTuples: string[][] = [
  // TODO when we add notebooks that will persist in the prod database, detail a few here
];

// These tests shouldn't be run for smoke tests as it depends on 'real' entries
if (Cypress.config('baseUrl') !== 'http://localhost:4200') {
  describe('Monitor workflows', () => {
    workflowVersionTuples.forEach((t) => testWorkflow(t[0], t[1], t[2], t[3], t[4]));
  });
  describe('Monitor notebooks', () => {
    notebookVersionTuples.forEach((t) => testNotebook(t[0], t[1], t[2], t[3], t[4], t[5]));
  });
}

function testWorkflow(url: string, version1: string, version2: string, trsUrl: string, type: string) {
  it('workflow tabs work for ' + url, () => {
    cy.visit('/workflows/' + url + ':' + version1);
    goToTab('Launch');
    cy.url().should('contain', '?tab=launch');
    goToTab('Info');
    cy.url().should('contain', '?tab=info');
    cy.contains('mat-card-header', 'Workflow Information');

    goToTab('Versions');
    cy.url().should('contain', '?tab=versions');

    // check that clicking on a different version goes to that version's url
    cy.contains('[data-cy=versionName]', version2).click();
    cy.url().should('contain', url + ':' + version2);

    goToTab('Files');
    cy.url().should('contain', '?tab=files');
    cy.contains('Descriptor Files');
    cy.get('.ace_editor').should('be.visible');
    cy.wait(1000); // https://ucsc-cgl.atlassian.net/browse/SEAB-5240 wait seems to fix; I think the import script needs to finish downloading
    // before clicking away.
    goToTab('Test Parameter Files');
    if (type === ToolDescriptor.TypeEnum.NFL) {
      cy.contains('This version has no files of this type.');
    }
    goToTab('Tools');
    cy.url().should('contain', '?tab=tools');

    /// New material have to click twice
    cy.contains('.mat-tab-label', 'DAG').click();
    cy.contains('.mat-tab-label', 'DAG').click();
    cy.url().should('contain', '?tab=dag');
    cy.get('[data-cy=dag-holder]').children().should('have.length.of.at.least', 1);

    let launchWithTuples: any[] = [];
    if (type === 'Galaxy') {
      it('test that galaxy button exists', () => {
        cy.get('[data-cy=galaxyLaunchWith] button').should('exist');
        cy.get('[data-cy=galaxyLaunchWith] button').click();
        cy.get('[data-cy=multiCloudLaunchOption]').should('have.length.of.at.least', 1);
        cy.get('[data-cy=multiCloudLaunchOption]').should('contain', 'usegalaxy.org');
        cy.get('[data-cy=multiCloudLaunchOption]').each(($el) => {
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

    if (type === 'WDL') {
      const launchSelectors = ['dnanexusLaunchWith', 'terraLaunchWith', 'anvilLaunchWith'];
      launchSelectors
        .map((launchSelector) => `[data-cy=${launchSelector}] img`)
        .forEach((launchSelector) => cy.get(launchSelector).should('exist'));
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
      cy.get('[data-cy=' + t[0] + ']').should(($el) => {
        // @ts-ignore
        expect($el.attr('href')).to.contain(t[1]);
      });
    });
  });
}

function testNotebook(url: string, version1: string, version2: string, trsUrl: string, path: string, type: string) {
  it('notebook tabs work for ' + url, () => {
    cy.visit('/notebooks/' + url + ':' + version1);

    goToTab('Info');
    cy.url().should('contain', '?tab=info');
    cy.contains('mat-card-header', 'Notebook Information');

    goToTab('Preview');
    cy.url().should('contain', '?tab=preview');

    goToTab('Versions');
    cy.url().should('contain', '?tab=versions');

    // check that clicking on a different version goes to that version's url
    if (version1 !== version2) {
      cy.contains('[data-cy=versionName]', version2).click();
      cy.url().should('contain', url + ':' + version2);
    }

    goToTab('Files');
    cy.url().should('contain', '?tab=files');

    // Check the "Launch with" buttons.
    // Notebooks "Launch with" is not fully functional in staging or prod in 1.14.
    // TODO after 1.15 release: make the following code execute in all cases.
    if (!isStagingOrProd()) {
      let launchWithTuples: any[] = [];
      if (type === 'Jupyter') {
        launchWithTuples = [
          ['colabLaunchWith', 'blob/' + version2 + path],
          ['mybinderLaunchWith', version2 + '?labpath=' + path],
        ];
      }
      launchWithTuples.forEach((t) => {
        cy.get('[data-cy=' + t[0] + ']').should(($el) => {
          // @ts-ignore
          expect($el.attr('href')).to.contain(t[1]);
        });
      });
    }
  });
}

describe('Check extra content', () => {
  it('featured content is visible from home page', () => {
    cy.visit('/');
    checkFeaturedContent();
  });

  it('news and updates are visible from home page', () => {
    cy.visit('/');
    checkNewsAndUpdates();
  });

  it('mastodon feed should be visible', () => {
    cy.visit('/');
    checkMastodonFeed();
  });
});

// TODO: uncomment after tooltester logs are fixed
// describe('Test existence of Logs', () => {
//   it('Find Logs in Workflows', () => {
//     cy.visit('/workflows/github.com/DataBiosphere/topmed-workflows/UM_variant_caller_wdl:1.32.0?tab=info');
//     cy.get('[data-cy=verificationLogsDialog]').click();
//
//     cy.contains('.mat-card-title', 'Verification Information');
//     cy.get('.mat-table')
//       .first()
//       .within(() => {
//         cy.get('.mat-row').should('have.length.of.at.least', 1);
//         cy.contains('Dockstore CLI');
//       });
//
//     cy.contains('.mat-card-title', 'Logs');
//     cy.get('.mat-table')
//       .eq(1)
//       .within(() => {
//         cy.get('.mat-row').should('have.length.of.at.least', 3);
//         cy.contains('variant-caller/variant-caller-wdl/topmed_freeze3_calling.json');
//         cy.contains('View FULL log');
//       });
//   });
// });
