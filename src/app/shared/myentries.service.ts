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
import { Injectable } from '@angular/core';
import { Base } from './base';
import { EntryType } from './enum/entry-type';

@Injectable()
export abstract class MyEntriesService extends Base {
  /**
   * Find the index for the group that the entry belongs to
   * @param  orgWorkflows Array of grouped entries
   * @param  group        Group to place entry in
   * @return              The index of the entry group
   */
  protected abstract getGroupIndex(groupEntries: any[], group: string): number;

  /**
   * Sorts the groups of entries and returns
   * @param  groupEntries Array of groups of entries by partial path
   * @param  username     Dockstore username
   * @param  type         either tool or workflow
   * @return              A sorted array of entries grouped together
   */
  sortGroups(groupEntries: any[], username: string, type: string): any {
    let sortedGroupEntries = [];
    /* User's entries Appear in First Section */
    let unIndex = -1;
    let orIndex = -1;
    let orGroupObj = null;
    for (let i = 0; i < groupEntries.length; i++) {
      if (groupEntries[i][type] === username) {
        unIndex = i;
        sortedGroupEntries.push(groupEntries[i]);
      } else if (groupEntries[i][type] === '_') {
        orIndex = i;
        orGroupObj = {
          organization: 'Others',
          namespace: 'Others',
          entries: groupEntries[i].entries
        };
      }
    }
    if (unIndex >= 0) {
      groupEntries.splice(unIndex, 1);
    }
    if (orIndex >= 0) {
      groupEntries.splice(unIndex < orIndex ? orIndex - 1 : orIndex, 1);
    }

    const path = type === 'workflow' ? 'organization' : 'namespace';

    sortedGroupEntries = sortedGroupEntries.concat(
      groupEntries.sort(function(a, b) {
        if ((a.sourceControl + '/' + a[path]).toLowerCase() < (b.sourceControl + '/' + b[path]).toLowerCase()) {
          return -1;
        }
        if ((a.sourceControl + '/' + a[path]).toLowerCase() > (b.sourceControl + '/' + b[path]).toLowerCase()) {
          return 1;
        }
        return 0;
      })
    );
    if (orIndex >= 0) {
      sortedGroupEntries.push(orGroupObj);
    }
    return sortedGroupEntries;
  }

  /**
   * Sorts and groups entries by source control and organization for workflows and registry and namespace
   * for tools.
   * @param  entries  Array of entries (tools or workflows)
   * @param  username Dockstore username
   * @param  type     Either tool or workflow
   * @return          A sorted array of entries grouped together
   */
  sortGroupEntries(entries: any[], username: string, type: EntryType): any {
    const groupEntries = [];
    for (let i = 0; i < entries.length; i++) {
      const prefix = entries[i].path.split('/', 2).join('/');
      let pos = this.getGroupIndex(groupEntries, prefix);
      if (pos < 0) {
        groupEntries.push({
          sourceControl: entries[i].path.split('/')[0],
          organization: entries[i].path.split('/')[1],
          namespace: prefix,
          entries: [],
          isFirstOpen: false
        });
        pos = groupEntries.length - 1;
      }
      groupEntries[pos].entries.push(entries[i]);
    }

    const path = type === EntryType.BioWorkflow || type === EntryType.Service ? 'full_workflow_path' : 'tool_path';

    groupEntries.forEach(groupEntry => {
      groupEntry.entries.sort((a, b) => {
        if (a[path].toLowerCase() < b[path].toLowerCase()) {
          return -1;
        }
        if (a[path].toLowerCase() > b[path].toLowerCase()) {
          return 1;
        }
        return 0;
      });
    });
    /* Return Namespaces w/ Nested Containers */
    return this.sortGroups(groupEntries, username, type);
  }

  /**
   * Gets all the user's current entries for a specific entry type (Tool, BioWorkflow, Service)
   *
   * @abstract
   * @memberof MyEntriesService
   */
  abstract getMyEntries(userId: number, entryType: EntryType): void;
  abstract registerEntry(entryType: EntryType): void;
}
