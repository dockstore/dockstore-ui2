import { Injectable } from '@angular/core';

import { ContainerService } from './container.service';
import { ContainersWebService } from './webservice/containers-web.service';
import { StateService } from './state.service';
import { UsersWebService } from './webservice/users-web.service';

@Injectable()
export class RefreshService {
    private tool;
    private refreshing: boolean;
    constructor(private containerWebService: ContainersWebService,
        private containerService: ContainerService,
        private stateService: StateService,
        private usersService: UsersWebService) {
        this.containerService.tool$.subscribe(
            tool => this.tool = tool
        );
        this.stateService.refreshing.subscribe(
            refreshing => {
                this.refreshing = refreshing;
            }
        );
    }
    refreshContainer() {
        this.stateService.refreshing.next(true);
        this.containerWebService.getContainerRefresh(this.tool.id).subscribe(
            response => {
                this.containerService.setTool(response);
                this.stateService.refreshing.next(false);
            }
        );
    }

    refreshAllTools(id: number) {
        this.stateService.refreshing.next(true);
        this.usersService.refresh(id).subscribe(
            response => {
                this.containerService.setTools(response);
                this.stateService.refreshing.next(false);
            }
        );
    }
}
