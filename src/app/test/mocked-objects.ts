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
