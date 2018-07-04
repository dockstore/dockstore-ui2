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

import { Injectable, OnInit, AfterViewInit } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { ListService } from './list.service';
import { ProviderService } from './provider.service';
import { merge, distinctUntilChanged, tap, debounceTime } from 'rxjs/operators';
import { DateService } from './date.service';

export abstract class ToolLister implements OnInit, AfterViewInit {

  protected previewMode = false;
  protected displayTable = false;
  protected publishedTools = [];
  protected _toolType: string;
  protected verifiedLink: string;
  dtTrigger: Subject<any> = new Subject();

  constructor(private listService: ListService,
              private providerService: ProviderService,
              private toolType: string, private dateService: DateService) {

    this._toolType = toolType;
    this.verifiedLink = this.dateService.getVerifiedLink();
  }

  abstract dataSource;
  abstract paginator;
  abstract sort;
  abstract input;
  abstract initToolLister(): void;
  abstract privateOnInit(): void;

  ngOnInit() {
    this.listService.getPublishedTools(this._toolType, this.previewMode)
      .subscribe(tools => {
        this.publishedTools = tools.map(tool => this.providerService.setUpProvider(tool));
        this.initToolLister();
        this.displayTable = true;
      });
    this.privateOnInit();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.sort.sortChange.pipe(merge(this.paginator.page, this.paginator.pageSize))
        .pipe(distinctUntilChanged(),
          tap(() => this.loadPublishedEntries())
        )
        .subscribe();
      this.loadPublishedEntries();
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

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
    this.dataSource.loadLessons(
      this.input.nativeElement.value,
      this.sort.direction,
      this.paginator.pageIndex * this.paginator.pageSize,
      this.paginator.pageSize,
      this.sort.active);
  }

}
