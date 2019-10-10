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

export abstract class MyEntriesService<E extends DockstoreTool | Workflow, U extends OrgToolObject<E> | OrgWorkflowObject<E>> extends Base {
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

  protected findEntryFromPath(path: string | null, entries: Array<E> | null): E | null {
    if (!path || !entries || entries.length === 0) {
      return null;
    }
    return entries.find(entry => this.getPath(entry) === path);
  }

  abstract getPath(entry: DockstoreTool | Workflow): string;

  /**
   * Precondition: URL does not yield any useful tool
   * Select the first published tool. If there's no published, select the first unpublished tool.
   * @param entries
   */
  protected getInitialEntry(entries: Array<E> | null): E | null {
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

  protected sortEntriesOfOrgEntryObjects(orgEntryObjects: U[]) {
    orgEntryObjects.forEach((orgEntryObject: U) => {
      orgEntryObject.published.sort(this.sortEntry);
      orgEntryObject.unpublished.sort(this.sortEntry);
    });
  }

  protected abstract sortEntry(entryA: E, entryB: E): number;

  protected recursiveSortOrgToolObjects(orgWorkflowObjects: U[]) {
    this.sortEntriesOfOrgEntryObjects(orgWorkflowObjects);
    orgWorkflowObjects.sort(this.sortOrgEntryObjects);
  }

  protected abstract sortOrgEntryObjects(thing: U, thing2: U): number;

  recomputeWhatEntryToSelect(tools: E[]): E | null {
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
  convertEntriesToOrgEntryObject(workflows: E[] | null, selectedWorkflow: E): U[] {
    if (!workflows) {
      return [];
    }
    const orgWorkflowObjects: U[] = [];
    workflows.forEach(workflow => {
      const existingOrgWorkflowObject = this.matchingOrgEntryObject(orgWorkflowObjects, workflow);
      if (existingOrgWorkflowObject) {
        if (workflow.is_published) {
          existingOrgWorkflowObject.published.push(workflow);
        } else {
          existingOrgWorkflowObject.unpublished.push(workflow);
        }
      } else {
        orgWorkflowObjects.push(this.createNewOrgEntryObject(workflow));
      }
    });
    this.recursiveSortOrgToolObjects(orgWorkflowObjects);
    this.setExpand(orgWorkflowObjects, selectedWorkflow);
    return orgWorkflowObjects;
  }

  protected abstract createNewOrgEntryObject(entry: E): U;

  protected setExpand(orgWorkflowObjects: U[], selectedWorkflow: E | null) {
    if (!selectedWorkflow) {
      return;
    }
    const foundOrgWorkflowObject = this.matchingOrgEntryObject(orgWorkflowObjects, selectedWorkflow);
    if (foundOrgWorkflowObject) {
      foundOrgWorkflowObject.expanded = true;
    }
  }

  protected abstract matchingOrgEntryObject(orgEntryObjects: U[], selectedEntry: E): U;
}
