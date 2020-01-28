/*
 *    Copyright 2018 OICR
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
import {
  cancelMatMenu,
  clickFirstActionsButton,
  goToTab,
  goToUnexpandedSidebarEntry,
  resetDB,
  setTokenUserViewPort
} from '../../support/commands';

describe('Shared with me workflow test from my-workflows', () => {
  resetDB();
  setTokenUserViewPort();

  beforeEach(() => {
    // Mock the shared with me workflows and permissions
    // TODO: There is probably a better approach to this which would allow for deeper testing of shared workflows
    cy.server();

    cy.route({
      method: 'GET',
      url: /readertest\/actions/,
      response: ['READ']
    }).as('readerActions');

    cy.route({
      method: 'GET',
      url: /writertest\/actions/,
      response: ['READ', 'WRITE']
    }).as('writerActions');

    cy.route({
      method: 'GET',
      url: /ownertest\/actions/,
      response: ['READ', 'WRITE', 'SHARE', 'DELETE']
    }).as('ownerActions');

    const readerWorkflow = createHostedWorkflow('readertest', 200);
    const writerWorkflow = createHostedWorkflow('writertest', 201);
    const ownerWorkflow = createHostedWorkflow('ownertest', 202);
    cy.route({
      method: 'GET',
      url: '*shared*',
      response: [
        { role: 'READER', workflows: [readerWorkflow] },
        { role: 'WRITER', workflows: [writerWorkflow] },
        { role: 'OWNER', workflows: [ownerWorkflow] }
      ]
    }).as('getSharedWorkflows');

    cy.route({
      method: 'GET',
      url: '*/workflows/200*',
      response: readerWorkflow
    }).as('getReaderWorkflow');

    cy.route({
      method: 'GET',
      url: '*/workflows/201*',
      response: writerWorkflow
    }).as('getWriterWorkflow');

    cy.route({
      method: 'GET',
      url: '*/workflows/202*',
      response: ownerWorkflow
    }).as('getOwnerWorkflow');

    // Visit my-worklfows page
    cy.visit('/my-workflows');
  });

  function createHostedWorkflow(name: string, id: number) {
    return {
      aliases: null,
      author: null,
      checker_id: null,
      dbCreateDate: 1530729459942,
      dbUpdateDate: 1530729459942,
      defaultTestParameterFilePath: '/test.json',
      defaultVersion: null,
      description: null,
      descriptorType: 'wdl',
      email: null,
      full_workflow_path: 'dockstore.org/user_B/' + name,
      gitUrl: '',
      has_checker: false,
      id: id,
      input_file_formats: [],
      is_checker: false,
      is_published: false,
      labels: [],
      lastUpdated: 1530729459933,
      last_modified: null,
      last_modified_date: null,
      mode: 'HOSTED',
      organization: 'user_B',
      output_file_formats: [],
      parent_id: null,
      path: 'dockstore.org/user_B/' + name,
      repository: name,
      sourceControl: 'dockstore.org',
      source_control_provider: 'DOCKSTORE',
      starredUsers: [],
      users: [{ avatarUrl: '', curator: false, id: 2, isAdmin: false, name: 'user_B', userProfiles: null, username: 'user_B' }],
      workflowName: null,
      workflowVersions: [
        {
          commitID: null,
          dirtyBit: false,
          doiStatus: 'NOT_REQUESTED',
          doiURL: null,
          hidden: false,
          id: 1,
          input_file_formats: [],
          last_modified: 1530729511472,
          name: '1',
          output_file_formats: [],
          reference: null,
          referenceType: 'TAG',
          sourceFiles: [
            {
              content:
                "task hello {\n  String pattern\n  File in\n\n  command {\n    egrep '${pattern}' '${in}'\n  }\n\n  runtime {\n    docker: \"broadinstitute/my_image\"\n  }\n\n  output {\n    Array[String] matches = read_lines(stdout())\n  }\n}\n\nworkflow wf {\n  call hello\n}",
              id: 1,
              path: '/Dockstore.wdl',
              type: 'DOCKSTORE_WDL',
              verifiedBySource: {}
            }
          ],
          valid: true,
          verified: false,
          verifiedSource: null,
          versionEditor: { avatarUrl: '', curator: false, id: 2, isAdmin: false, name: 'user_B', userProfiles: null, username: 'user_B' },
          workflow_path: '/Dockstore.wdl',
          workingDirectory: ''
        },
        {
          commitID: null,
          dirtyBit: false,
          doiStatus: 'NOT_REQUESTED',
          doiURL: null,
          hidden: false,
          id: 2,
          input_file_formats: [],
          last_modified: 1530729532618,
          name: '2',
          output_file_formats: [],
          reference: null,
          referenceType: 'TAG',
          sourceFiles: [
            {
              content:
                "task hello {\n  String pattern\n  File in\n\n  command {\n    egrep '${pattern}' '${in}'\n  }\n\n  runtime {\n    docker: \"broadinstitute/my_image\"\n  }\n\n  output {\n    Array[String] varmatches = read_lines(stdout())\n  }\n}\n\nworkflow wf {\n  call hello\n}",
              id: 2,
              path: '/Dockstore.wdl',
              type: 'DOCKSTORE_WDL',
              verifiedBySource: {}
            }
          ],
          valid: true,
          verified: false,
          verifiedSource: null,
          versionEditor: { avatarUrl: '', curator: false, id: 2, isAdmin: false, name: 'user_B', userProfiles: null, username: 'user_B' },
          workflow_path: '/Dockstore.wdl',
          workingDirectory: ''
        }
      ],
      workflow_path: '/Dockstore.cwl'
    };
  }

  function getReadOnlyWorkflow() {
    goToUnexpandedSidebarEntry('dockstore.org/user_B', /readertest/);
  }

  function getWriteOnlyWorkflow() {
    goToUnexpandedSidebarEntry('dockstore.org/user_B', /writertest/);
  }

  function getOwnerWorkflow() {
    goToUnexpandedSidebarEntry('dockstore.org/user_B', /ownertest/);
  }

  describe('Should be able to perform operations on shared with me workflows based on permissions', () => {
    it('select a workflow you are a READER of and try to perform actions', () => {
      cy.wait('@getSharedWorkflows');
      getReadOnlyWorkflow();
      cy.wait('@getReaderWorkflow');
      cy.get('#publishButton').should('be.disabled');

      goToTab('Versions');
      clickFirstActionsButton();
      cy.contains('View').should('be.visible');
      cy.contains('Edit').should('not.be.visible');
      cy.contains('Delete').should('not.be.visible');
      cancelMatMenu();
      goToTab('Files');
      cy.contains('Edit Files').should('not.be.visible');
    });

    it('select a workflow you are a WRITER of and try to perform actions', () => {
      cy.wait('@getSharedWorkflows');
      getWriteOnlyWorkflow();
      cy.wait('@getWriterWorkflow');
      cy.get('#publishButton').should('be.disabled');

      goToTab('Versions');
      clickFirstActionsButton();
      cy.contains('View').should('not.be.visible');
      cy.contains('Edit').should('be.visible');
      cy.contains('Delete').should('be.visible');
      cancelMatMenu();
      goToTab('Files');
      cy.contains('Edit Files').should('be.visible');
    });

    it('select a workflow you are an OWNER of and try to perform actions', () => {
      cy.wait('@getSharedWorkflows');
      getOwnerWorkflow();
      cy.wait('@getOwnerWorkflow');
      cy.get('#publishButton').should('not.be.disabled');

      goToTab('Versions');
      clickFirstActionsButton();
      cy.contains('View').should('not.be.visible');
      cy.contains('Edit').should('be.visible');
      cy.contains('Delete').should('be.visible');
      cancelMatMenu();
      goToTab('Files');
      cy.contains('Edit Files').should('be.visible');
    });
  });
});
