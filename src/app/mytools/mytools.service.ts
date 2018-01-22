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

import { Injectable } from '@angular/core';
import { DockstoreTool } from '../shared/swagger/model/dockstoreTool';
import { ContainerService } from '../shared/container.service';

@Injectable()
export class MytoolsService {
  constructor(private containerService: ContainerService) {
  }

  getNSIndex(nsContainers: any[], namespace: string): number {
    return nsContainers.findIndex(nsContainer => nsContainer.namespace === namespace);
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
    return sortedNSContainers;
  }

  /**
   * Takes in an array of tools and outputs an array of objects.  These objects are used to construct the mytools left side bar.
   *
   * @param {any[]} tools An array of tools
   * @param {string} username The name of the user
   * @returns {*} An array of objects that contains 3 properties: Array of tools, whether it's open or not, and the namespace
   * @memberof MytoolsService
   */
  sortNSContainers(tools: any[], username: string): any {
    const nsContainers = [];
    for (let i = 0; i < tools.length; i++) {
      const prefix = this.getPath(tools[i]).split('/', 2).join('/');
      let pos = this.getNSIndex(nsContainers, prefix);
      if (pos < 0) {
        nsContainers.push({
          namespace: prefix,
          containers: [],
          isFirstOpen: false,
        });
        pos = nsContainers.length - 1;
      }
      if (nsContainers.length > 0) {
        nsContainers[pos].containers.push(tools[i]);
      }
    }
    /* Sort Containers/Tools in Each Namespace */
    nsContainers.forEach(nsContainer => {
      nsContainer.containers.sort((a, b) => {
        if (a.name < b.name) { return -1; }
        if (a.name > b.name) { return 1; }
        return 0;
      });
    });

    /* Return Namespaces w/ Nested Containers */
    return this.sortNamespaces(nsContainers, username);
  }

  getPath(tool: DockstoreTool): string {
    return this.containerService.getPath(tool);
  }
}
