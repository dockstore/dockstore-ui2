import { ExtendedDockstoreTool } from './../../shared/models/ExtendedDockstoreTool';
import { RefreshService } from './../../shared/refresh.service';
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

import { ContainerService } from './../../shared/container.service';
import { StateService } from './../../shared/state.service';
import { ContainersService } from './../../shared/swagger/api/containers.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable, OnInit } from '@angular/core';

@Injectable()
export class InfoTabService {
    public dockerFileEditing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public cwlPathEditing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public wdlPathEditing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
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
    constructor(private containersService: ContainersService, private stateService: StateService,
        private containerService: ContainerService, private refreshService: RefreshService) {
        this.containerService.tool$.subscribe(tool => {
            this.tool = tool;
            this.cancelEditing();
        });
        this.containerService.tools$.subscribe(tools => this.tools = tools);
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

    updateAndRefresh(tool: any) {
        const message = 'Tool Info';
        this.containersService.updateContainer(this.tool.id, tool).subscribe(response => {
            this.stateService.setRefreshMessage('Updating ' + message + '...');
            this.containersService.refresh(this.tool.id).subscribe(refreshResponse => {
                this.containerService.replaceTool(this.tools, refreshResponse);
                this.containerService.setTool(refreshResponse);
                this.refreshService.handleSuccess(message);
            }, error => {
                this.refreshService.handleError(message, error);
                this.restoreTool();
            });
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
