/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EntryType } from 'app/shared/enum/entry-type';
import { RefreshService } from 'app/shared/refresh.service';
import { BioWorkflow } from 'app/shared/openapi/model/bioWorkflow';
import { Service } from 'app/shared/openapi/model/service';
import { Notebook } from 'app/shared/openapi/model/notebook';
import { UserQuery } from 'app/shared/user/user.query';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertQuery } from '../../shared/alert/state/alert.query';
import { AlertService } from '../../shared/alert/state/alert.service';
import { bootstrap4largeModalSize, ga4ghServiceIdPrefix, ga4ghWorkflowIdPrefix } from '../../shared/constants';
import { DateService } from '../../shared/date.service';
import { Dockstore } from '../../shared/dockstore.model';
import { Doi, Entry, VersionVerifiedPlatform, WorkflowVersion } from '../../shared/openapi';
import { SessionQuery } from '../../shared/session/session.query';
import { WorkflowQuery } from '../../shared/state/workflow.query';
import { WorkflowService } from '../../shared/state/workflow.service';
import { HostedService } from '../../shared/openapi/api/hosted.service';
import { WorkflowsService } from '../../shared/openapi/api/workflows.service';
import { Workflow } from '../../shared/openapi/model/workflow';
import { View } from '../../shared/view';
import { SnaphotExporterModalComponent, SnapshotExporterAction } from '../snapshot-exporter-modal/snaphot-exporter-modal.component';
import { VersionModalComponent } from '../version-modal/version-modal.component';
import { VersionModalService } from '../version-modal/version-modal.service';
import { ViewService } from './view.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-view-workflow',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
  standalone: true,
  imports: [NgIf, MatButtonModule, MatMenuModule, MatTooltipModule, AsyncPipe],
})
export class ViewWorkflowComponent extends View<WorkflowVersion> implements OnInit {
  @Input() workflowId: number;
  @Input() canRead: boolean;
  @Input() canWrite: boolean;
  @Input() isOwner: boolean;
  @Input() defaultVersion: string;
  @Input() verifiedVersionPlatforms: Array<VersionVerifiedPlatform>;
  @Input() verifiedSources: Array<any>;
  items: any[];
  isPublic: boolean;
  userId: number;
  EntryType = EntryType;
  DoiInitiatorEnum = Doi.InitiatorEnum;
  public entryType$: Observable<EntryType>;
  public workflow: BioWorkflow | Service | Notebook;
  public WorkflowType = Workflow;
  public enableExportToOrcid = Dockstore.FEATURES.enableOrcidExport;
  constructor(
    alertQuery: AlertQuery,
    private viewService: ViewService,
    private workflowService: WorkflowService,
    private workflowQuery: WorkflowQuery,
    private versionModalService: VersionModalService,
    private sessionQuery: SessionQuery,
    private workflowsService: WorkflowsService,
    private matDialog: MatDialog,
    private hostedService: HostedService,
    private refreshService: RefreshService,
    dateService: DateService,
    private alertService: AlertService,
    private userQuery: UserQuery
  ) {
    super(dateService, alertQuery);
  }

  showVersionModal() {
    this.versionModalService.setVersion(this.version);
    this.alertService.start('Getting test parameter files');
    this.workflowsService.getTestParameterFiles1(this.workflowId, this.version.name).subscribe(
      (items) => {
        this.items = items;
        this.versionModalService.setTestParameterFiles(this.items);
        this.openVersionModal();
        this.alertService.simpleSuccess();
      },
      (error) => {
        // TODO: Figure out a better way to handle this
        // If we were to open the modal without test parameter files and the user saves,
        // the legit files that were already there would be wiped out
        // This is why we're straight up not opening the modal if getting the test parameter files failed
        // Need to figure out a way to allow the user to edit version properties without test parameter files
        this.alertService.detailedError(error);
      }
    );
  }

  updateDefaultVersion() {
    this.viewService.updateDefaultVersion(this.version.name);
  }

  /**
   * Opens the version modal
   *
   * @private
   * @memberof ViewWorkflowComponent
   */
  private openVersionModal(): void {
    this.matDialog.open(VersionModalComponent, {
      width: '600px',
      data: {
        canRead: this.canRead,
        canWrite: this.canWrite && !this.version.frozen,
        isOwner: this.isOwner,
        verifiedVersionPlatforms: this.verifiedVersionPlatforms,
        verifiedSources: this.verifiedSources,
      },
    });
  }

  /**
   * Handles the create DOI button being clicked
   *
   * @memberof ViewWorkflowComponent
   */
  requestDOIForWorkflowVersion() {
    this.snaphshotExportDialog(SnapshotExporterAction.DOI);
  }

  /**
   * Opens a confirmation dialog that the Dockstore User can use to
   * confirm they want a snapshot.
   *
   * @memberof ViewWorkflowComponent
   */
  snapshotVersion(): void {
    this.snaphshotExportDialog(SnapshotExporterAction.SNAPSHOT);
  }

  exportToOrcid() {
    this.snaphshotExportDialog(SnapshotExporterAction.ORCID);
  }

  private snaphshotExportDialog(action: SnapshotExporterAction) {
    this.matDialog.open(SnaphotExporterModalComponent, {
      width: bootstrap4largeModalSize,
      data: {
        workflow: this.workflow,
        version: this.version,
        action: action,
        userId: this.userId,
      },
    });
  }
  ngOnInit() {
    if (this.userQuery.getValue().user) {
      this.userId = this.userQuery.getValue().user.id;
    }
    this.entryType$ = this.sessionQuery.entryType$;
    this.sessionQuery.isPublic$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((isPublic) => (this.isPublic = isPublic));
    this.workflowQuery.workflow$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((workflow) => (this.workflow = workflow));
  }

  refreshVersion() {
    const prefix = this.sessionQuery.getValue().entryType === EntryType.Service ? ga4ghServiceIdPrefix : ga4ghWorkflowIdPrefix;
    this.refreshService.refreshWorkflowVersion(prefix, this.workflow, this.version.name);
  }

  deleteHostedVersion() {
    let deleteMessage =
      'Are you sure you want to delete version ' + this.version.name + ' for workflow ' + this.workflow.full_workflow_path + '?';
    if (this.defaultVersion === this.version.name) {
      deleteMessage += ' This is the default version and deleting it will set the default version to be the latest version.';
    }
    const confirmDelete = confirm(deleteMessage);
    if (confirmDelete) {
      this.alertService.start('Deleting version ' + this.version.name);
      this.hostedService.deleteHostedWorkflowVersion(this.workflow.id, this.version.name).subscribe(
        (result) => {
          if (this.isWorkflow(result)) {
            this.workflowService.setWorkflow(result);
          }
          this.alertService.simpleSuccess();
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
        }
      );
    }
  }

  private isWorkflow(entry: Entry): entry is Workflow {
    return (entry as Workflow).entryType === 'WORKFLOW';
  }
}
