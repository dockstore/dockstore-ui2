import { Input } from '@angular/core';

import { DateService } from './date.service';

export abstract class View {

  @Input() version;

  constructor(private dateService: DateService) {
  }

  getDateTimeMessage(timestamp) {

    return this.dateService.getDateTimeMessage(timestamp);
  }

}
