import { TooltipConfig } from 'ngx-bootstrap/tooltip';
export const Tooltip = {
    'testParameterFile': 'Relative path to a WDL/CWL Test Parameter File in the Git repository.',
    'workflowPath': 'Path in Git repository to main descriptor file',
    'defaultVersionUser': 'The branch that the tool/workflow author intends others to use',
    'defaultVersionAuthor': 'Set default version. The default version denotes the version of the tool/workflow you intend others to use. ' +
    'The default version determines what is displayed in the Info tab (Description, Launch With, etc)',
    'workflowName': 'Name to distinguish between multiple workflows within the same repository'
};

export function getTooltipConfig(): TooltipConfig {
    return Object.assign(new TooltipConfig(), { placement: 'auto' });
}

