import { Pipe, PipeTransform } from '@angular/core';
import { EntryType } from '../shared/enum/entry-type';
import { Workflow } from '../shared/openapi';

@Pipe({
  name: 'routerLink',
})
export class RouterLinkPipe implements PipeTransform {
  transform(entryType: EntryType, workflow: Workflow): String | null {
    if (!workflow || !entryType) {
      return null;
    }
    switch (entryType) {
      case EntryType.BioWorkflow:
        return '/workflows/' + workflow.full_workflow_path;
      case EntryType.Service:
        return '/services/' + workflow.full_workflow_path;
      case EntryType.AppTool:
        return '/containers/' + workflow.full_workflow_path;
    }
    return null;
  }
}
