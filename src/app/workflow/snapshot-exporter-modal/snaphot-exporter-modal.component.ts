import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router/';
import { faOrcid } from '@fortawesome/free-brands-svg-icons';
import { concat, EMPTY, Observable, of as observableOf } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AlertQuery } from '../../shared/alert/state/alert.query';
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

export enum StepState {
  INITIAL,
  EXECUTING,
  COMPLETED,
  ERROR,
}

export interface State {
  snapshot: StepState;
  doi: StepState;
  orcid: StepState;
}

@Component({
  selector: 'app-snapshot-exporter-modal-component',
  templateUrl: './snaphot-exporter-modal.component.html',
  styleUrls: ['./snaphot-exporter-modal.component.scss'],
})
export class SnaphotExporterModalComponent extends Base implements OnInit {
  public hasZenodoToken$: Observable<boolean> = this.tokenQuery.hasZenodoToken$;
  public hasOrcidToken$: Observable<boolean> = this.tokenQuery.hasOrcidToken$;
  public isAjaxing$ = this.alertQuery.showInfo$;
  public isSnapshot: boolean = this.dialogData.version.frozen;
  public workflow: BioWorkflow;
  public version: WorkflowVersion;
  public Dockstore = Dockstore;
  public SnapshotExporterAction = SnapshotExporterAction;
  public StepState = StepState;
  public title: string;
  public action: SnapshotExporterAction;
  public promptToConfirmSnapshot = false;
  public faOrcid = faOrcid;
  public state: State;

  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: SnapshotExporterDialogData,
    private dialogRef: MatDialogRef<SnaphotExporterModalComponent>,
    private snapshotExporterModalService: SnapshotExporterModalService,
    private tokenQuery: TokenQuery,
    private alertQuery: AlertQuery,
    private alertService: AlertService,
    private viewService: ViewService,
    private router: Router
  ) {
    super();
    this.workflow = dialogData.workflow;
    this.version = dialogData.version;
    this.action = dialogData.action;
    this.title = this.calculateTitle();
    this.state = this.calculateState();
  }

  ngOnInit(): void {}

  linkAccount() {
    this.dialogRef.close();
    this.router.navigate(['/accounts']);
  }

  /**
   * Invoked when snapshotting only (not exporting). Closes the dialog on success
   */
  snapshot() {
    this.snapshotExporterModalService.snapshotWorkflowVersion(this.workflow, this.version).subscribe(() => this.dialogRef.close());
    // If there's an error, leave dialog up. this.snapshotExporterModalService.snapshotWorkflowVersion displays error message
  }

  /**
   * Invoked when exporting to DOI and/or ORCID. Executes all steps as necessary
   * @param snapshotConfirmed - if true, caller has confirmed that they want do do the snapshot step
   */
  export(snapshotConfirmed: boolean) {
    if (!this.isSnapshot && !snapshotConfirmed) {
      this.promptToConfirmSnapshot = true;
    } else {
      const observables: Observable<void>[] = [];
      if (!this.isSnapshot) {
        observables.push(this.snapshotStep());
      }
      if (!this.version.doiURL) {
        observables.push(this.requestDOIStep());
      }
      if (this.action === SnapshotExporterAction.ORCID) {
        observables.push(this.orcidStep());
      }

      // The individual observables update stepState, but we need to subscribe to trigger them
      concat(...observables).subscribe(() => {});
    }
  }

  private requestDOIStep() {
    return observableOf(1).pipe(
      tap(() => (this.state.doi = StepState.EXECUTING)),
      switchMap(() =>
        this.snapshotExporterModalService.requestDOI(this.workflow, this.version).pipe(
          tap(() => (this.state.doi = StepState.COMPLETED)),
          catchError((error) => {
            this.state.doi = StepState.ERROR;
            return EMPTY;
          })
        )
      )
    );
  }

  private snapshotStep() {
    return observableOf(1).pipe(
      tap(() => {
        console.log('hello');
        this.state.snapshot = StepState.EXECUTING;
      }),
      switchMap(() =>
        this.snapshotExporterModalService.snapshotWorkflowVersion(this.workflow, this.version).pipe(
          tap(() => (this.state.snapshot = StepState.COMPLETED)),
          catchError((error) => {
            this.state.snapshot = StepState.ERROR;
            return EMPTY;
          })
        )
      )
    );
  }

  private orcidStep() {
    return observableOf(null).pipe(
      tap(() => (this.state.orcid = StepState.EXECUTING)),
      switchMap(() =>
        this.snapshotExporterModalService.exportToOrcid(this.workflow, this.version).pipe(
          tap(() => (this.state.orcid = StepState.COMPLETED)),
          catchError((error) => {
            this.state.orcid = StepState.ERROR;
            return EMPTY;
          })
        )
      )
    );
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

  private calculateState(): State {
    return {
      snapshot: this.isSnapshot ? StepState.COMPLETED : StepState.INITIAL,
      doi: this.version.doiURL ? StepState.COMPLETED : StepState.INITIAL,
      orcid: this.version.versionMetadata.orcidPutCode ? StepState.COMPLETED : StepState.INITIAL,
    };
  }
}
