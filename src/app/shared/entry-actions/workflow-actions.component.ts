import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AlertQuery } from '../alert/state/alert.query';
import { ga4ghWorkflowIdPrefix } from '../constants';
import { EntryType } from '../enum/entry-type';
import { RefreshService } from '../refresh.service';
import { BioWorkflow, Service, WorkflowVersion } from '../swagger';
import { EntryActionsComponent } from './entry-actions.component';
import { EntryActionsService } from './entry-actions.service';

@Component({
  selector: 'app-workflow-actions',
  templateUrl: './workflow-actions.component.html',
  styleUrls: ['./entry-actions.component.scss']
})
export class WorkflowActionsComponent extends EntryActionsComponent implements OnInit, OnChanges {
  @Input() workflow: BioWorkflow | Service;
  @Input() selectedVersion: WorkflowVersion;
  @Input() isOwner: boolean;
  @Input() canWrite: boolean;
  createdoimessage = 'Create a digital object identifier (DOI) for this version';
  EntryType = EntryType;
  constructor(
    protected entryActionsService: EntryActionsService,
    protected alertQuery: AlertQuery,
    private refreshService: RefreshService
  ) {
    super(alertQuery, entryActionsService);
  }

  ngOnInit() {
    this.commonNgOnInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.publishDisabled = this.entryActionsService.publishWorkflowDisabled(this.workflow, this.isOwner);
    this.commonNgOnChanges(this.workflow);
  }

  /**
   * Handles the create DOI button being clicked
   *
   * @memberof EntryActionsComponent
   */
  requestDOIForWorkflowVersion() {
    this.entryActionsService.requestDOIForWorkflowVersion(this.workflow, this.selectedVersion);
  }

  /**
   * Handles the publish/unpublish button being clicked
   *
   * @memberof EntryActionsComponent
   */
  publishToggle() {
    this.entryActionsService.publishWorkflowToggle(this.workflow, this.isOwner, this.entryType);
  }

  /**
   * Handles the refresh button being clicked
   *
   * @memberof EntryActionsComponent
   */
  refresh() {
    const versionName = this.selectedVersion ? this.selectedVersion.name : null;
    this.refreshService.refreshWorkflow(ga4ghWorkflowIdPrefix + this.workflow.full_workflow_path, versionName);
  }
}
