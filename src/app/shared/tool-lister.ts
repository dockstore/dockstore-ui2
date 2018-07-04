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
import { AfterViewInit, OnInit } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, merge, tap } from 'rxjs/operators';

import { DateService } from './date.service';
import { ListService } from './list.service';
import { ProviderService } from './provider.service';
import { PublishedToolsDataSource } from '../containers/list/published-tools.datasource';
import { PublishedWorkflowsDataSource } from '../workflows/list/published-workflows.datasource';

export abstract class ToolLister implements OnInit, AfterViewInit {

  protected previewMode = false;
  protected displayTable = false;
  protected publishedTools = [];
  protected verifiedLink: string;

  constructor(private listService: ListService,
    private providerService: ProviderService,
    private toolType: string, private dateService: DateService) {
    this.verifiedLink = this.dateService.getVerifiedLink();
  }

  abstract dataSource: (PublishedWorkflowsDataSource | PublishedToolsDataSource);
  abstract paginator;
  abstract sort;
  abstract input;
  abstract privateOnInit(): void;

  ngOnInit() {
    this.privateOnInit();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // Initial load
      this.loadPublishedEntries();

      // Handle paginator changes
      this.paginator.page.pipe(merge(this.paginator.pageSize))
        .pipe(distinctUntilChanged(),
          tap(() => this.loadPublishedEntries())
        )
        .subscribe();

      // Handle sort changes
      this.sort.sortChange.pipe(tap(() => {
        this.paginator.pageIndex = 0;
        this.loadPublishedEntries();
      })).subscribe();

      // Handle input text field changes
      fromEvent(this.input.nativeElement, 'keyup')
        .pipe(
          debounceTime(250),
          distinctUntilChanged(),
          tap(() => {
            this.paginator.pageIndex = 0;
            this.loadPublishedEntries();
          })
        )
        .subscribe();
    });
  }

  loadPublishedEntries() {
    this.dataSource.loadEntries(
      this.input.nativeElement.value,
      this.sort.direction,
      this.paginator.pageIndex * this.paginator.pageSize,
      this.paginator.pageSize,
      this.sort.active);
  }

}
