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
import { takeUntil } from 'rxjs/operators';

import { AlertService } from '../../shared/alert/state/alert.service';
import { Base } from '../../shared/base';
import { ContainerService } from '../../shared/container.service';
import { ExtendedDockstoreToolQuery } from '../../shared/extended-dockstoreTool/extended-dockstoreTool.query';
import { ExtendedDockstoreTool } from '../../shared/models/ExtendedDockstoreTool';
import { RefreshService } from '../../shared/refresh.service';
import { ContainersService } from '../../shared/swagger/api/containers.service';
import { DockstoreTool } from '../../shared/swagger/model/dockstoreTool';

@Injectable()
export class InfoTabService extends Base {
  public dockerFileEditing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public cwlPathEditing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public wdlPathEditing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public cwlTestPathEditing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public wdlTestPathEditing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private tools;

  /**
   * The original tool that should be in sync with the database
   *
   * @private
   * @type {ExtendedDockstoreTool}
   * @memberof InfoTabService
   */
  private originalTool: ExtendedDockstoreTool;

  /**
   * The tool with info that may have been modified but not saved
   *
   * @private
   * @type {ExtendedDockstoreTool}
   * @memberof InfoTabService
   */
  private currentTool: ExtendedDockstoreTool;
  constructor(
    private containersService: ContainersService,
    private alertService: AlertService,
    private containerService: ContainerService,
    private refreshService: RefreshService,
    private extendedDockstoreToolQuery: ExtendedDockstoreToolQuery
  ) {
    super();
    this.extendedDockstoreToolQuery.extendedDockstoreTool$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((extendedDockstoreTool: ExtendedDockstoreTool) => {
        if (extendedDockstoreTool) {
          this.tool = extendedDockstoreTool;
          this.cancelEditing();
        }
      });
    this.containerService.tools$.subscribe(tools => (this.tools = tools));
  }
  setDockerFileEditing(editing: boolean) {
    this.dockerFileEditing$.next(editing);
  }

  setCWLPathEditing(editing: boolean) {
    this.cwlPathEditing$.next(editing);
  }

  setWDLPathEditing(editing: boolean) {
    this.wdlPathEditing$.next(editing);
  }

  setCWLTestPathEditing(editing: boolean) {
    this.cwlTestPathEditing$.next(editing);
  }

  setWDLTestPathEditing(editing: boolean) {
    this.wdlTestPathEditing$.next(editing);
  }

  updateAndRefresh(tool: DockstoreTool) {
    const message = 'Tool Info';
    tool.workflowVersions = [];
    this.containersService.updateContainer(this.tool.id, tool).subscribe(response => {
      this.alertService.start('Updating ' + message);
      this.containersService.refresh(this.tool.id).subscribe(
        refreshResponse => {
          this.containerService.replaceTool(this.tools, refreshResponse);
          this.containerService.setTool(refreshResponse);
          this.alertService.detailedSuccess();
        },
        error => {
          this.alertService.detailedError(error);
          this.restoreTool();
        }
      );
    });
  }

  get tool(): ExtendedDockstoreTool {
    return this.currentTool;
  }

  set tool(tool: ExtendedDockstoreTool) {
    this.originalTool = tool;
    this.currentTool = Object.assign({}, tool);
  }

  /**
   * Cancels editing for all editable fields
   *
   * @memberof InfoTabService
   */
  cancelEditing(): void {
    this.dockerFileEditing$.next(false);
    this.cwlPathEditing$.next(false);
    this.wdlPathEditing$.next(false);
    this.wdlTestPathEditing$.next(false);
    this.cwlTestPathEditing$.next(false);
    this.restoreTool();
  }

  /**
   * Reverts the tool info back to the original
   *
   * @memberof InfoTabService
   */
  restoreTool(): void {
    this.tool = this.originalTool;
  }

  /**
   * Saves the current workflow into the workflow variable
   *
   * @memberof InfoTabService
   */
  saveTool(): void {
    this.tool = this.currentTool;
  }
}
