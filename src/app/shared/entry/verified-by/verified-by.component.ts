import { Component, Input, OnChanges } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { AvailableLogsComponent } from '../../available-logs/available-logs.component';
import { bootstrap4largeModalSize } from '../../constants';
import { VersionVerifiedPlatform, Tag, WorkflowVersion } from '../../openapi';
import { VerifiedByService } from '../../verified-by.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-verified-by',
  templateUrl: './verified-by.component.html',
  styleUrls: ['./verified-by.component.scss'],
  standalone: true,
  imports: [NgIf, MatLegacyCardModule, FlexModule, MatLegacyButtonModule, MatDividerModule, NgFor],
})
export class VerifiedByComponent implements OnChanges {
  @Input() version: WorkflowVersion | Tag;
  @Input() verifiedByPlatform: Array<VersionVerifiedPlatform> = [];
  public verifiedByStringArray: Array<string> = [];
  constructor(private verifiedByService: VerifiedByService, private matDialog: MatDialog) {}

  ngOnChanges() {
    if (this.version) {
      this.verifiedByStringArray = this.verifiedByService.getVerifiedByString(this.verifiedByPlatform, this.version.id);
    }
  }

  /**
   * Opens the Material dialog that displays verification information and possible logs that are available
   *
   * @memberof VerifiedByComponent
   */
  openVerificationAndAvailableLogsDialog() {
    this.matDialog.open(AvailableLogsComponent, {
      data: {
        version: this.version,
        verifiedByPlatform: this.verifiedByPlatform,
      },
      width: bootstrap4largeModalSize,
    });
  }
}
