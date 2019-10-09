/*
 *     Copyright 2018 OICR
 *
 *     Licensed under the Apache License, Version 2.0 (the "License")
 *     you may not use this file except in compliance with the License
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */
import { OrgToolObject } from 'app/mytools/my-tool/my-tool.component';
import { OrgWorkflowObject } from 'app/myworkflows/my-workflow/my-workflow.component';
import { Base } from './base';
import { EntryType } from './enum/entry-type';
import { DockstoreTool, Workflow } from './swagger';
import { UrlResolverService } from './url-resolver.service';

export abstract class MyEntriesService extends Base {
  constructor(protected urlResolverService: UrlResolverService) {
    super();
  }

  /**
   * Gets all the user's current entries for a specific entry type (Tool, BioWorkflow, Service)
   *
   * @abstract
   * @memberof MyEntriesService
   */
  abstract getMyEntries(userId: number, entryType: EntryType): void;
  abstract registerEntry(entryType: EntryType): void;

  protected findEntryFromPath(path: string | null, entries: Array<DockstoreTool | Workflow> | null): DockstoreTool | Workflow | null {
    if (!path || !entries || entries.length === 0) {
      return null;
    }
    return entries.find(entry => {
      if (this.isWorkflow(entry)) {
        return entry.full_workflow_path === path;
      } else {
        return entry.tool_path === path;
      }
    });
  }

  /**
   * Precondition: URL does not yield any useful tool
   * Select the first published tool. If there's no published, select the first unpublished tool.
   * @param entries
   */
  protected getInitialEntry(entries: Array<DockstoreTool | Workflow> | null): DockstoreTool | Workflow | null {
    if (!entries || entries.length === 0) {
      return null;
    }
    const publishedEntries = entries.filter(entry => entry.is_published);
    if (publishedEntries.length > 0) {
      publishedEntries.sort(this.sortEntry);
      return publishedEntries[0];
    } else {
      return entries[0];
    }
  }
  isWorkflow(entry: DockstoreTool | Workflow): entry is Workflow {
    return (entry as Workflow).full_workflow_path !== undefined;
  }
  protected sortEntry(entryA: DockstoreTool | Workflow, toolB: DockstoreTool | Workflow) {
    function isWorkflow(entry: DockstoreTool | Workflow): entry is Workflow {
      return (entry as Workflow).full_workflow_path !== undefined;
    }
    const keyA = isWorkflow(entryA) ? entryA.full_workflow_path.toLowerCase() : entryA.tool_path.toLowerCase();
    const keyB = isWorkflow(toolB) ? toolB.full_workflow_path.toLowerCase() : toolB.tool_path.toLowerCase();
    return keyA.localeCompare(keyB);
  }

  protected sortEntriesOfOrgEntryObjects(orgEntryObjects: OrgToolObject[] | OrgWorkflowObject[]) {
    orgEntryObjects.forEach((orgEntryObject: OrgToolObject | OrgWorkflowObject) => {
      orgEntryObject.published.sort(this.sortEntry);
      orgEntryObject.unpublished.sort(this.sortEntry);
    });
  }

  recomputeWhatEntryToSelect(tools: Workflow[] | DockstoreTool[]): DockstoreTool | Workflow | null {
    const foundTool = this.findEntryFromPath(this.urlResolverService.getEntryPathFromUrl(), tools);
    if (foundTool) {
      return foundTool;
    } else {
      const initialEntry = this.getInitialEntry(tools);
      if (initialEntry) {
        return initialEntry;
      } else {
        return null;
      }
    }
  }
}
