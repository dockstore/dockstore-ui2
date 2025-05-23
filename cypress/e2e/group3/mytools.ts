/*
 *     Copyright 2022 OICR, UCSC
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
import {
  selectRadioButton,
  resetDB,
  setTokenUserViewPort,
  setTokenUserViewPortCurator,
  typeInInput,
  selectSidebarEntry,
  selectOrganizationSidebarTab,
  goToVersionsTab,
} from '../../support/commands';

describe('Dockstore my tools', () => {
  resetDB();
  setTokenUserViewPort();

  beforeEach(() => {
    cy.visit('/my-tools');
  });

  describe('Go to published tool A2/b3', () => {
    it('Should have two versions visible', () => {
      selectSidebarEntry('quay.io/A2/b3');
      goToVersionsTab();
      cy.get('tbody>tr').should('have.length', 2);
    });
  });

  it('Should have discover existing tools button', () => {
    cy.intercept('api/containers/*?include=validations').as('getTool');
    cy.visit('/my-tools');
    cy.wait('@getTool');

    cy.fixture('myWorkflows.json').then((json) => {
      cy.intercept('PATCH', '/api/users/1/workflows', {
        body: json,
        statusCode: 200,
      });
    });
    cy.fixture('myTools.json').then((json) => {
      cy.intercept('GET', '/api/users/1/containers', {
        body: json,
        statusCode: 200,
      }).as('getContainers');
    });
    cy.intercept('GET', '/api/users/1/appTools', {
      body: {},
      statusCode: 200,
    }).as('getAppTools');

    cy.get('[data-cy=addToExistingTools]').should('be.visible').click();
    cy.wait('@getContainers');
    cy.wait('@getAppTools');
    cy.contains('addedthistoolviasync');
  });

  describe('Should contain extended DockstoreTool properties', () => {
    it('visit another page then come back', () => {
      // The seemingly unnecessary visits are due to a detached-from-dom error even using cy.get().click();
      cy.intercept('api/containers/*?include=validations').as('getTool');
      cy.intercept('PUT', 'api/containers/*').as('updateTool');
      cy.visit('/my-tools');
      cy.wait('@getTool');
      selectOrganizationSidebarTab('A2', false);
      selectSidebarEntry('quay.io/A2/b1');
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
      cy.wait('@updateTool');
      cy.visit('/my-tools/quay.io/A2/b1');
      cy.contains('/thing/Dockerfile');
      // Change the dockerfile path back
      cy.contains('button', ' Edit ').click();
      cy.get('input').first().should('be.visible').clear().type('/Dockerfile');
      cy.contains('button', ' Save ').click();
      cy.visit('/my-tools/quay.io/A2/b1');
      cy.contains('/Dockerfile');

      // Topic Editing
      let privateEntryURI = '/my-tools/github.com/A2/a';
      cy.visit(privateEntryURI);
      // Modify the manual topic, but don't save it
      cy.get('[data-cy=topicEditButton]').click();
      cy.get('[data-cy=topicInput]').clear(); // Unsafe to chain commands after clear()
      cy.get('[data-cy=topicInput]').type('badTopic');
      cy.get('[data-cy=topicCancelButton]').click();
      cy.get('[data-cy=selected-topic]').should('not.contain.text', 'badTopic');
      // Modify the manual topic and save it
      cy.get('[data-cy=topicEditButton]').click();
      cy.get('[data-cy=topicInput]').clear(); // Unsafe to chain commands after clear()
      cy.get('[data-cy=topicInput]').type('goodTopic');
      cy.get('[data-cy=topicSaveButton]').click();
      cy.wait('@updateTool');
      // Check that the manual topic is saved
      cy.get('[data-cy=topicEditButton]').click();
      cy.get('[data-cy=topicInput]').should('have.value', 'goodTopic');
      cy.get('[data-cy=topicCancelButton]').click();

      // Check public view. Manual topic should not be displayed because it's not the selected topic
      cy.get('[data-cy=viewPublicToolButton]').should('be.visible').click();
      cy.get('[data-cy=selected-topic]').should('not.contain.text', 'goodTopic');

      // Select the manual topic and verify that it's displayed publicly
      cy.visit(privateEntryURI);
      cy.get('[data-cy=topicEditButton]').click();
      selectRadioButton('Manual-radio-button');
      cy.get('[data-cy=topicSaveButton]').click();
      cy.wait('@updateTool');
      cy.get('[data-cy=viewPublicToolButton]').should('be.visible').click();
      cy.get('[data-cy=selected-topic]').should('contain.text', 'goodTopic');
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
      cy.intercept('api/containers/*?include=validations').as('getTool');
      cy.wait('@getTool');
      selectOrganizationSidebarTab('A2', false);
      selectSidebarEntry('quay.io/A2/b1');
      cy.contains('Versions').click();
      cy.contains('button', 'Actions').should('be.visible').click();
      cy.get('[data-cy=edit-button]').should('be.visible').click();
      // For some unknown reason, Cypress likes to type '/test.wdl.json' in the wrong place
      cy.wait(5000);
      cy.get('input[data-cy=addWDLField]').should('be.visible').should('have.value', '').type('/test.wdl.json');
      cy.get('input[data-cy=addCWLField]').should('be.visible').should('have.value', '').type('/test.cwl.json');
      cy.get('#saveVersionModal').click();
      cy.get('#saveVersionModal').should('not.exist');
      cy.contains('button', 'Actions').should('be.visible').click();
      cy.get('[data-cy=edit-button]').should('be.visible').click();
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
      cy.intercept('api/containers/*?include=validations').as('getTool');
      cy.wait('@getTool');
      selectOrganizationSidebarTab('A2', false);
      selectSidebarEntry('quay.io/A2/b1');

      cy.get('[data-cy=viewPublicToolButton]').should('not.exist');

      cy.get('#publishToolButton').click();
      cy.get('[data-cy=close-dialog-button]').click();

      goToVersionsTab();
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

      goToVersionsTab();
      cy.contains('button', 'Actions').should('be.visible').click();
      cy.get('[data-cy=set-default-version-button]').should('be.visible').click();

      cy.get('#publishToolButton').should('contain', 'Publish').click().should('contain', 'Unpublish').click().should('contain', 'Publish');
    });
    it('Be able to add tag with test parameter file', () => {
      cy.intercept('PUT', 'api/containers/1/testParameterFiles?testParameterPaths=%2Ftest.json*').as('putTestParameterFile');
      cy.visit('/my-tools/amazon.dkr.ecr.test.amazonaws.com/A/a');
      cy.contains('Versions').click();
      cy.get('#addTagButton').click();
      typeInInput('version-tag-input', 'fakeTag');
      typeInInput('git-ref-input', 'fakeGitReference');
      cy.get('#addVersionTagButton').click();
      cy.wait('@putTestParameterFile');
    });
  });

  describe('Manually register a public Amazon ECR tool', () => {
    it('register tool', () => {
      const toolObject: DockstoreTool = {
        id: 40000,
        description: undefined,
        labels: [],
        users: [{ id: 1, username: 'user_A', isAdmin: false, name: 'user_A' }],
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
      cy.intercept('GET', /refresh/, {
        body: toolObject,
      });
      cy.intercept('GET', 'containers/40000', {
        body: toolObject,
      });
      cy.intercept('GET', /dockerfile/, {
        body: { content: 'FROM ubuntu:16.10' },
      });
      cy.intercept('GET', /cwl/, {
        body: {
          content: `#!/usr/bin/env cwl-runner\n\nclass: CommandLineTool\n\ndct:contributor:\n  foaf:name: Andy Yang\n  foaf:mbox: mailto:ayang@oicr.on.ca\ndct:creator:\n  '@id': http://orcid.org/0000-0001-9102-5681\n  foaf:name: Andrey Kartashov\n  foaf:mbox: mailto:Andrey.Kartashov@cchmc.org\ndct:description: 'Developed at Cincinnati Children’s Hospital Medical Center for the\n  CWL consortium http://commonwl.org/ Original URL: https://github.com/common-workflow-language/workflows'\ncwlVersion: v1.0\n\nrequirements:\n- class: DockerRequirement\n  dockerPull: quay.io/cancercollaboratory/dockstore-tool-samtools-rmdup:1.0\ninputs:\n  single_end:\n    type: boolean\n    default: false\n    doc: |\n      rmdup for SE reads\n  input:\n    type: File\n    inputBinding:\n      position: 2\n\n    doc: |\n      Input bam file.\n  output_name:\n    type: string\n    inputBinding:\n      position: 3\n\n  pairend_as_se:\n    type: boolean\n    default: false\n    doc: |\n      treat PE reads as SE in rmdup (force -s)\noutputs:\n  rmdup:\n    type: File\n    outputBinding:\n      glob: $(inputs.output_name)\n\n    doc: File with removed duplicates\nbaseCommand: [samtools, rmdup]\ndoc: |\n  Remove potential PCR duplicates: if multiple read pairs have identical external coordinates, only retain the pair with highest mapping quality. In the paired-end mode, this command ONLY works with FR orientation and requires ISIZE is correctly set. It does not work for unpaired reads (e.g. two ends mapped to different chromosomes or orphan reads).\n\n  Usage: samtools rmdup [-sS] <input.srt.bam> <out.bam>\n  Options:\n    -s       Remove duplicates for single-end reads. By default, the command works for paired-end reads only.\n    -S       Treat paired-end reads and single-end reads.\n\n`,
          path: '/Dockstore.cwl',
        },
      });
      // Make sure page is loaded first
      cy.get('#tool-path').should('be.visible');
      cy.get('#register_tool_button').click();
      // TODO: Fix this.  When 'Next' is clicked too fast, the next step is empty
      cy.wait(1000);
      cy.contains('Create tool with descriptor(s) on remote sites').should('be.visible').click();
      cy.contains('button', 'Next').click();

      // Untouched form should not have errors but is disabled
      cy.get('#submitButton').should('be.disabled');
      cy.get('.mat-error').should('not.exist');
      cy.get('#sourceCodeRepositoryInput').clear();
      cy.get('#sourceCodeRepositoryInput').type('testnamespace/testname');

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
        description: undefined,
        labels: [],
        users: [{ id: 1, username: 'user_A', isAdmin: false, name: 'user_A' }],
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
      cy.intercept('GET', /refresh/, {
        body: toolObject,
      });
      cy.intercept('GET', 'containers/40000', {
        body: toolObject,
      });
      cy.intercept('GET', /dockerfile/, {
        body: { content: 'FROM ubuntu:16.10' },
      });
      cy.intercept('GET', /cwl/, {
        body: {
          content: `#!/usr/bin/env cwl-runner\n\nclass: CommandLineTool\n\ndct:contributor:\n  foaf:name: Andy Yang\n  foaf:mbox: mailto:ayang@oicr.on.ca\ndct:creator:\n  '@id': http://orcid.org/0000-0001-9102-5681\n  foaf:name: Andrey Kartashov\n  foaf:mbox: mailto:Andrey.Kartashov@cchmc.org\ndct:description: 'Developed at Cincinnati Children’s Hospital Medical Center for the\n  CWL consortium http://commonwl.org/ Original URL: https://github.com/common-workflow-language/workflows'\ncwlVersion: v1.0\n\nrequirements:\n- class: DockerRequirement\n  dockerPull: quay.io/cancercollaboratory/dockstore-tool-samtools-rmdup:1.0\ninputs:\n  single_end:\n    type: boolean\n    default: false\n    doc: |\n      rmdup for SE reads\n  input:\n    type: File\n    inputBinding:\n      position: 2\n\n    doc: |\n      Input bam file.\n  output_name:\n    type: string\n    inputBinding:\n      position: 3\n\n  pairend_as_se:\n    type: boolean\n    default: false\n    doc: |\n      treat PE reads as SE in rmdup (force -s)\noutputs:\n  rmdup:\n    type: File\n    outputBinding:\n      glob: $(inputs.output_name)\n\n    doc: File with removed duplicates\nbaseCommand: [samtools, rmdup]\ndoc: |\n  Remove potential PCR duplicates: if multiple read pairs have identical external coordinates, only retain the pair with highest mapping quality. In the paired-end mode, this command ONLY works with FR orientation and requires ISIZE is correctly set. It does not work for unpaired reads (e.g. two ends mapped to different chromosomes or orphan reads).\n\n  Usage: samtools rmdup [-sS] <input.srt.bam> <out.bam>\n  Options:\n    -s       Remove duplicates for single-end reads. By default, the command works for paired-end reads only.\n    -S       Treat paired-end reads and single-end reads.\n\n`,
          path: '/Dockstore.cwl',
        },
      });
      // Make sure page is loaded first
      cy.get('#tool-path').should('be.visible');
      cy.get('#register_tool_button').click();
      // TODO: Fix this.  When 'Next' is clicked too fast, the next step is empty
      cy.wait(1000);
      cy.contains('Create tool with descriptor(s) on remote sites').should('be.visible').click();
      cy.contains('button', 'Next').click();

      // Untouched form should not have errors but is disabled
      cy.get('#submitButton').should('be.disabled');
      cy.get('.mat-error').should('not.exist');
      cy.get('#sourceCodeRepositoryInput').clear();
      cy.get('#sourceCodeRepositoryInput').type('testnamespace/testname');

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
      cy.intercept('GET', /refresh/, {
        body: toolObject,
      });
      cy.intercept('GET', 'containers/40000', {
        body: toolObject,
      });
      cy.intercept('GET', /dockerfile/, {
        body: { content: 'FROM ubuntu:16.10' },
      });
      cy.intercept('GET', /cwl/, {
        body: {
          content: `#!/usr/bin/env cwl-runner\n\nclass: CommandLineTool\n\ndct:contributor:\n  foaf:name: Andy Yang\n  foaf:mbox: mailto:ayang@oicr.on.ca\ndct:creator:\n  '@id': http://orcid.org/0000-0001-9102-5681\n  foaf:name: Andrey Kartashov\n  foaf:mbox: mailto:Andrey.Kartashov@cchmc.org\ndct:description: 'Developed at Cincinnati Children’s Hospital Medical Center for the\n  CWL consortium http://commonwl.org/ Original URL: https://github.com/common-workflow-language/workflows'\ncwlVersion: v1.0\n\nrequirements:\n- class: DockerRequirement\n  dockerPull: quay.io/cancercollaboratory/dockstore-tool-samtools-rmdup:1.0\ninputs:\n  single_end:\n    type: boolean\n    default: false\n    doc: |\n      rmdup for SE reads\n  input:\n    type: File\n    inputBinding:\n      position: 2\n\n    doc: |\n      Input bam file.\n  output_name:\n    type: string\n    inputBinding:\n      position: 3\n\n  pairend_as_se:\n    type: boolean\n    default: false\n    doc: |\n      treat PE reads as SE in rmdup (force -s)\noutputs:\n  rmdup:\n    type: File\n    outputBinding:\n      glob: $(inputs.output_name)\n\n    doc: File with removed duplicates\nbaseCommand: [samtools, rmdup]\ndoc: |\n  Remove potential PCR duplicates: if multiple read pairs have identical external coordinates, only retain the pair with highest mapping quality. In the paired-end mode, this command ONLY works with FR orientation and requires ISIZE is correctly set. It does not work for unpaired reads (e.g. two ends mapped to different chromosomes or orphan reads).\n\n  Usage: samtools rmdup [-sS] <input.srt.bam> <out.bam>\n  Options:\n    -s       Remove duplicates for single-end reads. By default, the command works for paired-end reads only.\n    -S       Treat paired-end reads and single-end reads.\n\n`,
          path: '/Dockstore.cwl',
        },
      });
      cy.get('#tool-path').should('be.visible');
      cy.get('#register_tool_button').click();
      // TODO: Fix this.  When 'Next' is clicked too fast, the next step is empty
      cy.wait(1000);
      cy.contains('Create tool with descriptor(s) on remote sites').should('be.visible').click();
      cy.contains('button', 'Next').click();

      // Untouched form should not have errors but is disabled
      cy.get('#submitButton').should('be.disabled');
      cy.get('.mat-error').should('not.exist');
      cy.get('#sourceCodeRepositoryInput').clear();
      cy.get('#sourceCodeRepositoryInput').type('testnamespace/testname');

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
    cy.fixture('refreshedTool5').then((json) => {
      cy.intercept('GET', '/api/containers/5/refresh', {
        body: json,
      }).as('refreshEntry');
    });
    cy.visit('/my-tools/quay.io/A2/a');
    cy.url().should('eq', Cypress.config().baseUrl + '/my-tools/quay.io/A2/a');
    goToVersionsTab();
    cy.get('table>tbody>tr').should('have.length.greaterThan', 0); // More than one version
    cy.get('[data-cy=refreshOrganization]:visible').click();
    cy.wait('@refreshEntry');
    goToVersionsTab();
    cy.get('table>tbody>tr').should('have.length', 0); // No versions
  });
  // Refresh org button does not have tool tip, re-enable test when feature is added
  if (false) {
    it('Refresh Namespace button should have tooltip', () => {
      cy.visit('/my-tools/quay.io/A2/a');
      cy.get('#cdk-accordion-child-1 > .mat-action-row > .pull-right > [data-cy=refreshOrganization]').trigger('mouseenter');
    });
  }
  describe('Should have correct buttons in Version modal', () => {
    it('Should have "Save Changes" and "Cancel" button when in editing view', () => {
      cy.visit('/my-tools/quay.io/A2/b1');
      goToVersionsTab();
      cy.contains('button', 'Actions').should('be.visible').click();
      cy.get('[data-cy=edit-button]').should('be.visible').click();
      cy.get('[data-cy=save-version]').scrollIntoView().should('be.visible');
      cy.get('[data-cy=cancel-edit-version-button]').should('be.visible').click();
    });
    it('Should have "OK" button when in public (non-editing) view', () => {
      cy.visit('/containers/quay.io/A2/a');
      goToVersionsTab();
      cy.get('[data-cy=info-button]').should('be.visible').first().click();
      cy.get('[data-cy=ok-dialog-close-button]').scrollIntoView().should('be.visible');
      cy.get('[data-cy=ok-dialog-close-button]').click();
    });
  });
});

describe('Should handle no tools correctly', () => {
  resetDB();
  setTokenUserViewPortCurator(); // Curator has no tools
  beforeEach(() => {
    cy.intercept('GET', /github.com\/organizations/, {
      body: ['dockstore'],
    });
  });
  it('My tools should prompt to register a tool', () => {
    cy.visit('/my-tools');
    cy.contains('Register a Tool');
  });
});
