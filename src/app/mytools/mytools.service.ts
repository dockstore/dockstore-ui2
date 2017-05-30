import {Injectable} from '@angular/core';

@Injectable()
export class MytoolsService {
  constructor() {
  }

  getNSIndex(nsContainers: any[], namespace: string): number {
    for (let i = 0; i < nsContainers.length; i++) {
      if (nsContainers[i].namespace === namespace) {
        return i;
      }
    }
    return -1;
  }

  sortNamespaces(nsContainers: any[], username: string): any {
    let sortedNSContainers = [];
    /* User's Containers Appear in First Section */
    let unIndex = -1;
    let orIndex = -1;
    let orNSObj = null;
    for (let i = 0; i < nsContainers.length; i++) {
      if (nsContainers[i].namespace === username) {
        unIndex = i;
        sortedNSContainers.push(nsContainers[i]);
      } else if (nsContainers[i].namespace === '_') {
        orIndex = i;
        orNSObj = {
          namespace: 'Others',
          containers: nsContainers[i].containers
        };
      }
    }
    if (unIndex >= 0) {
      nsContainers.splice(unIndex, 1);
    }
    if (orIndex >= 0) {
      nsContainers.splice(
        (unIndex < orIndex) ? orIndex - 1 : orIndex,
        1
      );
    }
    sortedNSContainers = sortedNSContainers.concat(
      nsContainers.sort(function (a, b) {
        if (a.namespace < b.namespace) {
          return -1;
        }
        if (a.namespace > b.namespace) {
          return 1;
        } else {
          return 0;
        }
      })
    );
    if (orIndex >= 0) {
      sortedNSContainers.push(orNSObj);
    }
    sortedNSContainers[0].isFirstOpen = true;
    return sortedNSContainers;
  }

  sortNSContainers(tools: any[], username: string): any {
    const nsContainers = [];
    for (let i = 0; i < tools.length; i++) {
      const prefix = tools[i].tool_path.split('/', 2).join('/');
      let pos = this.getNSIndex(nsContainers, prefix);
      if (pos < 0) {
        nsContainers.push({
          namespace: prefix,
          containers: [],
          isFirstOpen: false,
        });
        pos = nsContainers.length - 1;
      }
      nsContainers[pos].containers.push(tools[i]);
    }
    /* Sort Containers/Tools in Each Namespace */
    for (let j = 0; j < nsContainers.length; j++) {
      nsContainers[j].containers.sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        } else {
          return 0;
        }
      });
    }
    /* Return Namespaces w/ Nested Containers */
    return this.sortNamespaces(nsContainers, username);
  }
}
