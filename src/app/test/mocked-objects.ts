import { Token } from './../shared/swagger/model/token';
import { DockstoreTool } from './../shared/swagger/model/dockstoreTool';
import { Workflow } from './../shared/swagger/model/workflow';
export const updatedWorkflow: Workflow = {
    'descriptorType': 'cwl',
    'gitUrl': 'updatedGitUrl',
    'mode': Workflow.ModeEnum.FULL,
    'organization': 'updatedOrganization',
    'repository': 'updatedRepository',
    'workflow_path': 'updatedWorkflowPath',
    'workflowVersions': []
};

export const sampleWorkflow1: Workflow = {
    id: 1,
    'descriptorType': 'cwl',
    'gitUrl': 'updatedGitUrl',
    'mode': Workflow.ModeEnum.FULL,
    'organization': 'updatedOrganization',
    'repository': 'updatedRepository',
    'workflow_path': 'updatedWorkflowPath',
    'workflowVersions': []
};

export const sampleWorkflow2: Workflow = {
    id: 2,
    'descriptorType': 'cwl',
    'gitUrl': 'updatedGitUrl',
    'mode': Workflow.ModeEnum.FULL,
    'organization': 'updatedOrganization',
    'repository': 'updatedRepository',
    'workflow_path': 'updatedWorkflowPath',
    'workflowVersions': []
};

export const sampleWorkflow3: Workflow = {
    id: 3,
    'descriptorType': 'cwl',
    'gitUrl': 'sampleGitUrl',
    'mode': Workflow.ModeEnum.FULL,
    'organization': 'sampleOrganization',
    'repository': 'sampleRepository',
    'workflow_path': 'sampleWorkflowPath',
    'workflowVersions': []
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
    registry: DockstoreTool.RegistryEnum.QUAYIO,
    toolname: 'sampleToolname'
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
    registry: DockstoreTool.RegistryEnum.QUAYIO,
    toolname: 'sampleToolname'
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
    registry: DockstoreTool.RegistryEnum.QUAYIO,
    toolname: 'sampleToolname'
};

export const gitLabToken: Token = {
    'id': 4,
    'tokenSource': 'gitlab.com',
    'content': 'fakeGitLabToken',
    'username': 'garyluu',
    'refreshToken': null,
    'userId': 2,
    'token': 'fakeGitLabToken'
};

export const gitHubToken: Token = {
    'id': 3,
    'tokenSource': 'github.com',
    'content': 'fakeGitHubToken',
    'username': 'garyluu',
    'refreshToken': null,
    'userId': 2,
    'token': 'fakeGitHubToken'
};

export const bitbucketToken: Token = {
    'id': 2,
    'tokenSource': 'bitbucket.org',
    'content': 'fakeBitbucketToken',
    'username': 'garyluu',
    'refreshToken': null,
    'userId': 2,
    'token': 'fakeBitbucketToken'
};

export const quayToken: Token = {
    'id': 1,
    'tokenSource': 'quay.io',
    'content': 'fakeQuayToken',
    'username': 'garyluu',
    'refreshToken': null,
    'userId': 2,
    'token': 'fakeQuayToken'
};
