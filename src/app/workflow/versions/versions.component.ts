import { Component, Input } from '@angular/core';

import { DateService } from '../../shared/date.service';

import { Versions } from '../../shared/versions';
import {versions} from "../../footer/versions";

@Component({
  selector: 'app-versions-workflow',
  templateUrl: './versions.component.html',
  styleUrls: ['./versions.component.css']
})
export class VersionsWorkflowComponent extends Versions {
  verifiedLink: string;
  @Input() versions: Array<any>;
  @Input() verifiedSource: Array<string>;
  @Input() workflowId: number;

  setNoOrderCols(): Array<number> {
    return [ 4, 5 ];
  }

  constructor(dateService: DateService) {
    super(dateService);
    this.verifiedLink = dateService.getVerifiedLink();
  }

}
