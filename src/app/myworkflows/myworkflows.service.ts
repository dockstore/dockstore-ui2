import {Injectable} from '@angular/core';

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
    sortedorgWorkflows[0].isFirstOpen = true;
    return sortedorgWorkflows;
  }

  sortORGWorkflows(workflows: any[], username: string): any {
    const orgWorkflows = [];
    for (let i = 0; i < workflows.length; i++) {
      let pos = this.getORGIndex(orgWorkflows, workflows[i].organization);
      if (pos < 0) {
        orgWorkflows.push({
          organization: workflows[i].organization,
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
}

