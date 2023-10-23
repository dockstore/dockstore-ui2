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
import { EntryType } from './enum/entry-type';
import { DockstoreTool, Workflow } from './openapi';
import { UrlResolverService } from './url-resolver.service';

export abstract class MyEntriesService<E extends DockstoreTool | Workflow, O extends OrgToolObject<E> | OrgWorkflowObject<E>> {
  protected constructor(protected urlResolverService: UrlResolverService) {}

  recomputeWhatEntryToSelect(entries: E[]): E | null {
    const entryPath = this.urlResolverService.getEntryPathFromUrl();
    const foundEntry = this.findEntryFromPath(entryPath, entries);
    if (foundEntry) {
      console.log('FOUND ' + entryPath);
      return foundEntry;
    } else {
      console.log('NOT FOUND ' + entryPath);
      let initialEntry;
      const orgEntryObjects = this.convertEntriesToOrgEntryObject(entries, null);
      const foundOrgEntryObject = this.matchingOrgEntryObjectByPath(orgEntryObjects, entryPath);
      if (foundOrgEntryObject) {
        // If the entry from the URL doesn't exist, pick an entry from the same organization
        initialEntry = this.getInitialEntry([...foundOrgEntryObject.published, ...foundOrgEntryObject.unpublished]);
      } else {
        // Use the initial entry from all entries
        initialEntry = this.getInitialEntry(entries);
      }
      return initialEntry ? initialEntry : null;
    }
  }

  convertEntriesToOrgEntryObject(entries: E[] | null, selectedEntry: E): O[] {
    if (!entries) {
      return [];
    }
    const orgEntryObjects: O[] = [];
    entries.forEach((entry) => {
      const existingOrgEntryObject = this.matchingOrgEntryObject(orgEntryObjects, entry);
      if (existingOrgEntryObject) {
        if (entry.is_published) {
          existingOrgEntryObject.published.push(entry);
        } else {
          existingOrgEntryObject.unpublished.push(entry);
        }
      } else {
        orgEntryObjects.push(this.createNewOrgEntryObject(entry));
      }
    });
    this.recursiveSortOrgEntryObjects(orgEntryObjects);
    if (selectedEntry) {
      this.setExpand(orgEntryObjects, selectedEntry);
    }
    return orgEntryObjects;
  }

  protected createPartial(entry: E) {
    return {
      published: entry.is_published ? [entry] : [],
      unpublished: entry.is_published ? [] : [entry],
      expanded: false,
    };
  }

  /**
   * Gets all the user's current entries for a specific entry type (Tool, BioWorkflow, Service)
   *
   * @abstract
   * @memberof MyEntriesService
   */
  abstract getMyEntries(userId: number, entryType: EntryType): void;
  abstract registerEntry(entryType: EntryType): void;

  protected findEntryFromPath(path: string | null, entries: Array<E> | null): E | null | undefined {
    if (!path || !entries || entries.length === 0) {
      return null;
    }
    return entries.find((entry) => this.getPath(entry) === path);
  }

  abstract getPath(entry: E): string;

  /**
   * Precondition: URL does not yield any useful entry
   * Select the first published entry. If there's no published, select the first unpublished entry.
   * @param entries
   */
  protected getInitialEntry(entries: Array<E> | null): E | null {
    if (!entries || entries.length === 0) {
      return null;
    }
    entries.sort(this.sortEntry);
    const publishedEntries = entries.filter((entry) => entry.is_published);
    if (publishedEntries.length > 0) {
      return publishedEntries[0];
    } else {
      return entries[0];
    }
  }

  protected sortEntriesOfOrgEntryObjects(orgEntryObjects: O[]) {
    orgEntryObjects.forEach((orgEntryObject: O) => {
      orgEntryObject.published.sort(this.sortEntry);
      orgEntryObject.unpublished.sort(this.sortEntry);
    });
  }

  protected abstract sortEntry(entryA: E, entryB: E): number;

  protected recursiveSortOrgEntryObjects(orgEntriesObjects: O[]) {
    this.sortEntriesOfOrgEntryObjects(orgEntriesObjects);
    orgEntriesObjects.sort(this.sortOrgEntryObjects);
  }

  protected abstract sortOrgEntryObjects(orgEntryObjectA: O, orgEntryObjectB: O): number;

  protected abstract createNewOrgEntryObject(entry: E): O;

  protected setExpand(orgEntryObjects: O[], selectedEntry: E | null) {
    if (!selectedEntry) {
      return;
    }
    const foundOrgEntryObject = this.matchingOrgEntryObject(orgEntryObjects, selectedEntry);
    if (foundOrgEntryObject) {
      foundOrgEntryObject.expanded = true;
    }
  }

  protected abstract matchingOrgEntryObject(orgEntryObjects: O[], selectedEntry: E): O | undefined;

  protected abstract matchingOrgEntryObjectByPath(orgEntryObjects: O[], entryPath: string): O | undefined | null;
}
