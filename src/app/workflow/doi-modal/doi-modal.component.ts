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

export interface DoiModalDialogData {
  workflow: BioWorkflow;
  version: WorkflowVersion;
}

@Component({
  selector: 'app-doi-modal-component',
  templateUrl: './doi-modal.component.html',
  styleUrls: ['./doi-modal.component.scss'],
})
export class DoiModalComponent extends Base implements OnInit {
  public hasZenodoToken$: Observable<boolean> = this.tokenQuery.hasZenodoToken$;
  public isSnapshot: boolean = this.dialogData.version.frozen;
  public workflow: BioWorkflow;
  public version: WorkflowVersion;
  public Dockstore = Dockstore;

  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: DoiModalDialogData,
    private dialogRef: MatDialogRef<DoiModalComponent>,
    private tokenQuery: TokenQuery,
    private alertService: AlertService,
    private viewService: ViewService,
    private router: Router
  ) {
    super();
    this.workflow = dialogData.workflow;
    this.version = dialogData.version;
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

  requestDOI() {
    this.viewService.requestDOIForWorkflowVersion(this.workflow, this.version);
    this.dialogRef.close(0);
  }

  closeForSnapshot() {
    this.dialogRef.close('snapshot');
  }
}
