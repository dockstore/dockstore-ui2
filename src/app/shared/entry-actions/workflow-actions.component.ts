import { Component, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AlertQuery } from '../alert/state/alert.query';
import { ga4ghServiceIdPrefix, ga4ghWorkflowIdPrefix } from '../constants';
import { EntryType } from '../enum/entry-type';
import { RefreshService } from '../refresh.service';
import { SessionQuery } from '../session/session.query';
import { TokenQuery } from '../state/token.query';
import { BioWorkflow, Service, Notebook, WorkflowVersion } from '../openapi';
import { Workflow } from '../openapi/model/workflow';
import { EntryActionsComponent } from './entry-actions.component';
import { EntryActionsService } from './entry-actions.service';
import { DeleteEntryDialogComponent } from '../../entry/delete/dialog/delete-entry-dialog.component';
import { bootstrap4largeModalSize } from '../../shared/constants';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-workflow-actions',
  templateUrl: './workflow-actions.component.html',
  styleUrls: ['./entry-actions.component.scss'],
  standalone: true,
  imports: [NgIf, FlexModule, MatButtonModule, RouterLink, MatTooltipModule, AsyncPipe],
})
export class WorkflowActionsComponent extends EntryActionsComponent implements OnInit, OnChanges {
  @Input() workflow: BioWorkflow | Service | Notebook;
  @Input() selectedVersion: WorkflowVersion;
  @Input() isOwner: boolean;
  @Input() canWrite: boolean;
  @Output() showVersions = new EventEmitter<void>();
  EntryType = EntryType;
  zenodoAccountIsLinked$: Observable<boolean>;
  WorkflowModel = Workflow;

  constructor(
    protected entryActionsService: EntryActionsService,
    protected alertQuery: AlertQuery,
    private tokenQuery: TokenQuery,
    private refreshService: RefreshService,
    private sessionQuery: SessionQuery,
    public dialog: MatDialog
  ) {
    super(alertQuery, entryActionsService);
    this.zenodoAccountIsLinked$ = this.tokenQuery.hasZenodoToken$;
  }

  ngOnInit() {
    this.commonNgOnInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.publishDisabled = this.entryActionsService.publishWorkflowDisabled(this.workflow, this.isOwner);
    this.commonNgOnChanges(this.workflow);
  }

  /**
   * Handles the publish/unpublish button being clicked
   *
   * @memberof EntryActionsComponent
   */
  publishToggle() {
    this.entryActionsService.publishWorkflowToggle(this.workflow, this.isOwner, this.entryType, this.showVersions);
  }

  /**
   * Handles the refresh button being clicked
   *
   * @memberof EntryActionsComponent
   */
  refresh() {
    const versionName = this.selectedVersion ? this.selectedVersion.name : null;
    const prefix = this.sessionQuery.getValue().entryType === EntryType.Service ? ga4ghServiceIdPrefix : ga4ghWorkflowIdPrefix;
    this.refreshService.refreshWorkflow(prefix + this.workflow.full_workflow_path, versionName);
  }

  delete() {
    this.dialog.open(DeleteEntryDialogComponent, { width: bootstrap4largeModalSize, data: this.workflow });
  }

  archive() {
    this.entryActionsService.archiveEntry(this.workflow);
  }

  unarchive() {
    this.entryActionsService.unarchiveEntry(this.workflow);
  }
}
