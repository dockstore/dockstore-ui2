import { ContainerService } from './../../shared/container.service';
import { Component, Input } from '@angular/core';
import { CommunicatorService } from '../../shared/communicator.service';
import { DockstoreService } from '../../shared/dockstore.service';
import { DateService } from '../../shared/date.service';
import { ImageProviderService } from '../../shared/image-provider.service';
import { ListService } from '../../shared/list.service';
import { ProviderService } from '../../shared/provider.service';
import { ToolLister } from '../../shared/tool-lister';

import { ListContainersService } from './list.service';

@Component({
  selector: 'app-list-containers',
  templateUrl: './list.component.html'
})
export class ListContainersComponent extends ToolLister {
  @Input() previewMode: boolean;
  verifiedLink: string;

  // TODO: make an API endpoint to retrieve only the necessary properties for the containers table
  // name, author, path, registry, gitUrl

  dtOptions = {
    columnDefs: [
      {
        orderable: false,
        targets: [ 2, 3 ]
      }
    ]
  };
  constructor(private listContainersService: ListContainersService,
              private communicatorService: CommunicatorService,
              private ContainerService: ContainerService,
              private dockstoreService: DockstoreService,
              private imageProviderService: ImageProviderService,
              private dateService: DateService,
              private containerService: ContainerService,
              listService: ListService,
              providerService: ProviderService) {

    super(listService, providerService, 'containers');
    this.verifiedLink = this.dateService.getVerifiedLink();
  }

  sendToolInfo(tool) {
    this.communicatorService.setTool(tool);
    this.containerService.setTool(tool);
  }

  getFilteredDockerPullCmd(path: string): string {
    return this.listContainersService.getDockerPullCmd(path);
  }

  initToolLister(): void {
    this.publishedTools = this.publishedTools.map(tool =>
      this.imageProviderService.setUpImageProvider(tool)
    );
  }

  getVerified(tool) {
    return this.dockstoreService.getVersionVerified(tool.tags);
  }
}
