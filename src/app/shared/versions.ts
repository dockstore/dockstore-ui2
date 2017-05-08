import { Input, OnInit } from '@angular/core';

import { DateService } from './date.service';

export abstract class Versions implements OnInit {

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

  getDateTimeString(timestamp) {
    return this.dateService.getDateTimeMessage(timestamp);
  }

}
