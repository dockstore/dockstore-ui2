import { StateService } from './state.service';
import { ContainerService } from './container.service';
import { ContainerWebService } from './containerWeb.service';
import { Injectable } from '@angular/core';

@Injectable()
export class RefreshService {
    private tool;
    private refreshing: boolean;
    constructor(private containerWebService: ContainerWebService,
        private containerService: ContainerService,
        private stateService: StateService) {
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
}
