import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Tool } from '../shared/tool';

import { ToolService } from '../shared/tool.service';
import { CommunicatorService } from '../shared/communicator.service';
import { ProviderService } from '../shared/provider.service';

import { DockstoreService } from '../shared/dockstore.service';
import { DateService } from '../shared/date.service';
import { ListContainersService } from '../containers/list/list.service';
import { ContainerService } from './container.service';
import { ImageProviderService } from '../shared/image-provider.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html'
})
export class ContainerComponent extends Tool {

    constructor(private dockstoreService: DockstoreService,
                private dateService: DateService,
                private listContainersService: ListContainersService,
                private containerService: ContainerService,
                private imageProviderService: ImageProviderService,
                toolService: ToolService,
                communicatorService: CommunicatorService,
                providerService: ProviderService,
                router: Router) {
      super(toolService, communicatorService, providerService, router, 'containers');
    }

    setProperties() {
      let toolRef = this.tool;

      toolRef.agoMessage = this.dateService.getAgoMessage(toolRef.lastBuild);
      toolRef.email = this.dockstoreService.stripMailTo(toolRef.email);
      toolRef.buildMode = this.containerService.getBuildMode(toolRef.mode);
      toolRef.lastBuildDate = this.dateService.getDateTimeMessage(toolRef.lastBuild);
      toolRef.lastUpdatedDate = this.dateService.getDateTimeMessage(toolRef.lastUpdated);

      if (!toolRef.imgProviderUrl) {
        toolRef = this.imageProviderService.setUpImageProvider(toolRef);
      }
    }

    getValidVersions() {
      this.validVersions = this.containerService.getValidVersions(this.tool);
    }

}
