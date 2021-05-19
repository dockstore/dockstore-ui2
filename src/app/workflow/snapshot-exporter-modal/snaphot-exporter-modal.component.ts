import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router/';
import { concat, EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AlertService } from '../../shared/alert/state/alert.service';
import { Base } from '../../shared/base';
import { Dockstore } from '../../shared/dockstore.model';
import { TokenQuery } from '../../shared/state/token.query';
import { BioWorkflow, WorkflowVersion } from '../../shared/swagger';
import { ViewService } from '../view/view.service';
import { SnapshotExporterModalService } from './snapshot-exporter-modal.service';

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
  public hasOrcidToken$: Observable<boolean> = this.tokenQuery.hasOrcidToken$;
  public isSnapshot: boolean = this.dialogData.version.frozen;
  public workflow: BioWorkflow;
  public version: WorkflowVersion;
  public Dockstore = Dockstore;
  public SnapshotExporterAction = SnapshotExporterAction;
  public title: string;
  public action: SnapshotExporterAction;
  public doiRequested = false;

  @ViewChild('stepper') private stepper: MatStepper;

  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: SnapshotExporterDialogData,
    private dialogRef: MatDialogRef<SnaphotExporterModalComponent>,
    private snapshotExporterModalService: SnapshotExporterModalService,
    private tokenQuery: TokenQuery,
    private alertService: AlertService,
    private viewService: ViewService,
    private router: Router
  ) {
    super();
    this.workflow = dialogData.workflow;
    this.version = dialogData.version;
    this.action = dialogData.action;
    this.title = this.calculateTitle();
  }

  ngOnInit(): void {}

  linkAccount() {
    this.dialogRef.close();
    this.router.navigate(['/accounts']);
  }

  snapshot() {
    this.snapshotExporterModalService.snapshotWorkflowVersion(this.workflow, this.version)
      .subscribe(() => this.dialogRef.close());
      // If there's an error, leave dialog up. this.snapshotExporterModalService.snapshotWorkflowVersion displays error message
  }

  snapshotAndDOI() {
    const observables: Observable<void>[] = [];
    if (!this.version.frozen) {
      observables.push(this.snapshotStep());
    }
    observables.push(this.requestDOIStep());
    concat(observables).subscribe(() => {

      },
      (error) => {

      });
  }

  snapshotDoiAndOrcid() {
    const observables: Observable<void>[] = [];
    if (!this.version.frozen) {
      observables.push(this.snapshotStep());
    }
    if (!this.version.doiURL) {
      observables.push(this.requestDOIStep());
    }
    observables.push(this.orcidStep());
    concat(observables).subscribe(() => {

      },
      (error) => {

      });
  }

  private requestDOIStep() {
    return this.snapshotExporterModalService.requestDOI(this.workflow, this.version).pipe(
      tap(this.stepCompleted()),
      catchError((error) => {
        return EMPTY;
      })
    );
  }

  private snapshotStep() {
    return this.snapshotExporterModalService.snapshotWorkflowVersion(this.workflow, this.version)
      .pipe(
        tap(this.stepCompleted())
      );
  }

  private orcidStep() {
    return this.snapshotExporterModalService.exportToOrcid(this.workflow, this.version)
      .pipe(
        tap(this.stepCompleted)
      );
  }

  private stepCompleted() {
    return () => {
      this.stepper.selected.completed = true;
      this.stepper.next();
    };
  }



  private calculateTitle() {
    switch (this.action) {
      case SnapshotExporterAction.SNAPSHOT:
        return 'Snapshot';
      case SnapshotExporterAction.DOI:
        return 'Request DOI';
      case SnapshotExporterAction.ORCID:
        return 'Export to ORCID';
    }
  }

}
