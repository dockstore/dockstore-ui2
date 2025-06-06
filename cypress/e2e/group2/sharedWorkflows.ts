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
  clickFirstActionsButtonPrivate,
  resetDB,
  setTokenUserViewPort,
  goToUnexpandedSidebarEntry,
  goToVersionsTab,
  goToFilesTab,
} from '../../support/commands';
import { workflowEntryTypeMetadata } from '../../../src/app/test/mocked-objects';
import { BioWorkflow } from '../../../src/app/shared/openapi/model/bioWorkflow';
describe('Shared with me workflow test from my-workflows', () => {
  resetDB();
  setTokenUserViewPort();

  beforeEach(() => {
    // Mock the shared with me workflows and permissions
    // TODO: There is probably a better approach to this which would allow for deeper testing of shared workflows

    cy.intercept('GET', /readertest\/actions/, {
      body: ['READ'],
    }).as('readerActions');

    cy.intercept('GET', /writertest\/actions/, {
      body: ['READ', 'WRITE'],
    }).as('writerActions');

    cy.intercept('GET', /ownertest\/actions/, {
      body: ['READ', 'WRITE', 'SHARE', 'DELETE'],
    }).as('ownerActions');

    const readerWorkflow = createHostedWorkflow('readertest', 200);
    const writerWorkflow = createHostedWorkflow('writertest', 201);
    const ownerWorkflow = createHostedWorkflow('ownertest', 202);
    cy.intercept('GET', '*/workflows/shared*', {
      body: [
        { role: 'READER', workflows: [readerWorkflow] },
        { role: 'WRITER', workflows: [writerWorkflow] },
        { role: 'OWNER', workflows: [ownerWorkflow] },
      ],
    }).as('getSharedWorkflows');

    cy.intercept('GET', '*/workflows/200*', {
      body: readerWorkflow,
    }).as('getReaderWorkflow');

    cy.intercept('GET', '*/workflows/201*', {
      body: writerWorkflow,
    }).as('getWriterWorkflow');

    cy.intercept('GET', '*/workflows/202*', {
      body: ownerWorkflow,
    }).as('getOwnerWorkflow');

    // Visit my-worklfows page
    cy.visit('/my-workflows');
  });

  function createHostedWorkflow(name: string, id: number): BioWorkflow {
    return {
      aliases: undefined,
      authors: [],
      conceptDois: {},
      checker_id: undefined,
      dbCreateDate: 1530729459942,
      dbUpdateDate: 1530729459942,
      defaultTestParameterFilePath: '/test.json',
      defaultVersion: undefined,
      description: undefined,
      descriptorType: 'WDL',
      email: undefined,
      entryTypeMetadata: workflowEntryTypeMetadata,
      full_workflow_path: 'dockstore.org/user_B/' + name,
      gitUrl: '',
      has_checker: false,
      id: id,
      input_file_formats: [],
      isChecker: false,
      is_published: false,
      labels: [],
      lastUpdated: 1530729459933,
      last_modified: undefined,
      last_modified_date: undefined,
      mode: 'HOSTED',
      organization: 'user_B',
      output_file_formats: [],
      parent_id: undefined,
      path: 'dockstore.org/user_B/' + name,
      repository: name,
      sourceControl: 'dockstore.org',
      source_control_provider: 'DOCKSTORE',
      starredUsers: [],
      users: [
        {
          avatarUrl: '',
          curator: false,
          id: 2,
          isAdmin: false,
          name: 'user_B',
          userProfiles: undefined,
          username: 'user_B',
          setupComplete: true,
        },
      ],
      type: 'BioWorkflow',
      workflowName: undefined,
      workflowVersions: [
        {
          authors: [],
          commitID: undefined,
          dirtyBit: false,
          doiStatus: 'NOT_REQUESTED',
          doiURL: undefined,
          dois: {},
          hidden: false,
          id: 1,
          input_file_formats: [],
          last_modified: 1530729511472,
          name: '1',
          orcidAuthors: [],
          output_file_formats: [],
          reference: '1',
          referenceType: 'TAG',
          valid: true,
          verified: false,
          verifiedSource: undefined,
          versionEditor: {
            avatarUrl: '',
            curator: false,
            id: 2,
            isAdmin: false,
            name: 'user_B',
            userProfiles: undefined,
            username: 'user_B',
            setupComplete: true,
          },
          versionMetadata: {
            engineVersions: [],
            userIdToOrcidPutCode: {},
            description: '',
            descriptorTypeVersions: undefined,
            id: 0,
            parsedInformationSet: undefined,
            publicAccessibleTestParameterFile: false,
          },
          workflow_path: '/Dockstore.wdl',
          workingDirectory: '',
        },
        {
          authors: [],
          commitID: undefined,
          dirtyBit: false,
          doiStatus: 'NOT_REQUESTED',
          doiURL: undefined,
          dois: {},
          hidden: false,
          id: 2,
          input_file_formats: [],
          last_modified: 1530729532618,
          name: '2',
          orcidAuthors: [],
          output_file_formats: [],
          reference: '2',
          referenceType: 'TAG',
          valid: true,
          verified: false,
          verifiedSource: undefined,
          versionEditor: {
            avatarUrl: '',
            curator: false,
            id: 2,
            isAdmin: false,
            name: 'user_B',
            userProfiles: undefined,
            username: 'user_B',
          },
          versionMetadata: {
            engineVersions: [],
            userIdToOrcidPutCode: {},
            description: '',
            descriptorTypeVersions: undefined,
            id: 0,
            parsedInformationSet: undefined,
            publicAccessibleTestParameterFile: false,
          },
          workflow_path: '/Dockstore.wdl',
          workingDirectory: '',
        },
      ],
      workflow_path: '/Dockstore.cwl',
    };
  }

  function getReadOnlyWorkflow() {
    goToUnexpandedSidebarEntry('user_B', 'dockstore.org/user_B/readertest');
  }

  function getWriteOnlyWorkflow() {
    goToUnexpandedSidebarEntry('user_B', 'dockstore.org/user_B/writertest');
  }

  function getOwnerWorkflow() {
    goToUnexpandedSidebarEntry('user_B', 'dockstore.org/user_B/ownertest');
  }

  describe('Should be able to perform operations on shared with me workflows based on permissions', () => {
    it('select a workflow you are a READER of and try to perform actions', () => {
      cy.wait('@getSharedWorkflows');
      getReadOnlyWorkflow();
      cy.wait('@getReaderWorkflow');
      cy.get('#publishButton').should('be.disabled');

      goToVersionsTab();
      clickFirstActionsButtonPrivate();
      cy.contains('View').should('be.visible');
      cy.contains('Edit Info').should('not.exist');
      cy.contains('Delete').should('not.exist');
      cancelMatMenu();
      goToFilesTab();
      cy.contains('Edit Files').should('not.exist');
    });

    it('select a workflow you are a WRITER of and try to perform actions', () => {
      cy.wait('@getSharedWorkflows');
      getWriteOnlyWorkflow();
      cy.wait('@getWriterWorkflow');
      cy.get('#publishButton').should('be.disabled');

      goToVersionsTab();
      clickFirstActionsButtonPrivate();
      cy.contains('View').should('not.exist');
      cy.contains('Edit Info').should('be.visible');
      cy.contains('Delete').should('be.visible');
      cancelMatMenu();
      goToFilesTab();
      cy.contains('Edit Files').should('be.visible');
    });

    it('select a workflow you are an OWNER of and try to perform actions', () => {
      cy.wait('@getSharedWorkflows');
      getOwnerWorkflow();
      cy.wait('@getOwnerWorkflow');
      cy.get('#publishButton').should('not.be.disabled');

      goToVersionsTab();
      clickFirstActionsButtonPrivate();
      cy.contains('View').should('not.exist');
      cy.contains('Edit Info').should('be.visible');
      cy.contains('Delete').should('be.visible');
      cancelMatMenu();
      goToFilesTab();
      cy.contains('Edit Files').should('be.visible');
    });
  });
});
