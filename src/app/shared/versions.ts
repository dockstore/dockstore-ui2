import {Input, OnChanges, OnInit} from '@angular/core';

import { DateService } from './date.service';
import {versions} from "../footer/versions";

export abstract class Versions implements OnInit, OnChanges{

  @Input() versions: Array<any>;

  dtOptions;

  abstract setNoOrderCols(): Array<number>;

  constructor(private dateService: DateService) { }

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
  ngOnChanges() {
    console.log(this.versions);
  }

  getDateTimeString(timestamp) {
    return this.dateService.getDateTimeMessage(timestamp);
  }

}
