import { Pipe, PipeTransform } from '@angular/core';
import { EntryType } from '../shared/enum/entry-type';
import { CollectionEntry, Workflow, DockstoreTool } from '../shared/openapi';

@Pipe({
  name: 'routerLink',
})
export class RouterLinkPipe implements PipeTransform {
  /**
   * Returns the complete path for a workflow, tool, or collection entry
   * To be used for routerLink navigation
   *
   * @param entryType
   * @param entry
   * @returns string | null
   */
  transform(entryType: EntryType, entry: DockstoreTool | Workflow | CollectionEntry): string | null {
    if (!entry || !entryType) {
      return null;
    }

    if ((entry as Workflow).full_workflow_path) {
      const workflow = entry as Workflow;
      switch (entryType) {
        case EntryType.BioWorkflow:
          return '/workflows/' + workflow.full_workflow_path;
        case EntryType.Service:
          return '/services/' + workflow.full_workflow_path;
        case EntryType.AppTool:
          return '/containers/' + workflow.full_workflow_path;
        case EntryType.Notebook:
          return '/notebooks/' + workflow.full_workflow_path;
      }
    }
    if ((entry as DockstoreTool).tool_path) {
      return '/containers/' + (entry as DockstoreTool).tool_path;
    }
    if ((entry as CollectionEntry).entryPath) {
      const collectionEntry = entry as CollectionEntry;
      if (collectionEntry.versionName) {
        switch (collectionEntry.entryType) {
          case EntryType.BioWorkflow:
            return '/workflows/' + collectionEntry.entryPath + ':' + collectionEntry.versionName;
          case EntryType.Service:
            return '/services/' + collectionEntry.entryPath + ':' + collectionEntry.versionName;
          case EntryType.AppTool:
            return '/containers/' + collectionEntry.entryPath + ':' + collectionEntry.versionName;
          case EntryType.Notebook:
            return '/notebooks/' + collectionEntry.entryPath + ':' + collectionEntry.versionName;
          case EntryType.Tool:
            return '/containers/' + collectionEntry.entryPath + ':' + collectionEntry.versionName;
        }
      } else {
        switch (collectionEntry.entryType) {
          case EntryType.BioWorkflow:
            return '/workflows/' + collectionEntry.entryPath;
          case EntryType.Service:
            return '/services/' + collectionEntry.entryPath;
          case EntryType.AppTool:
            return '/containers/' + collectionEntry.entryPath;
          case EntryType.Notebook:
            return '/notebooks/' + collectionEntry.entryPath;
          case EntryType.Tool:
            return '/containers/' + collectionEntry.entryPath;
        }
      }
    }

    return null;
  }
}
