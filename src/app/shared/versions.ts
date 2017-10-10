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

import {Input, OnInit} from '@angular/core';

import { DateService } from './date.service';
import { DockstoreService } from '../shared/dockstore.service';
export abstract class Versions implements OnInit {

  @Input() versions: Array<any>;
  sortColumn: string;
  sortReverse: boolean;

  dtOptions;

  abstract setNoOrderCols(): Array<number>;

  constructor(protected dockstoreService: DockstoreService,
              private dateService: DateService) {
    this.sortColumn = 'name';
    this.sortReverse = false;
  }

  ngOnInit() {
    this.dtOptions = {
      bFilter: false,
      bPaginate: false,
      columnDefs: [
        {
          orderable: false,
          targets: this.setNoOrderCols()
        }
      ]
    };
  }

  clickSortColumn(columnName) {
    if (this.sortColumn === columnName) {
      this.sortReverse = !this.sortReverse;
    } else  {
      this.sortColumn = columnName;
      this.sortReverse = false;
    }
  }
  getIconClass(columnName): string {
    return this.dockstoreService.getIconClass(columnName, this.sortColumn, this.sortReverse);
  }
  convertSorting(): string {
    return this.sortReverse ? '-' + this.sortColumn : this.sortColumn;
  }
  getDateTimeString(timestamp) {
    if (timestamp) {
      return this.dateService.getDateTimeMessage(timestamp);
    } else {
      return 'n/a';
    }
  }

}
