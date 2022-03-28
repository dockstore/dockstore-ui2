import { Workflow } from '../shared/openapi';

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
};
