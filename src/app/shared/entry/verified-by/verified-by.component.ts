import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { Tag, WorkflowVersion } from '../../swagger';
import { VerifiedByService } from '../../verified-by.service';

@Component({
  selector: 'app-verified-by',
  templateUrl: './verified-by.component.html',
  styleUrls: ['./verified-by.component.scss']
})
export class VerifiedByComponent implements OnChanges {
  @Input() version: (WorkflowVersion | Tag);
  public verifiedByStringArray: Array<string> = [];
  constructor(private verifiedByService: VerifiedByService) { }

  ngOnChanges() {
    if (this.version) {
      this.verifiedByStringArray = this.verifiedByService.getVerifiedByString(this.version.sourceFiles);
    }
  }

}
