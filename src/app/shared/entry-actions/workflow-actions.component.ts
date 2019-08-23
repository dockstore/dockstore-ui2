import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AlertQuery } from '../alert/state/alert.query';
import { ga4ghWorkflowIdPrefix, ga4ghServiceIdPrefix } from '../constants';
import { EntryType } from '../enum/entry-type';
import { RefreshService } from '../refresh.service';
import { BioWorkflow, Service, WorkflowVersion } from '../swagger';
import { EntryActionsComponent } from './entry-actions.component';
import { EntryActionsService } from './entry-actions.service';
import { Observable } from 'rxjs';
import { TokenQuery } from '../state/token.query';
import { SessionQuery } from '../session/session.query';

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
  EntryType = EntryType;
  zenodoAccountIsLinked$: Observable<boolean>;

  constructor(
    protected entryActionsService: EntryActionsService,
    protected alertQuery: AlertQuery,
    private tokenQuery: TokenQuery,
    private refreshService: RefreshService,
    private sessionQuery: SessionQuery
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
    this.entryActionsService.publishWorkflowToggle(this.workflow, this.isOwner, this.entryType);
  }

  /**
   * Handles the refresh button being clicked
   *
   * @memberof EntryActionsComponent
   */
  refresh() {
    const versionName = this.selectedVersion ? this.selectedVersion.name : null;
    const prefix = this.sessionQuery.getSnapshot().entryType === EntryType.Service ? ga4ghServiceIdPrefix : ga4ghWorkflowIdPrefix;
    this.refreshService.refreshWorkflow(prefix + this.workflow.full_workflow_path, versionName);
  }
}
