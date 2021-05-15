import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationStart, Router, RouterEvent } from '@angular/router/';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AlertService } from '../../shared/alert/state/alert.service';
import { Base } from '../../shared/base';
import { Dockstore } from '../../shared/dockstore.model';
import { TokenQuery } from '../../shared/state/token.query';
import { BioWorkflow, WorkflowVersion } from '../../shared/swagger';
import { ViewService } from '../view/view.service';

export enum SnapshotExporterAction {
  SNAPSHOT,
  DOI,
  ORCID,
}

export interface SnapshotExporterDialogData {
  workflow: BioWorkflow;
  version: WorkflowVersion;
  action: SnapshotExporterAction;
}

@Component({
  selector: 'app-snapshot-exporter-modal-component',
  templateUrl: './snaphot-exporter-modal.component.html',
  styleUrls: ['./snaphot-exporter-modal.component.scss'],
})
export class SnaphotExporterModalComponent extends Base implements OnInit {
  public hasZenodoToken$: Observable<boolean> = this.tokenQuery.hasZenodoToken$;
  public isSnapshot: boolean = this.dialogData.version.frozen;
  public workflow: BioWorkflow;
  public version: WorkflowVersion;
  public Dockstore = Dockstore;
  public SnapshotExporterAction = SnapshotExporterAction;
  public title: String;
  public action: SnapshotExporterAction;

  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: SnapshotExporterDialogData,
    private dialogRef: MatDialogRef<SnaphotExporterModalComponent>,
    private tokenQuery: TokenQuery,
    private alertService: AlertService,
    private viewService: ViewService,
    private router: Router
  ) {
    super();
    this.workflow = dialogData.workflow;
    this.version = dialogData.version;
    this.action = dialogData.action;
    this.title = this.calculateTitle(dialogData.action);
  }

  ngOnInit(): void {
    // All of this so that click on a router link dismisses the dialog
    this.router.events
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter((e: RouterEvent) => e instanceof NavigationStart)
      )
      .subscribe(() => this.dialogRef.close());
  }

  snapshot() {
    this.dialogRef.close();
  }

  requestDOI() {
    this.viewService.requestDOIForWorkflowVersion(this.workflow, this.version);
    this.dialogRef.close(0);
  }

  closeForSnapshot() {
    this.dialogRef.close('snapshot');
  }

  private calculateTitle(action: SnapshotExporterAction) {
    switch (action) {
      case SnapshotExporterAction.SNAPSHOT:
        return 'Snapshot';
      case SnapshotExporterAction.DOI:
        return 'Request DOI';
      case SnapshotExporterAction.ORCID:
        return 'Export to ORCID';
    }
  }
}
