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
    private tool;
    private tools;
    constructor(private containersService: ContainersService, private stateService: StateService,
        private containerService: ContainerService) {
        this.containerService.tool$.subscribe(tool => this.tool = tool);
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
        this.containersService.updateContainer(this.tool.id, tool).subscribe(response => {
            this.stateService.setRefreshing(true);
            this.containersService.refresh(this.tool.id).subscribe(refreshResponse => {
                this.containerService.replaceTool(this.tools, refreshResponse);
                this.containerService.setTool(refreshResponse);
                this.stateService.setRefreshing(false);
            });
        });
    }
}
