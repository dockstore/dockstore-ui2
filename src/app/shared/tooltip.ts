import { TooltipConfig } from 'ngx-bootstrap/tooltip';
export const Tooltip = {
    'testParameterFile': 'Relative path to a WDL/CWL Test Parameter File in the Git repository.',
    'workflowPath': 'Path in Git repository to main descriptor file',
    'defaultBranchUser': 'The branch that the tool/workflow author intends others to use',
    'defaultBranchAuthor': 'Set default version.  The default version denotes the version of the tool/workflow you intend others to use. ' +
    'The default version determines what is displayed in the Info tab (Description, Launch With, etc)'
};

export function getTooltipConfig(): TooltipConfig {
    return Object.assign(new TooltipConfig(), { placement: 'auto' });
}

