/*
 *    Copyright 2019 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { ga4ghExtendedPath } from '../../../src/app/shared/constants';
import { getTab, goToTab, setTokenUserViewPort } from '../../support/commands';

describe('Dockstore tool/workflow search table', () => {
  setTokenUserViewPort();

  // When elastic search is added to cypress testing, get rid of cy.intercepts, and uncomment the commented lines
  function starColumnSearch(url: string, type: string) {
    // Tools/workflows not starred in this response.
    cy.intercept('POST', '*' + ga4ghExtendedPath + '/tools/entry/_search', {
      body: {
        took: 18,
        timed_out: false,
        _shards: { total: 5, successful: 5, skipped: 0, failed: 0 },
        hits: {
          total: 4,
          max_score: 1.0,
          hits: [
            {
              _index: 'tools',
              _type: '_doc',
              _id: '52',
              _score: 1.0,
              _source: {
                entryTypeMetadata: {
                  termPlural: 'tools',
                  sitePath: 'containers',
                  trsSupported: true,
                  trsPrefix: '',
                  term: 'tool',
                  searchSupported: true,
                  type: 'TOOL',
                  searchEntryType: 'tools',
                },
                tool_maintainer_email: '',
                aliases: {},
                default_dockerfile_path: '/Dockerfile',
                is_published: true,
                toolname: 'cgpmap-cramOut',
                last_modified_date: null,
                checker_id: null,
                private_access: false,
                descriptorType: ['cwl'],
                mode: 'MANUAL_IMAGE_PATH',
                lastBuild: 1518478819000,
                lastUpdated: 1518479742691,
                path: 'quay.io/garyluu/dockstore-cgpmap',
                defaultCWLTestParameterFile: '/examples/cgpmap/cramOut/fastq_gz_input.json',
                has_checker: false,
                id: 52,
                last_modified: null,
                email: null,
                default_wdl_path: '/Dockstore.wdl',
                tool_path: 'quay.io/garyluu/dockstore-cgpmap/cgpmap-cramOut',
                registry: 'QUAY_IO',
                dbUpdateDate: null,
                registry_string: 'quay.io',
                tags: [
                  {
                    doiURL: null,
                    hidden: false,
                    workingDirectory: 'cwls',
                    versionEditor: null,
                    verifiedSource: null,
                    verified: false,
                    referenceType: 'UNSET',
                    commitID: null,
                    dockerfile_path: '/Dockerfile',
                    doiStatus: 'NOT_REQUESTED',
                    reference: '3.0.0-rc8',
                    valid: true,
                    wdl_path: '/Dockstore.wdl',
                    automated: true,
                    size: 138844180,
                    cwl_path: '/cwls/cgpmap-cramOut.cwl',
                    name: '3.0.0-rc8',
                    id: 52,
                    image_id: 'c387f22e65f066c42ccaf11392fdbd640aa2b7627eb40ac06a0dbaca2ca323cb',
                    dirtyBit: false,
                    last_modified: 1518479368000,
                  },
                ],
                dbCreateDate: null,
                custom_docker_registry_path: 'quay.io',
                default_cwl_path: '/cwls/cgpmap-cramOut.cwl',
                name: 'dockstore-cgpmap',
                namespace: 'garyluu',
                gitUrl: 'git@github.com:garyluu/dockstore-cgpmap.git',
                defaultWDLTestParameterFile: '/test.wdl.json',
                defaultVersion: null,
                all_authors: [{ name: null, email: null, role: null, affiliation: null }],
              },
            },
            {
              _index: 'tools',
              _type: '_doc',
              _id: '5',
              _score: 1.0,
              _source: {
                entryTypeMetadata: {
                  termPlural: 'tools',
                  sitePath: 'containers',
                  trsSupported: true,
                  trsPrefix: '',
                  term: 'tool',
                  searchSupported: true,
                  type: 'TOOL',
                  searchEntryType: 'tools',
                },
                tool_maintainer_email: '',
                aliases: {},
                default_dockerfile_path: '/Dockerfile',
                is_published: true,
                toolname: null,
                last_modified_date: null,
                checker_id: null,
                private_access: false,
                descriptorType: ['cwl'],
                mode: 'AUTO_DETECT_QUAY_TAGS_AUTOMATED_BUILDS',
                lastBuild: 1465419996000,
                lastUpdated: 1480374043873,
                path: 'quay.io/A2/a',
                defaultCWLTestParameterFile: null,
                has_checker: false,
                id: 5,
                last_modified: null,
                email: null,
                default_wdl_path: '/Dockstore.wdl',
                tool_path: 'quay.io/A2/a',
                registry: 'QUAY_IO',
                dbUpdateDate: null,
                registry_string: 'quay.io',
                tags: [
                  {
                    doiURL: null,
                    hidden: false,
                    workingDirectory: '',
                    versionEditor: null,
                    verifiedSource: null,
                    verified: false,
                    referenceType: 'UNSET',
                    commitID: null,
                    dockerfile_path: '/Dockerfile',
                    doiStatus: 'NOT_REQUESTED',
                    reference: 'master',
                    valid: true,
                    wdl_path: '/Dockstore.wdl',
                    automated: true,
                    size: 44363874,
                    cwl_path: '/Dockstore.cwl',
                    name: 'latest',
                    id: 11,
                    image_id: '9227b87c1304b9ce746d06d0eb8144ec17a253f5b8e00a3922d86b538c8296c0',
                    dirtyBit: false,
                    last_modified: 1465420088000,
                  },
                  {
                    doiURL: null,
                    hidden: false,
                    workingDirectory: '',
                    versionEditor: null,
                    verifiedSource: null,
                    verified: false,
                    referenceType: 'UNSET',
                    commitID: null,
                    dockerfile_path: '/Dockerfile',
                    doiStatus: 'NOT_REQUESTED',
                    reference: 'master',
                    valid: true,
                    wdl_path: '/Dockstore.wdl',
                    automated: true,
                    size: 44363874,
                    cwl_path: '/Dockstore.cwl',
                    name: 'master',
                    id: 10,
                    image_id: '9227b87c1304b9ce746d06d0eb8144ec17a253f5b8e00a3922d86b538c8296c0',
                    dirtyBit: false,
                    last_modified: 1465420088000,
                  },
                ],
                dbCreateDate: null,
                custom_docker_registry_path: 'quay.io',
                default_cwl_path: '/Dockstore.cwl',
                name: 'a',
                namespace: 'A2',
                gitUrl: 'git@github.com:A2/a.git',
                defaultWDLTestParameterFile: null,
                defaultVersion: null,
              },
              all_authors: [{ name: null, email: null, role: null, affiliation: null }],
            },
            {
              _index: 'tools',
              _type: '_doc',
              _id: '4',
              _score: 1.0,
              _source: {
                entryTypeMetadata: {
                  termPlural: 'tools',
                  sitePath: 'containers',
                  trsSupported: true,
                  trsPrefix: '',
                  term: 'tool',
                  searchSupported: true,
                  type: 'TOOL',
                  searchEntryType: 'tools',
                },
                tool_maintainer_email: '',
                aliases: {},
                default_dockerfile_path: '/Dockerfile',
                is_published: true,
                toolname: null,
                last_modified_date: null,
                checker_id: null,
                private_access: false,
                descriptorType: ['wdl'],
                mode: 'AUTO_DETECT_QUAY_TAGS_AUTOMATED_BUILDS',
                lastBuild: 1458081382000,
                lastUpdated: 1480374043873,
                path: 'quay.io/A2/b3',
                defaultCWLTestParameterFile: null,
                has_checker: false,
                id: 4,
                last_modified: null,
                email: null,
                default_wdl_path: '/Dockstore.wdl',
                tool_path: 'quay.io/A2/b3',
                registry: 'QUAY_IO',
                dbUpdateDate: null,
                registry_string: 'quay.io',
                tags: [
                  {
                    doiURL: null,
                    hidden: false,
                    workingDirectory: '',
                    versionEditor: null,
                    verifiedSource: null,
                    verified: false,
                    referenceType: 'UNSET',
                    commitID: null,
                    dockerfile_path: '/Dockerfile',
                    doiStatus: 'NOT_REQUESTED',
                    reference: 'master',
                    valid: true,
                    wdl_path: '/Dockstore.wdl',
                    automated: true,
                    size: 108722128,
                    cwl_path: '/Dockstore.cwl',
                    name: 'latest',
                    id: 9,
                    image_id: 'f92aa8edcc265e4d5faabf7f89157008d52d514f8f6d7c1b833024f58f126e9d',
                    dirtyBit: false,
                    last_modified: 1458081725000,
                  },
                  {
                    doiURL: null,
                    hidden: true,
                    workingDirectory: '',
                    versionEditor: null,
                    verifiedSource: null,
                    verified: false,
                    referenceType: 'UNSET',
                    commitID: null,
                    dockerfile_path: '/Dockerfile',
                    doiStatus: 'NOT_REQUESTED',
                    reference: 'master',
                    valid: true,
                    wdl_path: '/Dockstore.wdl',
                    automated: true,
                    size: 108722128,
                    cwl_path: '/Dockstore.cwl',
                    name: 'master',
                    id: 8,
                    image_id: 'f92aa8edcc265e4d5faabf7f89157008d52d514f8f6d7c1b833024f58f126e9d',
                    dirtyBit: false,
                    last_modified: 1458081724000,
                  },
                ],
                dbCreateDate: null,
                custom_docker_registry_path: 'quay.io',
                default_cwl_path: '/Dockstore.cwl',
                name: 'b3',
                namespace: 'A2',
                gitUrl: 'git@github.com:A2/b3.git',
                defaultWDLTestParameterFile: null,
                defaultVersion: null,
                all_authors: [{ name: null, email: null, role: null, affiliation: null }],
              },
            },
            {
              _index: 'workflows',
              _type: '_doc',
              _id: '11',
              _score: 1.0,
              _source: {
                entryTypeMetadata: {
                  termPlural: 'workflows',
                  sitePath: 'workflows',
                  trsSupported: true,
                  trsPrefix: '#workflow/',
                  term: 'workflow',
                  searchSupported: true,
                  type: 'WORKFLOW',
                  searchEntryType: 'workflows',
                },
                aliases: {},
                is_published: true,
                last_modified_date: null,
                isChecker: false,
                checker_id: null,
                repository: 'l',
                source_control_provider: 'GITHUB',
                descriptorType: 'cwl',
                full_workflow_path: 'github.com/A/l',
                mode: 'FULL',
                lastUpdated: 1480374057688,
                path: 'github.com/A/l',
                workflowVersions: [
                  {
                    doiURL: null,
                    verifiedSource: null,
                    versionEditor: null,
                    verified: false,
                    referenceType: 'UNSET',
                    commitID: null,
                    id: 13,
                    doiStatus: 'NOT_REQUESTED',
                  },
                  {
                    doiURL: null,
                    verifiedSource: null,
                    versionEditor: null,
                    verified: false,
                    referenceType: 'UNSET',
                    commitID: null,
                    id: 14,
                    doiStatus: 'NOT_REQUESTED',
                  },
                ],
                sourceControl: 'github.com',
                has_checker: false,
                id: 11,
                last_modified: null,
                email: null,
                dbUpdateDate: null,
                defaultTestParameterFilePath: null,
                workflowName: null,
                workflow_path: '/1st-workflow.cwl',
                dbCreateDate: null,
                parent_id: null,
                organization: 'A',
                gitUrl: 'git@github.com:A/l.git',
                defaultVersion: null,
                all_authors: [{ name: null, email: null, role: null, affiliation: null }],
              },
            },
          ],
        },
      },
    });
    cy.visit('/search');

    if (type === 'workflow') {
      goToTab('Workflows');
    }
    cy.get('[data-cy=starredUsers]').should('not.exist');
    // cy.visit(url);
    // cy.get('#starringButton')
    //   .click();

    // First tool and workflow starred
    cy.fixture('searchTableResponse').then((json) => {
      cy.intercept('POST', '*' + ga4ghExtendedPath + '/tools/entry/_search', {
        body: json,
      });
    });

    cy.visit('/search');
    if (type === 'workflow') {
      goToTab('Workflows');
    }
    cy.get('[data-cy=starredUsers]').should('exist');
    // cy.visit(url);
    // cy.get('#starringButton')
    //   .click();
  }

  it('Tool Star Count', () => {
    starColumnSearch('/containers/quay.io/garyluu/dockstore-cgpmap/cgpmap-cramOut:3.0.0-rc8', 'tool');
  });

  it('Workflow Star Count', () => {
    starColumnSearch('/workflows/github.com/A/l', 'workflow');
  });
});

// test checks if items per page for pagination persists after navigating away and back to search
describe('search table items per page', () => {
  setTokenUserViewPort();
  beforeEach(() => {
    cy.fixture('searchTableResponse').then((json) => {
      cy.intercept('POST', '*' + ga4ghExtendedPath + '/tools/entry/_search', {
        body: json,
      });
    });
  });

  it('tool items per page', () => {
    cy.visit('/search');
    // Modify the number of items per page
    cy.get('[data-cy=search-entry-table-paginator]').contains(10).should('be.visible').click();
    cy.get('mat-option').contains(20).click();
    cy.get('[data-cy=search-entry-table-paginator]').contains(20);
    // Click an entry then go back to the search page
    cy.contains('A/l').click();
    cy.get('a').contains('Search').click();
    // The number of items should remain the same
    cy.get('[data-cy=search-entry-table-paginator]').contains(20);
  });

  it('tool items per page after advanced search', () => {
    cy.visit('/search');
    cy.get('[data-cy=advanced-search]').click();

    cy.get('[data-cy=dropdown]').click();
    cy.get('[data-cy=file_select]').should('not.exist');
    cy.get('[data-cy=desc_select]').should('be.visible').click();

    cy.get('[data-cy=NOTFilter]').click().type('garyluu');
    cy.get('[data-cy=confirm-search]').click();
    // Check that the advanced search dialog box has been closed
    cy.get('app-advancedsearch').should('not.exist');

    cy.get('[data-cy=advanced-search]').click();
    cy.get('[data-cy=clear-advanced-search]').click();
    cy.get('app-advancedsearch').should('not.exist');

    cy.get('[data-cy=advanced-search]').click();

    cy.get('[data-cy=dropdown]').click();
    cy.get('[data-cy=desc_select]').should('be.visible').click();

    cy.get('[data-cy=dropdown]').click();
    cy.get('[data-cy=desc_select]').should('not.exist');
    cy.get('[data-cy=file_select]').should('be.visible').click();

    cy.get('[data-cy=ANDNoSplitFilter]').click().type('gary');
    cy.get('[data-cy=ORFilter]').click().type('A2');
    cy.get('[data-cy=NOTFilter]').click().type('b3');
    cy.get('[data-cy=confirm-search]').click();
    cy.get('app-advancedsearch').should('not.exist');

    cy.get('[data-cy=advanced-search]').click();
    cy.get('[data-cy=clear-advanced-search]').click();
  });

  it('share button after filtering search', () => {
    cy.visit('/search');
    cy.get('[data-cy=share_button').should('not.exist');

    cy.get('[data-cy=advanced-search]').click();
    cy.get('[data-cy=ORFilter]').click().type('A2');
    cy.get('[data-cy=confirm-search]').click();

    cy.get('[data-cy=share_button').should('be.visible').click();
  });
});

// make sure that search table and tabs have been adjusted for notebooks
describe('check search table and tabs for notebooks', () => {
  setTokenUserViewPort();
  beforeEach(() => {
    cy.fixture('searchTableResponse').then((json) => {
      cy.intercept('POST', '*' + ga4ghExtendedPath + '/tools/entry/_search', {
        body: json,
      });
    });
  });
  it('should contain notebooks-related information', () => {
    cy.visit('/search');
    // Check that Notebooks tab exists
    getTab('Notebooks');
    // Select notebooks tab
    goToTab('Notebooks');
    cy.url().should('contain', 'notebooks');
    // Check that the notebooks variations are in the table body
    cy.get('mat-cell').contains('jupyter', { matchCase: false });
    cy.get('mat-cell').contains('python', { matchCase: false });
  });
});

describe('No results displays warning', () => {
  setTokenUserViewPort();
  beforeEach(() => {
    cy.fixture('noHitsSearchTableResponse').then((json) => {
      cy.intercept('POST', '*' + ga4ghExtendedPath + '/tools/entry/_search', {
        body: json,
      });
    });
  });
  it('should not show a warning if there are no results', () => {
    cy.visit('/search?descriptorType=WDL&entryType=workflows&searchMode=files');
    cy.get('[data-cy=no-results]').should('exist');
    cy.get('[data-cy=no-searchTerm-results]').should('not.exist');
  });
  it('should show a suggested search term and no reset warning', () => {
    cy.visit('/search?entryType=workflows&search=asdf');
    cy.get('[data-cy=no-results]').should('not.exist');
    cy.get('[data-cy=no-searchTerm-results]').should('exist');
  });
});
