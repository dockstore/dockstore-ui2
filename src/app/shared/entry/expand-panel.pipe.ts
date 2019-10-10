import { Pipe, PipeTransform } from '@angular/core';
import { OrgToolObject } from '../../mytools/my-tool/my-tool.component';
import { OrgWorkflowObject } from '../../myworkflows/my-workflow/my-workflow.component';
import { ExtendedDockstoreTool } from '../models/ExtendedDockstoreTool';
import { ExtendedWorkflow } from '../models/ExtendedWorkflow';
import { DockstoreTool, Entry, Workflow } from '../swagger';

@Pipe({
  name: 'expandPanel'
})
export class ExpandPanelPipe implements PipeTransform {
  /**
   * Decides whether the expansion panel is open or not
   *
   * @param {((OrgToolObject | OrgWorkflowObject))} orgEntriesObject  Either the orgToolObject or orgWorkflowObject
   * @param {number} entryId  ID of the currently selected workflow
   * @returns {boolean}  true if open, false if not open
   * @memberof ExpandPanelPipe
   */
  transform(orgEntriesObject: OrgToolObject<DockstoreTool> | OrgWorkflowObject<Workflow>, entryId: number): boolean {
    const publishedEntries: Array<ExtendedDockstoreTool | ExtendedWorkflow> = orgEntriesObject.published;
    const unpublishedEntries: Array<ExtendedDockstoreTool | ExtendedWorkflow> = orgEntriesObject.unpublished;
    if (publishedEntries.find((entry: Entry) => entry.id === entryId) || unpublishedEntries.find((entry: Entry) => entry.id === entryId)) {
      return true;
    } else {
      return false;
    }
  }
}
