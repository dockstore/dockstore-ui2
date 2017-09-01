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
