/*
 *     Copyright 2018 OICR
 *
 *     Licensed under the Apache License, Version 2.0 (the "License")
 *     you may not use this file except in compliance with the License
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */
import { DockstoreTool } from '../../../src/app/shared/openapi';
import { goToTab, resetDB, setTokenUserViewPort, typeInInput } from '../../support/commands';

describe('Dockstore my tools', () => {
  resetDB();
  setTokenUserViewPort();

  beforeEach(() => {
    cy.visit('/my-tools');
  });

  function selectUnpublishedTab(org: string) {
    cy.get('#tool-path').should('be.visible');
    cy.get('mat-panel-title')
      .contains(org)
      .parentsUntil('mat-accordion')
      .should('be.visible')
      .contains('.mat-tab-label-content', 'Unpublished')
      .should('be.visible')
      .click();
  }

  function selectTool(tool: string) {
    cy.get('#tool-path').should('be.visible');
    cy.contains('div .no-wrap', tool).should('be.visible').click();
    cy.get('#tool-path').contains(tool);
  }

  describe('Go to published tool A2/b3', () => {
    it('Should have two versions visible', () => {
      selectTool('b3');
      goToTab('Versions');
      cy.get('tbody>tr').should('have.length', 2);
    });
  });

  describe('Should contain extended DockstoreTool properties', () => {
    it('visit another page then come back', () => {
      // The seemingly unnecessary visits are due to a detached-from-dom error even using cy.get().click();
      cy.server();
      cy.route('api/containers/*?include=validations').as('getTool');
      cy.get('a#home-nav-button').click();
      cy.get('[data-cy=dropdown-main]:visible').should('be.visible').click();
      cy.get('[data-cy=my-tools-nav-button]').click();
      cy.wait('@getTool');
      selectUnpublishedTab('quay.io/A2');
      selectTool('b1');
      cy.contains('github.com');
      cy.get('a#sourceRepository').contains('A2/b1').should('have.attr', 'href', 'https://github.com/A2/b1');
      cy.contains('quay.io');
      cy.get('a#imageRegistry').contains('A2/b1').should('have.attr', 'href', 'https://quay.io/repository/A2/b1');
      cy.contains('Last Build');
      cy.contains('Last Updated');
      cy.contains('Build Mode');
      cy.contains('Fully automated');
      cy.contains('/Dockstore.cwl');
      // Change the dockerfile path
      cy.contains('button', ' Edit ').click();
      cy.get('input').first().should('be.visible').clear().type('/thing/Dockerfile');
      cy.contains('button', ' Save ').click();
      cy.visit('/my-tools/quay.io/A2/b1');
      cy.contains('/thing/Dockerfile');
      // Change the dockerfile path back
      cy.contains('button', ' Edit ').click();
      cy.get('input').first().should('be.visible').clear().type('/Dockerfile');
      cy.contains('button', ' Save ').click();
      cy.visit('/my-tools/quay.io/A2/b1');
      cy.contains('/Dockerfile');

      // // Topic Editing
      let privateEntryURI = '/my-tools/github.com/A2/a';
      cy.visit(privateEntryURI);
      cy.get('[data-cy=topicEditButton]').click();
      cy.get('[data-cy=topicInput]').clear().type('badTopic');
      cy.get('[data-cy=topicCancelButton]').click();
      cy.contains('badTopic').should('not.exist');
      cy.get('[data-cy=topicEditButton]').click();
      cy.get('[data-cy=topicInput]').clear().type('goodTopic');
      cy.get('[data-cy=topicEditButton]').click();
      cy.contains('goodTopic').should('exist');

      // Check public view
      cy.visit(privateEntryURI);
      cy.get('[data-cy=viewPublicToolButton]').should('be.visible').click();
      cy.contains('goodTopic').should('not.exist');

      cy.visit(privateEntryURI);
      cy.get('.mat-radio-label').contains('Manual').click();
      cy.visit(privateEntryURI);
      cy.get('[data-cy=viewPublicToolButton]').should('be.visible').click();
      cy.contains('goodTopic').should('exist');
    });
    it('should be able to add labels', () => {
      cy.contains('quay.io/A2/a:latest');
      cy.get('button').contains('Manage labels').click();
      cy.get('[data-cy=toolLabelInput]').type('potato');
      // Adding force:true, appears to be a cypress issue, when clicking this button the event does not fire
      // this will force submitContainerEdits() to fire
      cy.get('[data-cy=saveLabelButton]').click({ force: true });
      cy.get('[data-cy=saveLabelButton]').should('not.exist');
    });
    it('add and remove test parameter file', () => {
      cy.server();
      cy.route('api/containers/*?include=validations').as('getTool');
      cy.wait('@getTool');
      selectUnpublishedTab('quay.io/A2');
      selectTool('b1');
      cy.contains('Versions').click();
      cy.contains('button', 'Actions').should('be.visible').click();
      cy.contains('button:visible', 'Edit').should('be.visible').click();
      // For some unknown reason, Cypress likes to type '/test.wdl.json' in the wrong place
      cy.wait(5000);
      cy.get('input[data-cy=addWDLField]').should('be.visible').should('have.value', '').type('/test.wdl.json');
      cy.get('input[data-cy=addCWLField]').should('be.visible').should('have.value', '').type('/test.cwl.json');
      cy.get('#saveVersionModal').click();
      cy.get('#saveVersionModal').should('not.exist');
      cy.contains('button', 'Actions').should('be.visible').click();
      cy.contains('button:visible', 'Edit').should('be.visible').click();
      cy.get('#removeCWLTestParameterFileButton').click();
      cy.get('#removeWDLTestParameterFileButton').click();
      cy.get('#saveVersionModal').click();
      cy.get('#saveVersionModal').should('not.exist');
    });
  });

  describe('Should require default version to publish', () => {
    it('should not be able to publish a tool with no default', () => {
      cy.visit('/my-tools/quay.io/A2/b1');
      cy.get('#publishToolButton').should('contain', 'Publish').click();
      cy.get('[data-cy=close-dialog-button]').click();
      cy.get('#publishToolButton').should('contain', 'Publish');
    });
  });

  describe('publish a tool', () => {
    it('publish and unpublish', () => {
      cy.server();
      cy.route('api/containers/*?include=validations').as('getTool');
      cy.wait('@getTool');
      selectUnpublishedTab('quay.io/A2');
      selectTool('b1');

      cy.get('[data-cy=viewPublicToolButton]').should('not.exist');

      cy.get('#publishToolButton').click();
      cy.get('[data-cy=close-dialog-button]').click();

      goToTab('Versions');
      cy.contains('button', 'Actions').should('be.visible').click();
      cy.get('[data-cy=set-default-version-button]').should('be.visible').click();

      cy.get('#publishToolButton')
        .should('contain', 'Publish')
        .click()
        .should('contain', 'Unpublish')
        .click()
        .should('contain', 'Publish')
        .click()
        .should('contain', 'Unpublish');

      cy.get('[data-cy=viewPublicToolButton]').should('be.visible').click();

      cy.url().should('eq', Cypress.config().baseUrl + '/containers/quay.io/A2/b1:latest?tab=info');
    });
  });

  describe('Publish and unpublish an existing Amazon ECR tool', () => {
    it('Publish and Unpublish', () => {
      cy.visit('/my-tools/amazon.dkr.ecr.test.amazonaws.com/A/a');

      cy.get('#publishToolButton').click();
      cy.get('[data-cy=close-dialog-button]').click();

      goToTab('Versions');
      cy.contains('button', 'Actions').should('be.visible').click();
      cy.get('[data-cy=set-default-version-button]').should('be.visible').click();

      cy.get('#publishToolButton').should('contain', 'Publish').click().should('contain', 'Unpublish').click().should('contain', 'Publish');
    });
    it('Be able to add tag with test parameter file', () => {
      cy.server();
      cy.route({
        method: 'PUT',
        url: 'api/containers/1/testParameterFiles?testParameterPaths=/test.json*',
      }).as('putTestParameterFile');
      cy.visit('/my-tools/amazon.dkr.ecr.test.amazonaws.com/A/a');
      cy.contains('Versions').click();
      cy.get('#addTagButton').click();
      typeInInput('Docker Image Tag Name', 'fakeTag');
      typeInInput('Git Branch or Tag Name', 'fakeGitReference');
      cy.get('#addVersionTagButton').click();
      cy.wait('@putTestParameterFile');
    });
  });

  describe('Manually register a public Amazon ECR tool', () => {
    it('register tool', () => {
      const toolObject: DockstoreTool = {
        id: 40000,
        author: undefined,
        description: undefined,
        labels: [],
        users: [{ id: 1, username: 'user_A', isAdmin: false, name: 'user_A' }],
        email: undefined,
        defaultVersion: undefined,
        lastUpdated: 1482334377743,
        gitUrl: 'git@github.com:testnamespace/testname.git',
        mode: 'MANUAL_IMAGE_PATH',
        name: 'testname',
        toolname: '',
        namespace: 'testnamespace',
        registry: 'AMAZON_ECR',
        lastBuild: undefined,
        tags: [],
        is_published: false,
        last_modified: undefined,
        default_dockerfile_path: '/Dockerfile',
        defaultCWLTestParameterFile: '/test.cwl.json',
        defaultWDLTestParameterFile: '/test.wdl.json',
        default_cwl_path: '/Dockstore.cwl',
        default_wdl_path: '/Dockstore.wdl',
        tool_maintainer_email: undefined,
        private_access: false,
        path: 'public.ecr.aws/testnamespace/testname',
        tool_path: 'public.ecr.aws/testnamespace/testname',
        custom_docker_registry_path: 'public.ecr.aws',
      };
      cy.server()
        .route({
          method: 'GET',
          url: /refresh/,
          response: toolObject,
        })
        .route({
          method: 'GET',
          url: 'containers/40000',
          response: toolObject,
        })
        .route({
          method: 'GET',
          url: /dockerfile/,
          response: { content: 'FROM ubuntu:16.10' },
        })
        .route({
          method: 'GET',
          url: /cwl/,
          response: {
            content: `#!/usr/bin/env cwl-runner\n\nclass: CommandLineTool\n\ndct:contributor:\n  foaf:name: Andy Yang\n  foaf:mbox: mailto:ayang@oicr.on.ca\ndct:creator:\n  '@id': http://orcid.org/0000-0001-9102-5681\n  foaf:name: Andrey Kartashov\n  foaf:mbox: mailto:Andrey.Kartashov@cchmc.org\ndct:description: 'Developed at Cincinnati Children’s Hospital Medical Center for the\n  CWL consortium http://commonwl.org/ Original URL: https://github.com/common-workflow-language/workflows'\ncwlVersion: v1.0\n\nrequirements:\n- class: DockerRequirement\n  dockerPull: quay.io/cancercollaboratory/dockstore-tool-samtools-rmdup:1.0\ninputs:\n  single_end:\n    type: boolean\n    default: false\n    doc: |\n      rmdup for SE reads\n  input:\n    type: File\n    inputBinding:\n      position: 2\n\n    doc: |\n      Input bam file.\n  output_name:\n    type: string\n    inputBinding:\n      position: 3\n\n  pairend_as_se:\n    type: boolean\n    default: false\n    doc: |\n      treat PE reads as SE in rmdup (force -s)\noutputs:\n  rmdup:\n    type: File\n    outputBinding:\n      glob: $(inputs.output_name)\n\n    doc: File with removed duplicates\nbaseCommand: [samtools, rmdup]\ndoc: |\n  Remove potential PCR duplicates: if multiple read pairs have identical external coordinates, only retain the pair with highest mapping quality. In the paired-end mode, this command ONLY works with FR orientation and requires ISIZE is correctly set. It does not work for unpaired reads (e.g. two ends mapped to different chromosomes or orphan reads).\n\n  Usage: samtools rmdup [-sS] <input.srt.bam> <out.bam>\n  Options:\n    -s       Remove duplicates for single-end reads. By default, the command works for paired-end reads only.\n    -S       Treat paired-end reads and single-end reads.\n\n`,
            path: '/Dockstore.cwl',
          },
        });
      // Make sure page is loaded first
      cy.get('#tool-path').should('be.visible');
      cy.get('#register_tool_button').click();
      cy.contains('Create tool with descriptor(s) on remote sites').should('be.visible').click();
      cy.get('.modal-footer').contains('Next').first().click();

      cy.get('#sourceCodeRepositoryInput').type('testnamespace/testname').wait(1000);

      cy.get('[data-cy=imageRegistryProviderSelect]').click();
      cy.contains('Amazon ECR').click();

      cy.get('#imageRegistryInput').type('testnamespace/testname');

      cy.get('#submitButton').click();
    });
  });

  describe('Manually register a private Amazon ECR tool', () => {
    it('register tool', () => {
      const toolObject: DockstoreTool = {
        id: 40000,
        author: undefined,
        description: undefined,
        labels: [],
        users: [{ id: 1, username: 'user_A', isAdmin: false, name: 'user_A' }],
        email: undefined,
        defaultVersion: undefined,
        lastUpdated: 1482334377743,
        gitUrl: 'git@github.com:testnamespace/testname.git',
        mode: 'MANUAL_IMAGE_PATH',
        name: 'testname',
        toolname: '',
        namespace: 'testnamespace',
        registry: 'AMAZON_ECR',
        lastBuild: undefined,
        tags: [],
        is_published: false,
        last_modified: undefined,
        default_dockerfile_path: '/Dockerfile',
        defaultCWLTestParameterFile: '/test.cwl.json',
        defaultWDLTestParameterFile: '/test.wdl.json',
        default_cwl_path: '/Dockstore.cwl',
        default_wdl_path: '/Dockstore.wdl',
        tool_maintainer_email: 'test@email.com',
        private_access: true,
        path: 'amazon.dkr.ecr.test-1.amazonaws.com/testnamespace/testname',
        tool_path: 'amazon.dkr.ecr.test-1.amazonaws.com/testnamespace/testname',
        custom_docker_registry_path: 'amazon.dkr.ecr.test-1.amazonaws.com',
      };
      cy.server()
        .route({
          method: 'GET',
          url: /refresh/,
          response: toolObject,
        })
        .route({
          method: 'GET',
          url: 'containers/40000',
          response: toolObject,
        })
        .route({
          method: 'GET',
          url: /dockerfile/,
          response: { content: 'FROM ubuntu:16.10' },
        })
        .route({
          method: 'GET',
          url: /cwl/,
          response: {
            content: `#!/usr/bin/env cwl-runner\n\nclass: CommandLineTool\n\ndct:contributor:\n  foaf:name: Andy Yang\n  foaf:mbox: mailto:ayang@oicr.on.ca\ndct:creator:\n  '@id': http://orcid.org/0000-0001-9102-5681\n  foaf:name: Andrey Kartashov\n  foaf:mbox: mailto:Andrey.Kartashov@cchmc.org\ndct:description: 'Developed at Cincinnati Children’s Hospital Medical Center for the\n  CWL consortium http://commonwl.org/ Original URL: https://github.com/common-workflow-language/workflows'\ncwlVersion: v1.0\n\nrequirements:\n- class: DockerRequirement\n  dockerPull: quay.io/cancercollaboratory/dockstore-tool-samtools-rmdup:1.0\ninputs:\n  single_end:\n    type: boolean\n    default: false\n    doc: |\n      rmdup for SE reads\n  input:\n    type: File\n    inputBinding:\n      position: 2\n\n    doc: |\n      Input bam file.\n  output_name:\n    type: string\n    inputBinding:\n      position: 3\n\n  pairend_as_se:\n    type: boolean\n    default: false\n    doc: |\n      treat PE reads as SE in rmdup (force -s)\noutputs:\n  rmdup:\n    type: File\n    outputBinding:\n      glob: $(inputs.output_name)\n\n    doc: File with removed duplicates\nbaseCommand: [samtools, rmdup]\ndoc: |\n  Remove potential PCR duplicates: if multiple read pairs have identical external coordinates, only retain the pair with highest mapping quality. In the paired-end mode, this command ONLY works with FR orientation and requires ISIZE is correctly set. It does not work for unpaired reads (e.g. two ends mapped to different chromosomes or orphan reads).\n\n  Usage: samtools rmdup [-sS] <input.srt.bam> <out.bam>\n  Options:\n    -s       Remove duplicates for single-end reads. By default, the command works for paired-end reads only.\n    -S       Treat paired-end reads and single-end reads.\n\n`,
            path: '/Dockstore.cwl',
          },
        });
      // Make sure page is loaded first
      cy.get('#tool-path').should('be.visible');
      cy.get('#register_tool_button').click();
      cy.contains('Create tool with descriptor(s) on remote sites').should('be.visible').click();
      cy.get('.modal-footer').contains('Next').first().click();

      cy.get('#sourceCodeRepositoryInput').type('testnamespace/testname').wait(1000);

      cy.get('[data-cy=imageRegistryProviderSelect]').click();
      cy.contains('Amazon ECR').click();

      cy.get('#privateTool').find('input').check({ force: true });

      cy.get('#dockerRegistryPathInput').type('amazon.dkr.ecr.test-1.amazonaws.com');

      cy.get('#toolMaintainerEmailInput').type('test@email.com');

      cy.get('#imageRegistryInput').type('_/testname');

      cy.get('#submitButton').click();

      // TODO: This is temporarily disabled
      // cy
      //     .get('#tool-path')
      //     .should('contain', 'amazon.dkr.ecr.test.amazonaws.com/testnamespace/testname')

      // cy
      //     .contains('Versions')
      //     .click()

      // cy
      //     .get('#addTagButton')
      //     .click()

      // cy
      //     .get('#versionTagInput')
      //     .type('master')
      // cy
      //     .get('#gitReferenceInput')
      //     .type('master')

      // cy
      //     .get('#addVersionTagButton')
      //     .click()

      // cy
      //     .get('#deregisterButton')
      //     .click()
      // cy
      //     .get('#deregisterConfirmButton')
      //     .click()

      // This is deactivated because:
      // onlyThe deregister uses this mocked id to deregister but since the id is incorrect, it can't deregister
      // cy
      // .get('#tool-path')
      // .should('not.contain', 'amazon.dkr.ecr.test.amazonaws.com/testnamespace/testname')
    });
  });

  describe('manually register a SBG tool', () => {
    it('register tool', () => {
      const toolObject = {
        id: 40000,
        author: null,
        description: null,
        labels: [],
        users: [{ id: 1, username: 'user_A', isAdmin: false, name: 'user_A' }],
        email: null,
        defaultVersion: null,
        lastUpdated: 1482334377743,
        gitUrl: 'git@github.com:testnamespace/testname.git',
        mode: 'MANUAL_IMAGE_PATH',
        name: 'testname',
        toolname: '',
        namespace: 'testnamespace',
        registry: 'SEVEN_BRIDGES',
        lastBuild: null,
        tags: [],
        is_published: false,
        last_modified: null,
        default_dockerfile_path: '/Dockerfile',
        defaultCWLTestParameterFile: '/test.cwl.json',
        defaultWDLTestParameterFile: '/test.wdl.json',
        default_cwl_path: '/Dockstore.cwl',
        default_wdl_path: '/Dockstore.wdl',
        tool_maintainer_email: 'test@email.com',
        private_access: true,
        path: 'images.sbgenomics.com/testnamespace/testname',
        tool_path: 'images.sbgenomics.com/testnamespace/testname',
        custom_docker_registry_path: 'images.sbgenomics.com',
      };
      cy.server()
        .route({
          method: 'GET',
          url: /refresh/,
          response: toolObject,
        })
        .route({
          method: 'GET',
          url: 'containers/40000',
          response: toolObject,
        })
        .route({
          method: 'GET',
          url: /dockerfile/,
          response: { content: 'FROM ubuntu:16.10' },
        })
        .route({
          method: 'GET',
          url: /cwl/,
          response: {
            content: `#!/usr/bin/env cwl-runner\n\nclass: CommandLineTool\n\ndct:contributor:\n  foaf:name: Andy Yang\n  foaf:mbox: mailto:ayang@oicr.on.ca\ndct:creator:\n  '@id': http://orcid.org/0000-0001-9102-5681\n  foaf:name: Andrey Kartashov\n  foaf:mbox: mailto:Andrey.Kartashov@cchmc.org\ndct:description: 'Developed at Cincinnati Children’s Hospital Medical Center for the\n  CWL consortium http://commonwl.org/ Original URL: https://github.com/common-workflow-language/workflows'\ncwlVersion: v1.0\n\nrequirements:\n- class: DockerRequirement\n  dockerPull: quay.io/cancercollaboratory/dockstore-tool-samtools-rmdup:1.0\ninputs:\n  single_end:\n    type: boolean\n    default: false\n    doc: |\n      rmdup for SE reads\n  input:\n    type: File\n    inputBinding:\n      position: 2\n\n    doc: |\n      Input bam file.\n  output_name:\n    type: string\n    inputBinding:\n      position: 3\n\n  pairend_as_se:\n    type: boolean\n    default: false\n    doc: |\n      treat PE reads as SE in rmdup (force -s)\noutputs:\n  rmdup:\n    type: File\n    outputBinding:\n      glob: $(inputs.output_name)\n\n    doc: File with removed duplicates\nbaseCommand: [samtools, rmdup]\ndoc: |\n  Remove potential PCR duplicates: if multiple read pairs have identical external coordinates, only retain the pair with highest mapping quality. In the paired-end mode, this command ONLY works with FR orientation and requires ISIZE is correctly set. It does not work for unpaired reads (e.g. two ends mapped to different chromosomes or orphan reads).\n\n  Usage: samtools rmdup [-sS] <input.srt.bam> <out.bam>\n  Options:\n    -s       Remove duplicates for single-end reads. By default, the command works for paired-end reads only.\n    -S       Treat paired-end reads and single-end reads.\n\n`,
            path: '/Dockstore.cwl',
          },
        });
      cy.get('#tool-path').should('be.visible');
      cy.get('#register_tool_button').click();
      cy.contains('Create tool with descriptor(s) on remote sites').should('be.visible').click();
      cy.get('.modal-footer').contains('Next').first().click();

      cy.get('#sourceCodeRepositoryInput').type('testnamespace/testname').wait(1000);

      cy.get('[data-cy=imageRegistryProviderSelect]').click();
      cy.contains('mat-option', 'Seven Bridges').click();
      cy.get('#dockerRegistryPathInput').type('images.sbgenomics.com');

      cy.get('#toolMaintainerEmailInput').type('test@email.com');

      cy.get('#imageRegistryInput').type('testnamespace/testname');

      cy.get('#submitButton').click();

      // TODO: This is temporarily disabled
      // cy
      //   .get('#tool-path')
      //   .should('contain', 'images.sbgenomics.com/testnamespace/testname')

      // cy
      //   .contains('Versions')
      //   .click()

      // cy
      //   .get('#addTagButton')
      //   .click()

      // cy
      //   .get('#versionTagInput')
      //   .type('master')
      // cy
      //   .get('#gitReferenceInput')
      //   .type('master')

      // cy
      //   .get('#addVersionTagButton')
      //   .click()

      // cy
      //   .get('#deregisterButton')
      //   .click()
      // cy
      //   .get('#deregisterConfirmButton')
      //   .click()

      // This should be activated later
      // cy
      // .get('#tool-path')
      // .should('not.contain', 'images.sbgenomics.com/testnamespace/testname')
    });
  });
  it('Should refresh individual repo when refreshing organization', () => {
    cy.server();
    cy.fixture('refreshedTool5').then((json) => {
      cy.route({
        method: 'GET',
        url: '/api/containers/5/refresh',
        response: json,
      }).as('refreshEntry');
    });
    cy.visit('/my-tools/quay.io/A2/a');
    cy.url().should('eq', Cypress.config().baseUrl + '/my-tools/quay.io/A2/a');
    goToTab('Versions');
    cy.get('table>tbody>tr').should('have.length.greaterThan', 0); // More than one version
    cy.get('#cdk-accordion-child-4 > .mat-action-row > .pull-right > [data-cy=refreshOrganization]').should('be.visible').click();
    cy.wait('@refreshEntry');
    goToTab('Versions');
    cy.get('table>tbody>tr').should('have.length', 0); // No versions
  });
  it('Refresh Namespace button should have tooltip', () => {
    cy.visit('/my-tools/quay.io/A2/a');
    cy.get('#cdk-accordion-child-4 > .mat-action-row > .pull-right > [data-cy=refreshOrganization]').trigger('mouseenter');
  });
});
