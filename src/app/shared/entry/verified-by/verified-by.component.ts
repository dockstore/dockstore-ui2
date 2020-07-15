import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AvailableLogsComponent } from '../../available-logs/available-logs.component';
import { bootstrap4largeModalSize } from '../../constants';
import { VersionVerifiedPlatform } from '../../openapi';
import { Tag, WorkflowVersion } from '../../swagger';
import { VerifiedByService } from '../../verified-by.service';

@Component({
  selector: 'app-verified-by',
  templateUrl: './verified-by.component.html',
  styleUrls: ['./verified-by.component.scss']
})
export class VerifiedByComponent implements OnChanges {
  @Input() version: WorkflowVersion | Tag;
  @Input() verifiedByPlatform: Array<VersionVerifiedPlatform> = [];
  public verifiedByStringArray: Array<string> = [];
  constructor(private verifiedByService: VerifiedByService, private matDialog: MatDialog) {}

  ngOnChanges() {
    if (this.version) {
      this.verifiedByStringArray = this.verifiedByService.getVerifiedByString(this.verifiedByPlatform, this.version);
    }
  }

  /**
   * Opens the Material dialog that displays verification information and possible logs that are available
   *
   * @memberof VerifiedByComponent
   */
  //
  openVerificationAndAvailableLogsDialog() {
    this.matDialog.open(AvailableLogsComponent, {
      data: {
        version: this.version,
        verifiedByPlatform: this.verifiedByPlatform
      },
      width: bootstrap4largeModalSize
    });
  }
}
