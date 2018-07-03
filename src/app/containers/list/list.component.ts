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
import { AfterViewInit, Component, Input, ViewChild, ViewChildren, ElementRef, OnInit } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';

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
import { ActivatedRoute } from '../../test';
import { ContainersService } from '../../shared/swagger';
import { PublishedToolsDataSource } from './published-tools.datasource';
import { MatPaginator, MatSort } from '@angular/material';
import { debounceTime, distinctUntilChanged, tap, merge, filter, startWith, delay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list-containers',
  templateUrl: './list.component.html'
})
export class ListContainersComponent extends ToolLister implements AfterViewInit {
  @Input() previewMode: boolean;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  public verifiedLink: string;
  toolsTable: any[] = [];

  private pageNumberSubscription: Subscription;
  public displayedColumns = ['name', 'stars', 'author', 'format', 'projectLinks', 'dockerPull'];
  public loading$: Observable<boolean>;
  dataSource: PublishedToolsDataSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;
  public length$: Observable<number>;
  // TODO: make an API endpoint to retrieve only the necessary properties for the containers table
  // name, author, path, registry, gitUrl
  dtOptions = {
    /* No ordering applied by DataTables during initialisation */
    order: [],
    scrollX: true,
    columnDefs: [
      {
        orderable: false,
        targets: [2, 3]
      },
    ],
    rowCallback: (row: Node, data: any[] | Object, index: number) => {
      const self = this;
      $('td', row).off('click');
      $('td', row).on('click', () => {
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
    private containersService: ContainersService,
    private privateProviderService: ProviderService,
    providerService: ProviderService,
    listService: ListService) {

    super(listService, providerService, 'containers');
    this.verifiedLink = this.dateService.getVerifiedLink();
  }
  privateOnInit() {
    this.dataSource = new PublishedToolsDataSource(this.containersService, this.privateProviderService, this.imageProviderService);
    this.length$ = this.dataSource.lessonsLengthSubject$;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.sort.sortChange.pipe(merge(this.paginator.page, this.paginator.pageSize))
      .pipe(distinctUntilChanged(),
        tap(() => this.loadLessonsPage())
      )
      .subscribe();
      this.loadLessonsPage();
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

      fromEvent(this.input.nativeElement, 'keyup')
        .pipe(
          debounceTime(250),
          distinctUntilChanged(),
          tap(() => {
            this.paginator.pageIndex = 0;

            this.loadLessonsPage();
          })
        )
        .subscribe();
    });
  }

  loadLessonsPage() {
    this.dataSource.loadLessons(
      this.input.nativeElement.value,
      this.sort.direction,
      this.paginator.pageIndex * this.paginator.pageSize,
      this.paginator.pageSize,
      this.sort.active);
  }

  findPageNumber(index: any) {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      const realPgNumber = Math.floor(((dtInstance.page.info().length * dtInstance.page.info().page) + index) / 10);
      const pageInfo: PageInfo = new PageInfo();
      pageInfo.pgNumber = realPgNumber;
      pageInfo.searchQuery = dtInstance.search();
      this.pagenumberService.setToolsPageInfo(pageInfo);
      this.pagenumberService.setBackRoute('containers');
    });
  }
  sendToolInfo(tool) {
    this.communicatorService.setTool(tool);
    this.containerService.setTool(tool);
  }

  getFilteredDockerPullCmd(path: string, tagName: string = ''): string {
    return this.listContainersService.getDockerPullCmd(path, tagName);
  }

  initToolLister(): void {
    this.publishedTools = this.publishedTools.map(tool =>
      this.imageProviderService.setUpImageProvider(tool)
    );
    if (this.previewMode) {
      this.setPreviewTable();
    }
    this.toolsTable = this.publishedTools;
    this.dtTrigger.next();
    this.setupPageNumber();
  }
  setPreviewTable() {
    this.dtOptions['searching'] = false;
    this.dtOptions['paging'] = true;
    this.dtOptions['bInfo'] = false;
    this.dtOptions['lengthChange'] = false;
    this.dtOptions['pageLength'] = 10;
    this.dtOptions['dom'] = 'lfrti';
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
