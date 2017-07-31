import { ContainerService } from './../../shared/container.service';
import {AfterViewInit, Component, Input, ViewChild, ViewChildren} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { DataTableDirective } from 'angular-datatables';
import { CommunicatorService } from '../../shared/communicator.service';
import { DockstoreService } from '../../shared/dockstore.service';
import { DateService } from '../../shared/date.service';
import { ImageProviderService } from '../../shared/image-provider.service';
import { ListService } from '../../shared/list.service';
import { ProviderService } from '../../shared/provider.service';
import { ToolLister } from '../../shared/tool-lister';
import { PagenumberService } from '../../shared/pagenumber.service';
import { PageInfo } from '../../shared/models/PageInfo';


import { ListContainersService } from './list.service';

@Component({
  selector: 'app-list-containers',
  templateUrl: './list.component.html'
})
export class ListContainersComponent extends ToolLister {
  @Input() previewMode: boolean;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  verifiedLink: string;
  private pageNumberSubscription: Subscription;
  // TODO: make an API endpoint to retrieve only the necessary properties for the containers table
  // name, author, path, registry, gitUrl
  dtOptions = {
    columnDefs: [
      {
        orderable: false,
        targets: [ 2, 3 ]
      }
    ],
    rowCallback: (row: Node, data: any[] | Object, index: number) => {
      const self = this;
      $('td', row).unbind('click');
      $('td', row).bind('click', () => {
        self.findPageNumber(index);
      });
      return row;
    }
  };
  constructor(private listContainersService: ListContainersService,
              private communicatorService: CommunicatorService,
              private dockstoreService: DockstoreService,
              private imageProviderService: ImageProviderService,
              private dateService: DateService,
              private containerService: ContainerService,
              private pagenumberService: PagenumberService,
              listService: ListService,
              providerService: ProviderService) {

    super(listService, providerService, 'containers');
    this.verifiedLink = this.dateService.getVerifiedLink();
  }
  findPageNumber(index: any) {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      console.log(dtInstance.search());
      const realPgNumber = Math.floor(((dtInstance.page.info().length * dtInstance.page.info().page) + index ) / 10);
      const pageInfo: PageInfo = new PageInfo();
      pageInfo.pgNumber = realPgNumber;
      pageInfo.searchQuery = dtInstance.search();
      this.pagenumberService.setToolsPageInfo(pageInfo);
      this.pagenumberService.setBackRoute('containers');
    });
  }
  sendToolInfo(tool, i) {
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
    this.dtTrigger.next();
    this.setupPageNumber();
  }
  setupPageNumber() {
    this.pageNumberSubscription = this.pagenumberService.pgNumTools$.subscribe(
      pageInfo => {
        if (pageInfo) {
          if (this.dtElement) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.search(pageInfo.searchQuery).draw(false);
              dtInstance.page(pageInfo.pgNumber).draw(false);
            });
          }
        }
      });
  }

  getVerified(tool) {
    return this.dockstoreService.getVersionVerified(tool.tags);
  }
}
