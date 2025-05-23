import { KeyValue, KeyValuePipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FlexModule } from '@ngbracket/ngx-layout';
import { AccessLink, Doi, EntryTypeMetadata, Workflow, WorkflowsService, WorkflowVersion } from 'app/shared/openapi';
import { ManageDoisDialogService } from './manage-dois-dialog.service';
import { MatIconModule } from '@angular/material/icon';
import { DoiBadgeComponent } from '../doi-badge/doi-badge.component';
import { Dockstore } from 'app/shared/dockstore.model';
import { AlertComponent } from 'app/shared/alert/alert.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ZenodoAccessLinkPipe } from '../../zenodo-access-link.pipe';

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
  styleUrls: ['../../../styles/radio-button-cards.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatIconModule,
    FlexModule,
    FormsModule,
    NgIf,
    NgFor,
    KeyValuePipe,
    TitleCasePipe,
    DoiBadgeComponent,
    AlertComponent,
    ZenodoAccessLinkPipe,
  ],
})
export class ManageDoisDialogComponent implements OnInit {
  Dockstore = Dockstore;
  DoiInitiatorEnum = Doi.InitiatorEnum;
  entry: Workflow;
  entryTypeMetadata: EntryTypeMetadata;
  selectedOption: Doi.InitiatorEnum;
  doiInfoMap: Map<Doi.InitiatorEnum, DoiInfo> = new Map();
  isAutoDoiEnabled: boolean;
  isGitHubAppEntry: boolean;
  dockstoreDoiAccessLink: AccessLink;
  showMoreEditLinkInfo: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ManageDoisDialogComponent>,
    public manageDoisDialogService: ManageDoisDialogService,
    private workflowsService: WorkflowsService,
    @Inject(MAT_DIALOG_DATA) public data: ManageDoisDialogData
  ) {
    this.entry = data.entry;
    this.entryTypeMetadata = data.entry.entryTypeMetadata;
    this.selectedOption = data.entry.doiSelection;
    this.isAutoDoiEnabled = data.entry.autoGenerateDois;
    this.isGitHubAppEntry = data.entry.mode === Workflow.ModeEnum.DOCKSTOREYML;
    Object.entries(data.entry.conceptDois).forEach(([initiator, conceptDoi]) => {
      let initiatorEnum = Object.keys(Doi.InitiatorEnum).find((i) => Doi.InitiatorEnum[i] === initiator);
      let versionDoi = data.version?.dois[initiator];
      this.doiInfoMap.set(Doi.InitiatorEnum[initiatorEnum], {
        initiator: Doi.InitiatorEnum[initiatorEnum],
        conceptDoi: conceptDoi,
        versionDoi: versionDoi,
      });
    });
  }

  ngOnInit() {
    this.workflowsService.getDOIEditLink(this.entry.id).subscribe((accessLink: AccessLink) => {
      this.dockstoreDoiAccessLink = accessLink;
    });
  }

  /**
   * Called on slide toggle to enable or disable auto DOI generation
   * @param event toggle event
   */
  toggleAutoDoiGeneration() {
    this.manageDoisDialogService.toggleAutoDoiGeneration(this.entry, this.isAutoDoiEnabled);
  }

  saveDoiSelection() {
    this.manageDoisDialogService.saveDoiSelection(this.entry, this.selectedOption);
  }

  requestDoiAccessLink() {
    this.manageDoisDialogService.requestDoiAccessLink(this.entry).subscribe((accessLink) => {
      this.dockstoreDoiAccessLink = accessLink;
    });
  }

  deleteDoiAccessLink() {
    this.manageDoisDialogService.deleteDoiAccessLink(this.entry).subscribe(() => {
      this.dockstoreDoiAccessLink = undefined;
    });
  }

  toggleShowMoreEditLinkInfo() {
    this.showMoreEditLinkInfo = !this.showMoreEditLinkInfo;
  }

  /**
   * To prevent the Angular's keyvalue pipe from sorting by key
   */
  originalOrder = (a: KeyValue<string, DoiInfo>, b: KeyValue<string, DoiInfo>): number => {
    return 0;
  };
}
