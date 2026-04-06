import { Pipe, PipeTransform } from '@angular/core';
import { DockstoreTool, Workflow } from './openapi';

/**
 * This pipe converts and entry (DockstoreTool or Workflow) to a name that is missing the registry or source control
 * TODO: Better type checking
 */
@Pipe({
  name: 'entryToDisplayName',
  standalone: true,
})
export class EntryToDisplayNamePipe implements PipeTransform {
  transform(entry: DockstoreTool | Workflow, includeOrganization: boolean = false): string {
    if (!entry) {
      return '';
    }
    if ((entry as Workflow).organization) {
      const workflow = entry as Workflow;
      const displayNameArray = [];
      if (includeOrganization) {
        displayNameArray.push(workflow.organization);
      }
      displayNameArray.push(workflow.repository);
      if (workflow.workflowName) {
        displayNameArray.push(workflow.workflowName);
      }
      return displayNameArray.join('/');
    } else {
      const tool = entry as DockstoreTool;
      const displayNameArray = [];
      if (includeOrganization) {
        displayNameArray.push(tool.namespace);
      }
      displayNameArray.push(tool.name);
      if (tool.toolname) {
        displayNameArray.push(tool.toolname);
      }
      return displayNameArray.join('/');
    }
  }
}
