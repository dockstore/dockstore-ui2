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

import { Input } from '@angular/core';

import { DockstoreService } from '../shared/dockstore.service';
import { DateService } from './date.service';
import { StateService } from './state.service';
import { Tooltip } from './tooltip';
import { EntryTab } from '../shared/entry/entry-tab';

export abstract class Versions extends EntryTab {

  @Input() versions: Array<any>;
  sortColumn: string;
  sortReverse: boolean;
  publicPage: boolean;
  defaultVersion: string;
  verifiedLink: string;
  dtOptions;

  abstract setNoOrderCols(): Array<number>;

  constructor(protected dockstoreService: DockstoreService,
    private dateService: DateService, protected stateService: StateService) {
      super();
      this.sortColumn = 'name';
      this.sortReverse = false;
  }

  publicPageSubscription() {
    this.verifiedLink = this.dateService.getVerifiedLink();
    this.stateService.publicPage$.subscribe(publicPage => this.publicPage = publicPage);
  }

  getDefaultTooltip(publicPage: boolean): string {
    if (publicPage) {
      return Tooltip.defaultVersionUser;
    } else {
      return Tooltip.defaultVersionAuthor;
    }
  }

  clickSortColumn(columnName) {
    if (this.sortColumn === columnName) {
      this.sortReverse = !this.sortReverse;
    } else {
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
