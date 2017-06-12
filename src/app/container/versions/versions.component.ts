import {Component, Input, OnChanges} from '@angular/core';

import { DateService } from '../../shared/date.service';

import { Versions } from '../../shared/versions';
import { DockstoreService } from '../../shared/dockstore.service';
import { WorkflowObservableService } from '../../shared/workflow-observable.service';

@Component({
  selector: 'app-versions-container',
  templateUrl: './versions.component.html',
  styleUrls: [ './versions.component.css' ]
})
export class VersionsContainerComponent extends Versions {
  verifiedLink: string;
  @Input() versions: Array<any>;
  @Input() verifiedSource: Array<string>;

  setNoOrderCols(): Array<number> {
    return [ 5, 6 ];
  }
  constructor(dockstoreService: DockstoreService,
              dateService: DateService) {
    super(dockstoreService, dateService);
    this.verifiedLink = dateService.getVerifiedLink();
  }
}
