import { Pipe, PipeTransform } from '@angular/core';
import { Event } from 'app/shared/openapi';
import { EntryToDisplayNamePipe } from '../entry-to-display-name.pipe';
import { EntryType } from '../../shared/enum/entry-type';

@Pipe({
  name: 'recentEvents',
})
// TO DO: Accomidate for notebooks and services when we can retrieve those events
export class RecentEventsPipe implements PipeTransform {
  private EntryType = EntryType;

  /**
   * Takes in an event object and extracts details used in the RecentEventsComponent
   *
   * @param {Event} event
   * @param {string} type 'displayName' | 'entryLink' | 'entryType' | 'orgLink' | 'collectionLink'
   * @returns String | null
   */
  transform(event: Event, type: 'displayName' | 'entryLink' | 'entryType' | 'orgLink' | 'collectionLink'): String | null {
    let entryToDisplayNamePipe = new EntryToDisplayNamePipe();

    if (!event || !type) {
      return null;
    }

    switch (type) {
      case 'displayName': {
        if (event.workflow) {
          return entryToDisplayNamePipe.transform(event.workflow);
        } else if (event.tool) {
          return entryToDisplayNamePipe.transform(event.tool);
        } else if (event.apptool) {
          return entryToDisplayNamePipe.transform(event.apptool);
        }
      }
      case 'entryLink': {
        if (event.workflow) {
          return '/workflows/' + event.workflow.full_workflow_path;
        } else if (event.tool) {
          return '/tools/' + event.tool.tool_path;
        } else if (event.apptool) {
          return '/tools/' + event.apptool.full_workflow_path;
        }
      }
      case 'entryType': {
        return event.tool || event.apptool ? this.EntryType.Tool : this.EntryType.BioWorkflow;
      }
      case 'orgLink': {
        return '/organizations/' + event.organization.name;
      }
      case 'collectionLink': {
        return '/organizations/' + event.organization.name + '/collections/' + event.collection.name;
      }
    }
  }
}
