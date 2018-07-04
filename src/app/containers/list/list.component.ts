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
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subscription } from 'rxjs';

import { CommunicatorService } from '../../shared/communicator.service';
import { DateService } from '../../shared/date.service';
import { DockstoreService } from '../../shared/dockstore.service';
import { ImageProviderService } from '../../shared/image-provider.service';
import { ListService } from '../../shared/list.service';
import { PageInfo } from '../../shared/models/PageInfo';
import { PagenumberService } from '../../shared/pagenumber.service';
import { ProviderService } from '../../shared/provider.service';
import { ContainersService } from '../../shared/swagger';
import { ToolLister } from '../../shared/tool-lister';
import { ContainerService } from './../../shared/container.service';
import { ListContainersService } from './list.service';
import { PublishedToolsDataSource } from './published-tools.datasource';

@Component({
  selector: 'app-list-containers',
  templateUrl: './list.component.html'
})
export class ListContainersComponent extends ToolLister {
  @Input() previewMode: boolean;
  public verifiedLink: string;

  public displayedColumns = ['name', 'stars', 'author', 'format', 'projectLinks', 'dockerPull'];
  public loading$: Observable<boolean>;
  dataSource: PublishedToolsDataSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;
  public length$: Observable<number>;

  constructor(private listContainersService: ListContainersService,
    private communicatorService: CommunicatorService,
    private dockstoreService: DockstoreService,
    private imageProviderService: ImageProviderService,
    private containerService: ContainerService,
    private pagenumberService: PagenumberService,
    private containersService: ContainersService,
    private privateProviderService: ProviderService,
    providerService: ProviderService,
    listService: ListService,
    dateService: DateService
  ) {
    super(listService, providerService, 'containers', dateService);
  }
  privateOnInit() {
    this.dataSource = new PublishedToolsDataSource(this.containersService, this.privateProviderService, this.imageProviderService);
    this.length$ = this.dataSource.entriesLengthSubject$;
  }

  getFilteredDockerPullCmd(path: string, tagName: string = ''): string {
    return this.listContainersService.getDockerPullCmd(path, tagName);
  }

  getVerified(tool) {
    return this.dockstoreService.getVersionVerified(tool.tags);
  }
}
