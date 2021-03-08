import { ga4ghPath } from '../../../src/app/shared/constants';
import { Dockstore } from '../../../src/app/shared/dockstore.model';
import { goToTab } from '../../support/commands';

function testWorkflow(url: string, version1: string, version2: string, trsUrl: string, type: string) {
  it('info tab works', () => {
    cy.visit('/workflows/' + url + ':' + version1);
    goToTab('Launch');
    cy.url().should('contain', '?tab=launch');
    cy.contains('mat-card-header', 'Workflow Information');
    // test export to zip button?
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

  // This tends to be flaky so we are leaving it out for now
  //
  // it('DAG tab works', () => {
  //   goToTab('DAG');
  //   cy.url().should('contain', '?tab=dag');
  //   cy.get('[data-cy=dag-holder]');
  // });

  let launchWithTuples: any[] = [];
  if (type === 'WDL') {
    it('get the svg icons', () => {
      cy.get('[data-cy=dnanexusIcon]').within(() => {
        cy.get('svg').should('exist');
      });
      cy.get('[data-cy=terraIcon]').within(() => {
        cy.get('svg').should('exist');
      });
      cy.get('[data-cy=anvilIcon]').within(() => {
        cy.get('svg').should('exist');
      });
    });
  }
  if (type === 'CWL') {
    launchWithTuples = [
      // pairs of [launch button text, expected href]
      ['CGC', '?trs=' + trsUrl],
      ['NHLBI BioData Catalyst', '?trs=' + trsUrl],
    ];
  } else if (type === 'WDL') {
    launchWithTuples = [
      // pairs of [launch button text, expected href]
      ['DNAstack', '?descriptorType=wdl&path=' + url],
      ['DNAnexus', '?source=' + trsUrl],
      ['Terra', url + ':' + version2],
      ['AnVIL', url + ':' + version2],
      ['NHLBI BioData Catalyst', url + ':' + version2],
    ];
  } else {
    launchWithTuples = [];
  }

  // click on each launch button and confirm the url changes
  launchWithTuples.forEach((t) => {
    it('launch with buttons go to external site', () => {
      cy.contains('a', t[0]).should(($el) => {
        // @ts-ignore
        expect($el.attr('href')).to.contain(t[1]);
      });
    });
  });
}

describe('Test logged out home page', () => {
  it('find buttons', () => {
    cy.visit('/');
    cy.contains('[data-cy=register-button]', 'Register');
    cy.get('[data-cy=homepage-search-button]').click();
    cy.url().should('include', '/search');
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
    cy.get('[data-cy=tagCloud]').should('not.exist');
    cy.contains('button', 'Popular Keywords').click();
    cy.get('[data-cy=tagCloud]').should('exist');
    cy.contains('button', 'Popular Keywords').click();
    cy.get('[data-cy=tagCloud]').should('not.exist');
  });
  it('searches', () => {
    cy.get('[data-cy=basic-search]').type('topmed{enter}');
    cy.url().should('contain', '/search?entryType=workflows&search=topmed');
  });
  it('filters and unfilters by facets', () => {
    cy.visit('/search');
    cy.contains('mat-checkbox', 'Nextflow').click();
    cy.get('[data-cy=descriptorType]').each(($el, index, $list) => {
      cy.wrap($el).contains('NFL');
    });
    cy.url().should('contain', 'descriptorType=NFL');
    cy.url().should('contain', 'searchMode=files');
    cy.contains('mat-checkbox', 'Nextflow').click();
    cy.url().should('not.contain', 'descriptorType=NF');
    cy.url().should('contain', 'searchMode=files');
  });
});

describe('Test workflow page functionality', () => {
  it('find a WDL workflow', () => {
    cy.visit('/search');
    cy.contains('.mat-tab-label', 'Workflows');
    cy.get('[data-cy=workflowColumn]').should('have.length.of.at.least', 1);

    // click twice to sort by descriptor type descending so WDL is at the top
    cy.get('[data-cy=descriptorTypeHeader]').click().click();
    cy.get('[data-cy=workflowColumn]')
      .first()
      .within(() => {
        cy.get('a').click(); // click on the link to the first workflow
      });
  });
});

// pairs of [workflow URL without version number, verified version number, another verified version number, workflow.trsUrl]
const workflowVersionTuples = [
  [
    'github.com/DataBiosphere/topmed-workflows/UM_aligner_wdl',
    '1.32.0',
    'develop',
    window.location.origin +
      '/api' +
      ga4ghPath +
      '/tools/%23workflow%2Fgithub.com%2FDataBiosphere%2Ftopmed-workflows%2FUM_aligner_wdl/versions/develop',
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

const organizations = [['Broad Institute']];

describe('Monitor workflows', () => {
  workflowVersionTuples.forEach((t) => testWorkflow(t[0], t[1], t[2], t[3], t[4]));
});

describe('Check organizations page', () => {
  it('has multiple organizations', () => {
    cy.contains('a', 'Organizations').click();
    cy.url().should('contain', '/organizations');
    cy.get('[data-cy=orgName]').should('have.length.of.at.least', 2);
  });

  organizations.forEach((t) => {
    it('organization page and collections work', () => {
      cy.contains('[data-cy=orgName]', t[0]).click();
      cy.get('[data-cy=collectionName').should('have.length.of.at.least', 1);
      cy.get('[data-cy=collectionName').first().click();
      cy.url().should('contain', 'collections');
      cy.get('[data-cy=collectionEntry]').should('have.length.of.at.least', 1);
    });
  });
});

describe('Check external links', () => {
  it('github, twitter, gitter, discuss links are correct', () => {
    cy.visit('');
    cy.contains('a', 'GitHub').should('have.attr', 'href', 'https://github.com/dockstore/dockstore');
    cy.contains('a', '@DockstoreOrg').should('have.attr', 'href', 'https://twitter.com/DockstoreOrg');
    cy.contains('a', 'Gitter').should('have.attr', 'href', 'https://gitter.im/ga4gh/dockstore');
    cy.contains('a', 'Help Desk').should('have.attr', 'href', 'https://discuss.dockstore.org/t/opening-helpdesk-tickets/1506');
  });
});
