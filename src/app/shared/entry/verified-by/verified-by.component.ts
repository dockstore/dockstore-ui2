import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AvailableLogsComponent } from '../../available-logs/available-logs.component';
import { bootstrap4largeModalSize } from '../../constants';
import { Tag, WorkflowVersion } from '../../swagger';
import { VerifiedByService } from '../../verified-by.service';

@Component({
  selector: 'app-verified-by',
  templateUrl: './verified-by.component.html',
  styleUrls: ['./verified-by.component.scss']
})
export class VerifiedByComponent implements OnChanges {
  @Input() version: WorkflowVersion | Tag;
  public verifiedByStringArray: Array<string> = [];
  constructor(private verifiedByService: VerifiedByService, private matDialog: MatDialog) {}

  ngOnChanges() {
    if (this.version) {
      this.verifiedByStringArray = this.verifiedByService.getVerifiedByString(this.version.sourceFiles);
    }
  }

  /**
   * Opens the Material dialog that displays verification information and possible logs that are available
   *
   * @memberof VerifiedByComponent
   */
  openVerificationAndAvailableLogsDialog() {
    if (this.matDialog.openDialogs.length === 0) {
      this.matDialog.open(AvailableLogsComponent, { data: this.version, width: bootstrap4largeModalSize });
    }
  }
}
