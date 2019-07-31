import { TooltipConfig } from 'ngx-bootstrap/tooltip';
export const Tooltip = {
  testParameterFile: 'Relative path to a WDL/CWL Test Parameter File in the Git repository',
  workflowPath: 'Path in Git repository to main descriptor file',
  defaultVersionUser: 'The branch that the tool/workflow author intends others to use',
  defaultVersionAuthor:
    'Set default version. The default version denotes the version you intend others to use. ' +
    'The default version determines the authorship information and description displayed in the info tab',
  workflowName: 'Name to distinguish between multiple workflows within the same repository',
  repository: 'Repository name within Dockstore'
};

export function getTooltipConfig(): TooltipConfig {
  return Object.assign(new TooltipConfig(), { placement: 'auto' });
}
