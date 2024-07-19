import { KeyValue, KeyValuePipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { MAT_LEGACY_DIALOG_DATA, MatLegacyDialogModule, MatLegacyDialogRef } from '@angular/material/legacy-dialog';
import { MatLegacyRadioModule } from '@angular/material/legacy-radio';
import { FlexModule } from '@ngbracket/ngx-layout';
import { Doi, EntryTypeMetadata, Workflow, WorkflowVersion } from 'app/shared/openapi';
import { ManageDoisDialogService } from './manage-dois-dialog.service';
import { MatIconModule } from '@angular/material/icon';
import { DoiBadgeComponent } from '../doi-badge/doi-badge.component';

export interface ManageDoisDialogData {
  entry: Workflow;
  version: WorkflowVersion;
}

export interface DoiInfo {
  initiator: Doi.InitiatorEnum;
  conceptDoi: Doi;
  versionDoi: Doi | undefined;
}

@Component({
  selector: 'app-manage-dois-dialog',
  templateUrl: './manage-dois-dialog.component.html',
  styleUrls: ['./manage-dois-dialog.component.scss'],
  standalone: true,
  imports: [
    MatLegacyDialogModule,
    MatLegacyButtonModule,
    MatLegacyCardModule,
    MatLegacyRadioModule,
    MatIconModule,
    FlexModule,
    FormsModule,
    NgIf,
    NgFor,
    KeyValuePipe,
    TitleCasePipe,
    DoiBadgeComponent,
  ],
})
export class ManageDoisDialog {
  DoiInitiatorEnum = Doi.InitiatorEnum;
  entry: Workflow;
  version: WorkflowVersion;
  entryTypeMetadata: EntryTypeMetadata;
  conceptDois: Map<string, Doi>;
  versionDois: Map<string, Doi>;
  doiSelection: Doi.InitiatorEnum;
  selectedOption: Doi.InitiatorEnum;
  doiInfoMap: Map<Doi.InitiatorEnum, DoiInfo> = new Map();

  constructor(
    public dialogRef: MatLegacyDialogRef<ManageDoisDialog>,
    public manageDoisDialogService: ManageDoisDialogService,
    @Inject(MAT_LEGACY_DIALOG_DATA) public data: ManageDoisDialogData
  ) {
    this.entry = data.entry;
    this.version = data.version;
    this.entryTypeMetadata = data.entry.entryTypeMetadata;
    this.conceptDois = new Map(Object.entries(data.entry.conceptDois));
    this.versionDois = new Map(Object.entries(data.version.dois));
    this.doiSelection = data.entry.doiSelection;
    this.selectedOption = this.doiSelection;
    this.conceptDois.forEach((conceptDoi, initiator) => {
      let initiatorEnum = Object.keys(Doi.InitiatorEnum).find((i) => Doi.InitiatorEnum[i] === initiator);
      let versionDoi = this.versionDois.get(initiator);
      this.doiInfoMap.set(Doi.InitiatorEnum[initiatorEnum], {
        initiator: Doi.InitiatorEnum[initiatorEnum],
        conceptDoi: conceptDoi,
        versionDoi: versionDoi,
      });
    });
  }

  saveDoiSelection() {
    this.manageDoisDialogService.saveDoiSelection(this.entry, this.selectedOption);
  }

  /**
   * To prevent the Angular's keyvalue pipe from sorting by key
   */
  originalOrder = (a: KeyValue<string, DoiInfo>, b: KeyValue<string, DoiInfo>): number => {
    return 0;
  };
}
