import { Pipe, PipeTransform } from '@angular/core';
import { CollectionEntry, Workflow, DockstoreTool, EntryType } from '../shared/openapi';
import { EntryTypeMetadataService } from './type-metadata/entry-type-metadata.service';

@Pipe({
  name: 'routerLink',
  standalone: true,
})
export class RouterLinkPipe implements PipeTransform {
  constructor(private entryTypeMetadataService: EntryTypeMetadataService) {}

  /**
   * Returns the complete path for a workflow, tool, or collection entry
   * To be used for routerLink navigation
   *
   * @param entry
   * @returns string | null
   */
  transform(entry: DockstoreTool | Workflow | CollectionEntry): string | null {
    if (!entry) {
      return null;
    }

    if ((entry as Workflow).full_workflow_path) {
      const workflow = entry as Workflow;
      return '/' + workflow.entryTypeMetadata.sitePath + '/' + workflow.full_workflow_path;
    }
    if ((entry as DockstoreTool).tool_path) {
      const tool = entry as DockstoreTool;
      return '/' + tool.entryTypeMetadata.sitePath + '/' + tool.tool_path;
    }
    if ((entry as CollectionEntry).entryPath) {
      const collectionEntry = entry as CollectionEntry;
      const entryTypeMetadata = this.entryTypeMetadataService.get(collectionEntry.entryType.toUpperCase() as EntryType);

      if (collectionEntry.versionName) {
        return '/' + entryTypeMetadata.sitePath + '/' + collectionEntry.entryPath + ':' + collectionEntry.versionName;
      } else {
        return '/' + entryTypeMetadata.sitePath + '/' + collectionEntry.entryPath;
      }
    }

    return null;
  }
}
