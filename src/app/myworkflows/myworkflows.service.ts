/*
 *    Copyright 2017 OICR
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

import {Injectable} from '@angular/core';
import { Workflow } from './../shared/swagger/model/workflow';

@Injectable()
export class MyWorkflowsService {
  constructor() {
  }

  getORGIndex(orgWorkflows: any[], organization: string): number {
    for (let i = 0; i < orgWorkflows.length; i++) {
      if (orgWorkflows[i].organization === organization) {
        return i;
      }
    }
    return -1;
  }

  sortNamespaces(orgWorkflows: any[], username: string): any {
    let sortedorgWorkflows = [];
    /* User's Workflows Appear in First Section */
    let unIndex = -1;
    let orIndex = -1;
    let orORGObj = null;
    for (let i = 0; i < orgWorkflows.length; i++) {
      if (orgWorkflows[i].organization === username) {
        unIndex = i;
        sortedorgWorkflows.push(orgWorkflows[i]);
      } else if (orgWorkflows[i].organization === '_') {
        orIndex = i;
        orORGObj = {
          organization: 'Others',
          workflows: orgWorkflows[i].workflows
        };
      }
    }
    if (unIndex >= 0) {
      orgWorkflows.splice(unIndex, 1);
    }
    if (orIndex >= 0) {
      orgWorkflows.splice(
        (unIndex < orIndex) ? orIndex - 1 : orIndex,
        1
      );
    }
    sortedorgWorkflows = sortedorgWorkflows.concat(
      orgWorkflows.sort(function(a, b) {
        if (a.organization < b.organization) {
          return -1;
        }
        if (a.organization > b.organization) {
          return 1;
        }
        return 0;
      })
    );
    if (orIndex >= 0) {
      sortedorgWorkflows.push(orORGObj);
    }
    return sortedorgWorkflows;
  }

  sortORGWorkflows(workflows: any[], username: string): any {
    const orgWorkflows = [];
    for (let i = 0; i < workflows.length; i++) {
      let pos = this.getORGIndex(orgWorkflows, workflows[i].organization);
      if (pos < 0) {
        orgWorkflows.push({
          organization: workflows[i].organization,
          sourceControl: workflows[i].sourceControl,
          workflows: [],
          isFirstOpen: false
        });
        pos = orgWorkflows.length - 1;
      }
      orgWorkflows[pos].workflows.push(workflows[i]);
    }
    /* Sort Workflows in Each Namespace */
    for (let j = 0; j < orgWorkflows.length; j++) {
      orgWorkflows[j].workflows.sort(function(a, b) {
        if (a.repository < b.repository) {
          return -1;
        }
        if (a.repository > b.repository) {
          return 1;
        }
        return 0;
      });
    }
    /* Return Namespaces w/ Nested Containers */
    return this.sortNamespaces(orgWorkflows, username);
  }

  // Given enum name, returns the friendly name
  // TODO: This should be connected to the existing enum in the workflow model, however that does
  // not have the friendly names
  getSourceControlFriendlyName(sourceControlEnum: string): string {
    if (sourceControlEnum === 'GITHUB') {
      return 'github.com';
    } else if (sourceControlEnum === 'GITLAB') {
      return 'gitlab.com';
    } else if (sourceControlEnum === 'BITBUCKET') {
      return 'bitbucket.org';
    }
    return null;
  }
}
