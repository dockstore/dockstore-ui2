import { Component, Input } from '@angular/core';

import { DateService } from '../../shared/date.service';

import { Versions } from '../../shared/versions';

@Component({
  selector: 'app-versions-container',
  templateUrl: './versions.component.html',
  styleUrls: [ './versions.component.css' ]
})
export class VersionsContainerComponent extends Versions {
  verifiedLink: string;
  theVersions: Array<any>;
  @Input() versions: Array<any>;
  @Input() verifiedSource: Array<string>;

  setNoOrderCols(): Array<number> {
    return [ 5, 6 ];
  }
  constructor(dateService: DateService) {
    super(dateService);
    this.verifiedLink = dateService.getVerifiedLink();
  }
}
