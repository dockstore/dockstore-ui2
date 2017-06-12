import {Component, Input} from '@angular/core';

import { DateService } from '../../shared/date.service';

import { Versions } from '../../shared/versions';
import { DockstoreService } from '../../shared/dockstore.service';
import { ToolObservableService } from '../../shared/tool-observable.service';
import { WorkflowObservableService } from '../../shared/workflow-observable.service';


@Component({
  selector: 'app-versions-workflow',
  templateUrl: './versions.component.html',
  styleUrls: ['./versions.component.css']
})
export class VersionsWorkflowComponent extends Versions {
  @Input() versions: Array<any>;
  @Input() verifiedSource: Array<string>;
  @Input() workflowId: number;
  verifiedLink: string;

  setNoOrderCols(): Array<number> {
    return [ 4, 5 ];
  }

  constructor(dockstoreService: DockstoreService,
              dateService: DateService) {
    super(dockstoreService, dateService);
    this.verifiedLink = dateService.getVerifiedLink();
  }
}
