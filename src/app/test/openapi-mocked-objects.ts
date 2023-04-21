import { Workflow, DockstoreTool, CollectionEntry, EntryType } from '../shared/openapi';

export const sampleWorkflow1: Workflow = {
  type: 'whatever',
  id: 1,
  gitUrl: 'updatedGitUrl',
  mode: Workflow.ModeEnum.FULL,
  organization: 'updatedOrganization',
  repository: 'updatedRepository',
  workflow_path: 'updatedWorkflowPath',
  workflowVersions: [],
  defaultTestParameterFilePath: 'updatedTestParameterPath',
  sourceControl: 'github.com',
  source_control_provider: 'GITHUB',
  full_workflow_path: 'github.com/updatedOrganization/updatedWorkflowPath',
  entryTypeMetadata: {
    searchEntryType: 'workflows',
    searchSupported: true,
    sitePath: 'workflows',
    term: 'workflow',
    termPlural: 'workflows',
    trsPrefix: '#workflow/',
    trsSupported: true,
    type: 'WORKFLOW',
  },
};

export const sampleTool1: DockstoreTool = {
  id: 1,
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
  tool_path: 'quay.io/sampleNamespace/sampleName',
  entryTypeMetadata: {
    searchEntryType: 'tools',
    searchSupported: true,
    sitePath: 'containers',
    term: 'tool',
    termPlural: 'tools',
    trsPrefix: '',
    trsSupported: true,
    type: 'TOOL',
  },
};

// Tool Collection entry
export const sampleCollectionEntry1: CollectionEntry = {
  categories: [],
  dbUpdateDate: 1648777051404,
  descriptorTypes: ['CWL'],
  entryPath: 'quay.io/pancancer/pcawg-dkfz-workflow',
  entryType: 'tool',
  id: 188,
  labels: ['variant-caller', 'pcawg'],
  verified: true,
  versionName: null,
};

// Notebook Collection entry with version
export const sampleCollectionEntry2: CollectionEntry = {
  categories: [],
  dbUpdateDate: 1681400016194,
  descriptorTypes: ['jupyter'],
  entryPath: 'github.com/david4096/simple-notebook/simplers',
  entryType: 'notebook',
  id: 21113,
  labels: ['book'],
  verified: false,
  versionName: 'version',
};
