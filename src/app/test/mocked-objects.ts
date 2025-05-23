/*
 *    Copyright 2017 OICR
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
import { Version } from 'app/shared/openapi/model/version';
import { OrgToolObject } from '../mytools/my-tool/my-tool.component';
import { Hit } from '../search/state/search.service';
import { ExtendedDockstoreTool } from '../shared/models/ExtendedDockstoreTool';
import { ExtendedWorkflow } from '../shared/models/ExtendedWorkflow';
import { VersionVerifiedPlatform, Tag, WorkflowVersion, Author, EntryTypeMetadata } from '../shared/openapi';
import { Notification } from '../shared/openapi/model/notification';
import { DockstoreTool } from './../shared/openapi/model/dockstoreTool';
import { SourceFile } from './../shared/openapi/model/sourceFile';
import { TokenUser } from './../shared/openapi/model/tokenUser';
import { Workflow } from './../shared/openapi/model/workflow';

const DescriptorTypeEnum = Workflow.DescriptorTypeEnum;

export const toolEntryTypeMetadata: EntryTypeMetadata = {
  searchEntryType: 'tools',
  searchSupported: true,
  sitePath: 'containers',
  term: 'tool',
  termPlural: 'tools',
  trsPrefix: '',
  trsSupported: true,
  type: 'TOOL',
};

export const workflowEntryTypeMetadata: EntryTypeMetadata = {
  searchEntryType: 'workflows',
  searchSupported: true,
  sitePath: 'workflows',
  term: 'workflow',
  termPlural: 'workflows',
  trsPrefix: '#workflow/',
  trsSupported: true,
  type: 'WORKFLOW',
};

export const serviceEntryTypeMetadata: EntryTypeMetadata = {
  searchEntryType: '',
  searchSupported: false,
  sitePath: 'services',
  term: 'service',
  termPlural: 'services',
  trsPrefix: '#service/',
  trsSupported: true,
  type: 'SERVICE',
};

export const appToolEntryTypeMetadata: EntryTypeMetadata = {
  searchEntryType: 'tools',
  searchSupported: true,
  sitePath: 'containers',
  term: 'tool',
  termPlural: 'tools',
  trsPrefix: '',
  trsSupported: true,
  type: 'APPTOOL',
};

export const notebookEntryTypeMetadata: EntryTypeMetadata = {
  searchEntryType: '',
  searchSupported: false,
  sitePath: 'notebooks',
  term: 'notebook',
  termPlural: 'notebooks',
  trsPrefix: '#notebook/',
  trsSupported: true,
  type: 'NOTEBOOK',
};

export const updatedWorkflow: Workflow = {
  type: '',
  descriptorType: DescriptorTypeEnum.CWL,
  gitUrl: 'updatedGitUrl',
  mode: Workflow.ModeEnum.FULL,
  organization: 'updatedOrganization',
  repository: 'updatedRepository',
  workflow_path: 'updatedWorkflowPath',
  workflowVersions: [],
  defaultTestParameterFilePath: 'updatedTestParameterPath',
  sourceControl: 'github.com',
  source_control_provider: 'GITHUB',
  descriptorTypeSubclass: 'n/a',
  entryTypeMetadata: workflowEntryTypeMetadata,
};

export const sampleWorkflow1: Workflow = {
  type: '',
  id: 1,
  descriptorType: DescriptorTypeEnum.CWL,
  gitUrl: 'updatedGitUrl',
  mode: Workflow.ModeEnum.FULL,
  organization: 'updatedOrganization',
  repository: 'updatedRepository',
  workflow_path: 'updatedWorkflowPath',
  workflowVersions: [],
  defaultTestParameterFilePath: 'updatedTestParameterPath',
  sourceControl: 'github.com',
  source_control_provider: 'GITHUB',
  descriptorTypeSubclass: 'n/a',
  entryTypeMetadata: workflowEntryTypeMetadata,
};

export const sampleWorkflow2: Workflow = {
  type: '',
  id: 2,
  descriptorType: DescriptorTypeEnum.CWL,
  gitUrl: 'updatedGitUrl',
  mode: Workflow.ModeEnum.FULL,
  organization: 'updatedOrganization',
  repository: 'updatedRepository',
  workflow_path: 'updatedWorkflowPath',
  workflowVersions: [],
  defaultTestParameterFilePath: 'updatedTestParameterPath',
  sourceControl: 'github.com',
  source_control_provider: 'GITHUB',
  descriptorTypeSubclass: 'n/a',
  entryTypeMetadata: workflowEntryTypeMetadata,
};

export const sampleWorkflow3: Workflow = {
  type: '',
  id: 3,
  descriptorType: DescriptorTypeEnum.CWL,
  gitUrl: 'sampleGitUrl',
  mode: Workflow.ModeEnum.FULL,
  organization: 'sampleOrganization',
  repository: 'sampleRepository',
  workflow_path: 'sampleWorkflowPath',
  workflowVersions: [],
  defaultTestParameterFilePath: 'updatedTestParameterPath',
  sourceControl: 'github.com',
  source_control_provider: 'GITHUB',
  full_workflow_path: 'github.com/sampleWorkflowPath',
  descriptorTypeSubclass: 'n/a',
  entryTypeMetadata: workflowEntryTypeMetadata,
};

export const sampleWdlWorkflow1: Workflow = {
  type: '',
  id: 4,
  descriptorType: DescriptorTypeEnum.WDL,
  gitUrl: 'sampleGitUrl',
  mode: Workflow.ModeEnum.FULL,
  organization: 'sampleOrganization',
  repository: 'sampleRepository',
  workflow_path: 'sampleWorkflowPath',
  workflowVersions: [],
  defaultTestParameterFilePath: 'updatedTestParameterPath',
  sourceControl: 'github.com',
  source_control_provider: 'GITHUB',
  full_workflow_path: 'github.com/DataBiosphere/topmed-workflows/Functional_Equivalence',
  descriptorTypeSubclass: 'n/a',
  entryTypeMetadata: workflowEntryTypeMetadata,
};

export const sampleCwlExtendedWorkflow: ExtendedWorkflow = {
  type: '',
  id: 5,
  descriptorType: DescriptorTypeEnum.CWL,
  gitUrl: 'git@github.com:dockstore-testing/md5sum-checker.git',
  mode: Workflow.ModeEnum.FULL,
  organization: 'dockstore-testing',
  repository: 'md5sum-checker',
  workflow_path: '/md5sum/md5sum-workflow.cwl',
  workflowVersions: [],
  defaultTestParameterFilePath: '/md5sum/md5sum-input-cwl.json',
  sourceControl: 'github.com',
  source_control_provider: 'GITHUB',
  full_workflow_path: 'github.com/dockstore-testing/md5sum-checker',
  descriptorTypeSubclass: 'n/a',
  entryTypeMetadata: workflowEntryTypeMetadata,
};

export const sampleWdlWorkflow2: Workflow = {
  type: '',
  id: 5,
  descriptorType: DescriptorTypeEnum.WDL,
  gitUrl: 'sampleGitUrl',
  mode: Workflow.ModeEnum.FULL,
  organization: 'sampleOrganization',
  repository: 'sampleRepository',
  workflow_path: 'sampleWorkflowPath',
  workflowVersions: [],
  defaultTestParameterFilePath: 'updatedTestParameterPath',
  sourceControl: 'github.com',
  source_control_provider: 'GITHUB',
  full_workflow_path: 'github.com/DataBiosphere/topmed-workflows/UM_aligner_wdl',
  descriptorTypeSubclass: 'n/a',
  entryTypeMetadata: workflowEntryTypeMetadata,
};

export const sampleWorkflowVersion: WorkflowVersion = {
  id: 1,
  reference: '',
  name: 'master',
  workflow_path: '/abc.wdl',
};

export const sampleToolVersion: Tag = {
  id: 1,
  reference: '',
  name: 'master',
};

export const sampleAuthorsArray: Array<Author> = [
  {
    email: 'sampleEmail',
    name: 'sampleName',
  },
];

export const sampleTool1: DockstoreTool = {
  id: 1,
  default_cwl_path: 'sampleDefaultCWLPath',
  default_dockerfile_path: 'sampleDefaultDockerfilePath',
  default_wdl_path: 'sampleDefaultWDLPath',
  gitUrl: 'sampleGitUrl',
  mode: DockstoreTool.ModeEnum.MANUALIMAGEPATH,
  name: 'sampleName',
  authors: sampleAuthorsArray,
  namespace: 'sampleNamespace',
  private_access: false,
  registry_string: 'quay.io',
  registry: DockstoreTool.RegistryEnum.QUAYIO,
  toolname: 'sampleToolname',
  defaultCWLTestParameterFile: 'sampleDefaultCWLTestParameterFile',
  defaultWDLTestParameterFile: 'sampleDefaultWDLTestParameterFile',
  tool_path: '',
  entryTypeMetadata: toolEntryTypeMetadata,
};

export const sampleTool2: DockstoreTool = {
  id: 2,
  default_cwl_path: 'sampleDefaultCWLPath',
  default_dockerfile_path: 'sampleDefaultDockerfilePath',
  default_wdl_path: 'sampleDefaultWDLPath',
  gitUrl: 'sampleGitUrl',
  mode: DockstoreTool.ModeEnum.MANUALIMAGEPATH,
  name: 'sampleName',
  namespace: 'sampleNamespace',
  private_access: false,
  registry_string: 'quay.io',
  registry: DockstoreTool.RegistryEnum.QUAYIO,
  toolname: 'sampleToolname',
  defaultCWLTestParameterFile: 'sampleDefaultCWLTestParameterFile',
  defaultWDLTestParameterFile: 'sampleDefaultWDLTestParameterFile',
  entryTypeMetadata: toolEntryTypeMetadata,
};

export const sampleTool3: DockstoreTool = {
  id: 3,
  default_cwl_path: 'sampleDefaultCWLPath',
  default_dockerfile_path: 'sampleDefaultDockerfilePath',
  default_wdl_path: 'sampleDefaultWDLPath',
  gitUrl: 'sampleGitUrl',
  mode: DockstoreTool.ModeEnum.MANUALIMAGEPATH,
  name: 'sampleName',
  namespace: 'sampleNamespace',
  private_access: false,
  registry_string: 'quay.io',
  registry: DockstoreTool.RegistryEnum.QUAYIO,
  toolname: 'sampleToolname',
  defaultCWLTestParameterFile: 'sampleDefaultCWLTestParameterFile',
  defaultWDLTestParameterFile: 'sampleDefaultWDLTestParameterFile',
  entryTypeMetadata: toolEntryTypeMetadata,
};

// Case 1: sampleTool1 in published entries, unpublished doesn't matter
export const orgObj1: OrgToolObject<DockstoreTool> = {
  registry: 'beef',
  namespace: 'stew',
  published: [sampleTool1],
  unpublished: [sampleTool2, sampleTool3],
  archived: [],
  expanded: false,
};
// Case 2: sampleTool1 in unpublished entries, published doesn't matter
export const orgObj2: OrgToolObject<DockstoreTool> = {
  registry: 'beef',
  namespace: 'stew',
  published: [sampleTool2, sampleTool3],
  unpublished: [sampleTool1],
  archived: [],
  expanded: false,
};

// Case 3: sampleTool1 in neither, published has something
export const orgObj3: OrgToolObject<DockstoreTool> = {
  registry: 'beef',
  namespace: 'stew',
  published: [sampleTool2],
  unpublished: [sampleTool3],
  archived: [],
  expanded: false,
};

// Case 4: sampleTool1 in neither, published has nothing
export const orgObj4: OrgToolObject<DockstoreTool> = {
  registry: 'beef',
  namespace: 'stew',
  published: [],
  unpublished: [],
  archived: [],
  expanded: false,
};

export const gitLabToken: TokenUser = {
  id: 4,
  tokenSource: 'gitlab.com',
  username: 'fakeGitLabUsername',
  userId: 2,
};

export const gitHubToken: TokenUser = {
  id: 3,
  tokenSource: 'github.com',
  username: 'fakeGitHubUsername',
  userId: 2,
};

export const bitbucketToken: TokenUser = {
  id: 2,
  tokenSource: 'bitbucket.org',
  username: 'fakeBitbucketUsername',
  userId: 2,
};

export const quayToken: TokenUser = {
  id: 1,
  tokenSource: 'quay.io',
  username: 'fakeQuayUsername',
  userId: 2,
};

export const sampleTag = {
  reference: 'sampleReference',
  image_id: 'sampleImageId',
  name: 'sampleName',
};

export const wdlSourceFile: SourceFile = {
  content: 'task foo {}',
  id: 0,
  path: '',
  absolutePath: '',
  type: 'DOCKSTORE_WDL',
  state: SourceFile.StateEnum.COMPLETE,
};

export const emptyWdlSourceFile: SourceFile = {
  content: '',
  id: 1,
  path: '/foo.wdl',
  absolutePath: '',
  type: 'DOCKSTORE_WDL',
  state: SourceFile.StateEnum.COMPLETE,
};

export const wdlSourceFileWithHttpImport: SourceFile = {
  content: 'import http://example.com/foo',
  id: 2,
  path: '/goo.wdl',
  absolutePath: '',
  type: 'DOCKSTORE_WDL',
  state: SourceFile.StateEnum.COMPLETE,
};

export const wdlSourceFileWithCommentedHttpImport: SourceFile = {
  content: '#import http://example.com/foo',
  id: 2,
  path: '/goo.wdl',
  absolutePath: '',
  type: 'DOCKSTORE_WDL',
  state: SourceFile.StateEnum.COMPLETE,
};

const cwlWithNoImport = `#!/usr/bin/env cwl-runner
cwlVersion: v1.0
class: CommandLineTool
baseCommand: echo
inputs:
  message:
      type: string
          inputBinding:
                position: 1
                outputs: []
`;

// Modified from https://www.commonwl.org/user_guide/19-custom-types/
const cwlWithHttpsImport = `#!/usr/bin/env cwl-runner
cwlVersion: v1.0
class: CommandLineTool

requirements:
  InlineJavascriptRequirement: {}
  ResourceRequirement:
    coresMax: 1
    ramMin: 100  # just a default, could be lowered
  SchemaDefRequirement:
    types:
      - $import: https://example.com/biom-convert-table.yaml
`;

// Modified from https://www.biostars.org/p/221902/
const cwlWithHttpsMixin = `#!/usr/bin/env cwl-runner
cwlVersion: v1.0
class: CommandLineTool
baseCommand: echo
inputs:
  $mixin: https://example.com/input.yaml
`;

const cwlWithCommentedHttpsMixin = `#!/usr/bin/env cwl-runner
cwlVersion: v1.0
class: CommandLineTool
baseCommand: echo
inputs:
  # $mixin: https://example.com/input.yaml
`;

// Based on https://github.com/common-workflow-language/common-workflow-language/issues/850#issuecomment-483698263
const cwlWithHttpsInclude = `#!/usr/bin/env cwl-runner
cwlVersion: v1.0
class: CommandLineTool
baseCommand: echo
content:
  literal: {$include: "https://example.com/something}
`;

const cwlWithSomeHttpLinks = `class: CommandLineTool
cwlVersion: v1.0
$namespaces:
  sbg: 'https://sevenbridges.com'
doc: >-
  The DELLY workflow from the ICGC PanCancer Analysis of Whole Genomes (PCAWG)
  project.

  ![pcawg
  logo](https://raw.githubusercontent.com/ICGC-TCGA-PanCancer/pcawg_delly_workflow/2.0.0/img/PCAWG-final-small.png
  "pcawg logo")
`;

const cwlWithHttpRun = `cwlVersion: v1.0
class: Workflow

#dct:creator:
#  '@id': http://orcid.org/0000-0002-7681-6415
#  foaf:name: Brian O'Connor
#  foaf:mbox: mailto:briandoconnor@gmail.com

#dct:contributor:
#  foaf:name: Denis Yuen
#  foaf:mbox: mailto:denis.yuen@oicr.on.ca

inputs:
  input_file: File
  expected_md5: string

outputs:
  workflow_output_file:
    type: File
    outputSource: checker/results_file

steps:
  md5sum:
    run: https://raw.githubusercontent.com/dockstore-testing-organisation/md5sum/master/md5sum/md5sum.cwl
    in:
      input_file: input_file
    out: [output_file]
  checker:
    run: https://raw.githubusercontent.com/dockstore-testing-organisation/md5sum/master/checker/md5sum_checker.cwl
    in:
      input_file: md5sum/output_file
      expected_md5: expected_md5
    out: [results_file]
`;

export const cwlSourceFileWithNoImport: SourceFile = {
  content: cwlWithNoImport,
  id: 3,
  path: '/fubar.cwl',
  absolutePath: '',
  type: 'DOCKSTORE_CWL',
  state: SourceFile.StateEnum.COMPLETE,
};

export const cwlSourceFileWithHttpsImport: SourceFile = {
  content: cwlWithHttpsImport,
  id: 3,
  path: '/fubar.cwl',
  absolutePath: '',
  type: 'DOCKSTORE_CWL',
  state: SourceFile.StateEnum.COMPLETE,
};

export const cwlSourceFileWithMixinImport: SourceFile = {
  content: cwlWithHttpsMixin,
  id: 3,
  path: '/fubar.cwl',
  absolutePath: '',
  type: 'DOCKSTORE_CWL',
  state: SourceFile.StateEnum.COMPLETE,
};

export const cwlSourceFileWithCommentedMixinImport: SourceFile = {
  content: cwlWithCommentedHttpsMixin,
  id: 3,
  path: '/fubar.cwl',
  absolutePath: '',
  type: 'DOCKSTORE_CWL',
  state: SourceFile.StateEnum.COMPLETE,
};

export const cwlSourceFileWithIncludeImport: SourceFile = {
  content: cwlWithHttpsInclude,
  id: 3,
  path: '/fubar.cwl',
  absolutePath: '',
  type: 'DOCKSTORE_CWL',
  state: SourceFile.StateEnum.COMPLETE,
};

export const cwlSourceFileWithSomeHttpLinks: SourceFile = {
  content: cwlWithSomeHttpLinks,
  id: 3,
  path: '/fubar.cwl',
  absolutePath: '',
  type: 'DOCKSTORE_CWL',
  state: SourceFile.StateEnum.COMPLETE,
};

export const cwlSourceFileWithHttpRun: SourceFile = {
  content: cwlWithHttpRun,
  id: 3,
  path: '/checker.cwl',
  absolutePath: '',
  type: 'DOCKSTORE_CWL',
  state: SourceFile.StateEnum.COMPLETE,
};

export const sampleSourceFile: SourceFile = {
  content: 'potato',
  id: 1,
  path: '/cwl.json',
  absolutePath: '',
  type: SourceFile.TypeEnum.CWLTESTJSON,
  state: SourceFile.StateEnum.COMPLETE,
};

export const versionVerifiedPlatform: Array<VersionVerifiedPlatform> = [
  {
    metadata: 'Docktesters group',
    path: '/Dockstore-BTCA-SG.json',
    platformVersion: '1.0.0',
    source: 'Dockstore CLI',
    verified: true,
    versionId: 1,
  },
  {
    metadata: 'Docktesters group',
    path: '/Dockstore.json',
    platformVersion: null,
    source: 'Dockstore CLI',
    verified: true,
    versionId: 1,
  },
];

export const testSourceFiles: Array<SourceFile> = [
  {
    content: 'potato',
    id: 3071652,
    path: '/Dockerfile',
    absolutePath: '',
    type: SourceFile.TypeEnum.DOCKERFILE,
    state: SourceFile.StateEnum.COMPLETE,
    verifiedBySource: {},
  },
  {
    content: 'potato',
    id: 3071752,
    path: '/Dockstore-BTCA-SG.json',
    absolutePath: '',
    type: SourceFile.TypeEnum.CWLTESTJSON,
    state: SourceFile.StateEnum.COMPLETE,
    verifiedBySource: {
      'Dockstore CLI': {
        metadata: 'Docktesters group',
        verified: true,
        platformVersion: '1.0.0',
      },
    },
  },
  {
    content: 'potato',
    id: 3071602,
    path: '/Dockstore.cwl',
    absolutePath: '',
    type: SourceFile.TypeEnum.DOCKSTORECWL,
    state: SourceFile.StateEnum.COMPLETE,
    verifiedBySource: {},
  },
  {
    content: 'potato',
    id: 3071702,
    path: '/Dockstore.json',
    absolutePath: '',
    type: SourceFile.TypeEnum.CWLTESTJSON,
    state: SourceFile.StateEnum.COMPLETE,
    verifiedBySource: {
      'Dockstore CLI': {
        metadata: 'Docktesters group',
        verified: true,
        platformVersion: null,
      },
    },
  },
];

export const elasticSearchResponse: Hit[] = [
  {
    _index: 'tools',
    _type: '_doc',
    _id: '2313',
    _score: 1,
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
      default_dockerfile_path: '/delly_docker/Dockerfile',
      is_published: true,
      toolname: null,
      last_modified_date: null,
      checker_id: null,
      private_access: false,
      descriptorType: ['CWL'],
      mode: 'MANUAL_IMAGE_PATH',
      lastBuild: null,
      lastUpdated: 1513149095843,
      path: 'registry.hub.docker.com/weischenfeldt/pcawg_delly_workflow',
      defaultCWLTestParameterFile: '/test.json',
      workflowVersions: [
        {
          doiURL: null,
          dois: {},
          dbUpdateDate: null,
          versionEditor: null,
          verifiedSource: null,
          verified: false,
          referenceType: 'UNSET',
          frozen: false,
          commitID: null,
          dockerfile_path: '/delly_docker/Dockerfile',
          last_built: null,
          doiStatus: 'NOT_REQUESTED',
          wdl_path: '/delly_docker/Dockstore.wdl',
          automated: false,
          size: 0,
          cwl_path: '/delly_docker/Dockstore.cwl',
          id: 8459,
          image_id: '',
        },
        {
          doiURL: null,
          dois: {},
          dbUpdateDate: null,
          versionEditor: null,
          verifiedSource: null,
          verified: false,
          referenceType: 'UNSET',
          frozen: false,
          commitID: null,
          dockerfile_path: '/delly_docker/Dockerfile',
          last_built: null,
          doiStatus: 'NOT_REQUESTED',
          wdl_path: '/delly_docker/Dockstore.wdl',
          automated: false,
          size: 0,
          cwl_path: '/delly_docker/Dockstore.cwl',
          id: 8458,
          image_id: '',
        },
      ],
      has_checker: false,
      id: 2313,
      last_modified: null,
      email: 'briandoconnor@gmail.com',
      default_wdl_path: '/delly_docker/Dockstore.wdl',
      tool_path: 'registry.hub.docker.com/weischenfeldt/pcawg_delly_workflow',
      registry: 'DOCKER_HUB',
      dbUpdateDate: null,
      registry_string: 'registry.hub.docker.com',
      tags: null,
      dbCreateDate: null,
      topicId: null,
      custom_docker_registry_path: 'registry.hub.docker.com',
      default_cwl_path: '/delly_docker/Dockstore.cwl',
      name: 'pcawg_delly_workflow',
      namespace: 'weischenfeldt',
      gitUrl: 'git@bitbucket.org:weischenfeldt/pcawg_delly_workflow.git',
      defaultWDLTestParameterFile: '/test.json',
      defaultVersion: 'DELLYlegacy',
    },
  },
  {
    _index: 'workflows',
    _type: '_doc',
    _id: '2210',
    _score: 1,
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
      type: 'BioWorkflow',
      repository: 'Ginny-9609498',
      source_control_provider: 'GITHUB',
      descriptorType: 'CWL',
      full_workflow_path: 'github.com/smc-rna-challenge/Ginny-9609498/Ginny-9609498',
      mode: 'FULL',
      lastUpdated: 1496192152500,
      path: 'github.com/smc-rna-challenge/Ginny-9609498',
      workflowVersions: [
        {
          doiURL: null,
          dois: {},
          dbUpdateDate: null,
          subClass: null,
          versionEditor: null,
          verifiedSource: null,
          verified: false,
          frozen: false,
          referenceType: 'UNSET',
          commitID: null,
          id: 8288,
          doiStatus: 'NOT_REQUESTED',
        },
      ],
      sourceControl: 'github.com',
      has_checker: false,
      id: 2210,
      last_modified: null,
      email: 'Ginny@synapse.org',
      dbUpdateDate: null,
      author: 'Ginny',
      defaultTestParameterFilePath: '/test.json',
      workflowName: 'Ginny-9609498',
      workflow_path: '/main.cwl',
      dbCreateDate: null,
      topicId: null,
      parent_id: null,
      organization: 'smc-rna-challenge',
      gitUrl: 'git@github.com:smc-rna-challenge/Ginny-9609498.git',
      defaultVersion: null,
    },
  },
];

export const exampleEntry: Version = {
  commitID: null,
  dbUpdateDate: 1568664818354,
  dirtyBit: true,
  doiStatus: 'NOT_REQUESTED',
  doiURL: null,
  dois: {},
  frozen: false,
  hidden: false,
  id: 25247,
  input_file_formats: [],
  name: 'develop',
  output_file_formats: [],
  reference: 'develop',
  referenceType: 'UNSET',
  valid: false,
  validations: [
    {
      id: 21835,
      message: '{"/Dockstore.cwl":"Primary CWL descriptor is not present."}',
      type: 'DOCKSTORE_CWL',
      valid: false,
    },
    {
      id: 21836,
      message: '{"/Dockstore.wdl":"Primary WDL descriptor is not present."}',
      type: 'DOCKSTORE_WDL',
      valid: false,
    },
    {
      id: 21837,
      message: '{"/Dockerfile":"Missing a Dockerfile."}',
      type: 'DOCKERFILE',
      valid: false,
    },
    {
      id: 21838,
      message: '{}',
      type: 'CWL_TEST_JSON',
      valid: true,
    },
    {
      id: 21839,
      message: '{}',
      type: 'WDL_TEST_JSON',
      valid: true,
    },
  ],
  verified: false,
  verifiedSource: null,
  versionEditor: null,
  workingDirectory: '',
};

export const validTool: ExtendedDockstoreTool = {
  defaultCWLTestParameterFile: '',
  defaultWDLTestParameterFile: '',
  default_cwl_path: '',
  default_dockerfile_path: '',
  default_wdl_path: '',
  gitUrl: 'git@github.com:denis-yuen/dockstore-tool-bamstats.git',
  mode: DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSAUTOMATEDBUILDS,
  tool_path: 'quay.io/potato/beef/stew',
  path: 'quay.io/dockstore-testing/dockstore-tool-bamstats',
  name: '',
  namespace: '',
  private_access: false,
  registry_string: 'quay.io',
  registry: DockstoreTool.RegistryEnum.QUAYIO,
  toolname: null,
};

export const mockedNotification: Notification = {
  id: 123,
  message: 'TestingTesting123',
  type: 'SITEWIDE',
  priority: 'LOW',
  expiration: null,
};

export const expiredMockNotification: Notification = {
  id: 121,
  message: 'Testing123',
  type: 'SITEWIDE',
  priority: 'LOW',
  expiration: new Date('2018-11-25T00:00:00').getTime(),
};
