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
import { setTokenUserViewPort } from '../../support/commands';

describe('Dockstore tool/workflow search table', () => {
  setTokenUserViewPort();

  // When elastic search is added to cypress testing, get rid of cy.routes, and uncomment the commented lines
  function starColumnSearch(url: string, type: string) {
    cy.server();
    // Tools/worflows not starred in this response.
    cy.route({
      url: '*/api/ga4gh/v2/extended/tools/entry/_search',
      method: 'POST',
      status: 200,
      response: {
        took: 18,
        timed_out: false,
        _shards: { total: 5, successful: 5, skipped: 0, failed: 0 },
        hits: {
          total: 4,
          max_score: 1.0,
          hits: [
            {
              _index: 'entry',
              _type: 'tool',
              _id: '52',
              _score: 1.0,
              _source: {
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
                author: null,
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
                    last_modified: 1518479368000
                  }
                ],
                dbCreateDate: null,
                custom_docker_registry_path: 'quay.io',
                default_cwl_path: '/cwls/cgpmap-cramOut.cwl',
                name: 'dockstore-cgpmap',
                namespace: 'garyluu',
                gitUrl: 'git@github.com:garyluu/dockstore-cgpmap.git',
                defaultWDLTestParameterFile: '/test.wdl.json',
                defaultVersion: null
              }
            },
            {
              _index: 'entry',
              _type: 'tool',
              _id: '5',
              _score: 1.0,
              _source: {
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
                author: null,
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
                    last_modified: 1465420088000
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
                    last_modified: 1465420088000
                  }
                ],
                dbCreateDate: null,
                custom_docker_registry_path: 'quay.io',
                default_cwl_path: '/Dockstore.cwl',
                name: 'a',
                namespace: 'A2',
                gitUrl: 'git@github.com:A2/a.git',
                defaultWDLTestParameterFile: null,
                defaultVersion: null
              }
            },
            {
              _index: 'entry',
              _type: 'tool',
              _id: '4',
              _score: 1.0,
              _source: {
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
                author: null,
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
                    last_modified: 1458081725000
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
                    last_modified: 1458081724000
                  }
                ],
                dbCreateDate: null,
                custom_docker_registry_path: 'quay.io',
                default_cwl_path: '/Dockstore.cwl',
                name: 'b3',
                namespace: 'A2',
                gitUrl: 'git@github.com:A2/b3.git',
                defaultWDLTestParameterFile: null,
                defaultVersion: null
              }
            },
            {
              _index: 'entry',
              _type: 'workflow',
              _id: '11',
              _score: 1.0,
              _source: {
                aliases: {},
                is_published: true,
                last_modified_date: null,
                is_checker: false,
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
                    doiStatus: 'NOT_REQUESTED'
                  },
                  {
                    doiURL: null,
                    verifiedSource: null,
                    versionEditor: null,
                    verified: false,
                    referenceType: 'UNSET',
                    commitID: null,
                    id: 14,
                    doiStatus: 'NOT_REQUESTED'
                  }
                ],
                sourceControl: 'github.com',
                has_checker: false,
                id: 11,
                last_modified: null,
                email: null,
                dbUpdateDate: null,
                author: null,
                defaultTestParameterFilePath: null,
                workflowName: null,
                workflow_path: '/1st-workflow.cwl',
                dbCreateDate: null,
                parent_id: null,
                organization: 'A',
                gitUrl: 'git@github.com:A/l.git',
                defaultVersion: null
              }
            }
          ]
        }
      }
    });
    cy.visit('/search');

    if (type === 'workflow') {
      cy.get('#workflowTab-link').click();
    }
    cy.get('.mat-icon.star').should('not.exist');
    // cy.visit(url);
    // cy.get('#starringButton')
    //   .click();

    // First tool and workflow starred
    cy.fixture('searchTableResponse').then(json => {
      cy.route({
        url: '*/api/ga4gh/v2/extended/tools/entry/_search',
        method: 'POST',
        response: json
      });
    });

    cy.visit('/search');
    if (type === 'workflow') {
      cy.get('#workflowTab-link').click();
    }
    cy.get('.mat-icon.star').should('exist');
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
  it('tool items per page', () => {
    cy.server();
    cy.fixture('searchTableResponse').then(json => {
      cy.route({
        url: '*/api/ga4gh/v2/extended/tools/entry/_search',
        method: 'POST',
        response: json
      });
    });
    cy.visit('/search');
    cy.get('#mat-select-0 ').click();
    cy.get('#mat-option-1 ').click();
    cy.contains('a', 'garyluu/dockstore-cgpmap/cgpmap-cramOut').click();
    cy.get('.flex-toolbar ')
      .contains(' Search ')
      .click();
    cy.get('.mat-select-value-text ').contains('20');
  });
});
