import { Component, Input } from '@angular/core';

import { Versions } from '../../shared/versions';

import { DateService } from '../../shared/date.service';

@Component({
  selector: 'app-versions-container',
  templateUrl: './versions.component.html',
  styleUrls: ['./versions.component.css']
})
export class VersionsContainerComponent extends Versions {

  @Input() versions: Array<any>;

  setNoOrderCols(): Array<number> {
    return [5, 6];
  }

  constructor(dateService: DateService) {
    super(dateService);
  }

}
