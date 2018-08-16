/*
 *    Copyright 2018 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { Pipe, PipeTransform } from '@angular/core';

import { OrgToolObject } from '../../mytools/my-tool/my-tool.component';
import { OrgWorkflowObject } from '../../myworkflows/my-workflow/my-workflow.component';
import { ExtendedDockstoreTool } from '../models/ExtendedDockstoreTool';
import { ExtendedWorkflow } from '../models/ExtendedWorkflow';
import { Entry } from '../swagger';

@Pipe({
  name: 'selectTab'
})
export class SelectTabPipe implements PipeTransform {
  /**
   * Decides which tab of an expansion panel is selected.
   * 1. If the currently selected entry is in one of those tabs, select that tab
   * 2. Otherwise, if there are any published entries, select the published tab
   * 3. Select the unpublished tab
   *
   * @param {((OrgToolObject | OrgWorkflowObject))} orgEntriesObject  Either the orgToolObject or orgWorkflowObject
   * @param {number} entryId  ID of the currently selected workflow
   * @returns {number}  0 if published, 1 if unpublished
   * @memberof SelectTabPipe
   */
  transform(orgEntriesObject: (OrgToolObject | OrgWorkflowObject), entryId: number): number {
    const publishedEntries: Array<ExtendedDockstoreTool | ExtendedWorkflow> = orgEntriesObject.published;
    const unpublishedEntries: Array<ExtendedDockstoreTool | ExtendedWorkflow> = orgEntriesObject.unpublished;
    if (publishedEntries.find((entry: Entry) => entry.id === entryId)) {
      return 0;
    }
    if (unpublishedEntries.find((entry: Entry) => entry.id === entryId)) {
      return 1;
    }
    if (publishedEntries.length > 0) {
      return 0;
    } else {
      return 1;
    }
  }
}
