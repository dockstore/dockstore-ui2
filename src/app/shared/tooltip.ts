import { TooltipConfig } from 'ngx-bootstrap/tooltip';
export const Tooltip = {
    'testParameterFile' : 'Relative path to a WDL/CWL Test Parameter File in the Git repository.',
    'workflowPath': 'Path in Git repository to main descriptor file'
};

export function getTooltipConfig(): TooltipConfig {
    return Object.assign(new TooltipConfig(), {placement: 'right'});
  }

