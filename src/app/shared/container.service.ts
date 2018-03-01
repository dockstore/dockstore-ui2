/**
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
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { DockstoreTool } from './swagger/model/dockstoreTool';

@Injectable()
export class ContainerService {

  private static readonly descriptorWdl = ' --descriptor wdl';
  tool$ = new BehaviorSubject<any>(null); // This is the selected tool
  toolCheckerId$: Observable<number>;
  tools$ = new BehaviorSubject<any>(null); // This contains the list of unsorted tools
  private copyBtnSource = new BehaviorSubject<any>(null); // This is the currently selected copy button.
  copyBtn$ = this.copyBtnSource.asObservable();
  nsContainers: BehaviorSubject<any> = new BehaviorSubject(null); // This contains the list of sorted tool stubs
  constructor() {
    this.toolCheckerId$ = this.tool$.map((tool: DockstoreTool) => {
      if (tool) {
        // Change this to tool.checker_id once it's available
        return tool.id;
      } else {
        return null;
      }
    });
  }
  setTool(tool: any) {
    this.tool$.next(tool);
  }
  setTools(tools: any) {
    this.tools$.next(tools);
  }

  addToTools(tools: any, tool: any) {
    tools.push(tool);
    this.tools$.next(tools);
  }

  /**
   * This function replaces the tool inside of tools with an updated tool
   *
   * @param {*} tools the current set of tools
   * @param {*} newTool the new tool we are replacing
   * @memberof ContainerService
   */
  replaceTool(tools: any, newTool) {
    if (this.tools$.getValue()) {
      tools = this.tools$.getValue();
    }
    const oldTool = tools.find(x => x.id === newTool.id);
    const index = tools.indexOf(oldTool);
    tools[index] = newTool;
    this.setTools(tools);
  }

  setNsContainers(tools: any) {
    this.nsContainers.next(tools);
  }
  setCopyBtn(copyBtn: any) {
    this.copyBtnSource.next(copyBtn);
  }

  getBuildMode(mode: DockstoreTool.ModeEnum) {
    switch (mode) {
      case DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSAUTOMATEDBUILDS:
        return 'Fully-Automated';
      case DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSWITHMIXED:
        return 'Partially-Automated';
      case DockstoreTool.ModeEnum.MANUALIMAGEPATH:
        return 'Manual';
      default:
        return 'Unknown';
    }
  }

  getBuildModeTooltip(mode: DockstoreTool.ModeEnum) {
    switch (mode) {
      case DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSAUTOMATEDBUILDS:
        return 'Fully-Automated: All versions are automated builds';
      case DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSWITHMIXED:
        return 'Partially-Automated: At least one version is an automated build';
      case DockstoreTool.ModeEnum.MANUALIMAGEPATH:
        return 'Manual: No versions are automated builds';
      default:
        return 'Unknown: Build information not known';
    }
  }

}
