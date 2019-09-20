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
import { BehaviorSubject } from 'rxjs';

import { DockstoreTool } from './swagger/model/dockstoreTool';
import { ToolService } from './tool/tool.service';

@Injectable()
export class ContainerService {
  private static readonly descriptorWdl = ' --descriptor wdl';
  tools$ = new BehaviorSubject<any>(null); // This contains the list of unsorted tools
  private copyBtnSource = new BehaviorSubject<any>(null); // This is the currently selected copy button.
  copyBtn$ = this.copyBtnSource.asObservable();
  nsContainers: BehaviorSubject<any> = new BehaviorSubject(null); // This contains the list of sorted tool stubs
  constructor(private toolService: ToolService) {}
  setTool(tool: any) {
    this.toolService.setTool(tool);
  }
  setTools(tools: any) {
    this.tools$.next(tools);
  }

  addToTools(tools: any, tool: any) {
    tools.push(tool);
    this.tools$.next(tools);
  }

  /**
   * Upsert the new workflow into the current list of workflows (depends on the workflow id)
   * @param tool Workflow to be upserted
   */
  upsertToolToTools(tool: DockstoreTool) {
    const tools = this.tools$.getValue();
    if (!tool || !tools) {
      return;
    }
    const oldWorkflow = tools.find(x => x.id === tool.id);
    if (oldWorkflow) {
      const index = tools.indexOf(oldWorkflow);
      tools[index] = tool;
    } else {
      tools.push(tool);
    }
    this.setTools(tools);
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
}
