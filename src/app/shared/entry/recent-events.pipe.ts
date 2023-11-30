import { Inject, Pipe, PipeTransform } from '@angular/core';
import { Event, DockstoreTool, Workflow } from 'app/shared/openapi';
import { EntryToDisplayNamePipe } from '../entry-to-display-name.pipe';
import { EntryType } from '../../shared/enum/entry-type';

@Pipe({
  name: 'recentEvents',
})
export class RecentEventsPipe implements PipeTransform {
  private EntryType = EntryType;
  constructor(@Inject(EntryToDisplayNamePipe) private entryToDisplayNamePipe: EntryToDisplayNamePipe) {}

  /**
   * Takes in an event object and extracts details used in the RecentEventsComponent
   *
   * @param {Event} event
   * @param {string} type 'displayName' | 'entryLink' | 'entryType' | 'orgLink' | 'collectionLink'
   * @returns string | null
   */
  transform(event: Event, type: 'displayName' | 'entryLink' | 'entryType' | 'orgLink' | 'collectionLink'): string | null {
    if (!event || !type) {
      return null;
    }

    switch (type) {
      case 'displayName': {
        const entry = this.getEntry(event);
        return entry && this.entryToDisplayNamePipe.transform(entry);
      }
      case 'entryLink': {
        const entry = this.getEntry(event);
        return entry && '/' + entry.entryTypeMetadata.sitePath + '/' + this.getPath(entry);
      }
      case 'entryType': {
        return this.getEntry(event)?.entryTypeMetadata.term ?? 'entry';
      }
      case 'orgLink': {
        return '/organizations/' + event.organization.name;
      }
      case 'collectionLink': {
        return '/organizations/' + event.organization.name + '/collections/' + event.collection.name;
      }
    }
  }

  private getEntry(event: Event): DockstoreTool | Workflow | null {
    return event.tool ?? event.workflow ?? event.apptool ?? event.service ?? event.notebook;
  }

  private getPath(entry: DockstoreTool | Workflow): string {
    return (entry as Workflow).full_workflow_path ?? (entry as DockstoreTool).tool_path;
  }
}
