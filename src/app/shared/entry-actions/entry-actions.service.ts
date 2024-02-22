import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { AlertService } from '../alert/state/alert.service';
import { includesAuthors, includesVersions } from '../constants';
import { ContainerService } from '../container.service';
import { EntryType } from '../enum/entry-type';
import { WorkflowService } from '../state/workflow.service';
import { ContainersService, DockstoreTool, EntriesService, Entry, PublishRequest, Workflow, WorkflowsService } from '../openapi';
import { EntryType as OpenApiEntryType } from '../openapi';
import { InformationDialogData } from '../../information-dialog/information-dialog.component';
import { InformationDialogService } from '../../information-dialog/information-dialog.service';
import { ArchiveEntryDialogComponent } from '../../entry/archive/dialog/archive-entry-dialog.component';
import { bootstrap4mediumModalSize, bootstrap4largeModalSize } from '../../shared/constants';

@Injectable()
export class EntryActionsService {
  constructor(
    private alertService: AlertService,
    private entriesService: EntriesService,
    private workflowsService: WorkflowsService,
    private workflowService: WorkflowService,
    private containersService: ContainersService,
    private containerService: ContainerService,
    private informationDialogService: InformationDialogService,
    private dialog: MatDialog
  ) {}

  getViewPublicButtonTooltip(entryType: EntryType | null): string {
    if (!entryType) {
      console.error('Null entryType, entryType should be present');
      return '';
    } else {
      return `Go to the public page for this ${entryType}`;
    }
  }

  /**
   * Workflow publish should be disabled if not valid or is stub or is not owner
   *
   * @param {Workflow} workflow  The workflow to publish/unpublish
   * @param {boolean} isOwner  Whether the user owns the workflow or not
   * @returns {boolean}  Whether the publish button should be disabled or not
   * @memberof EntryActionsService
   */
  publishWorkflowDisabled(workflow: Workflow | null, isOwner: boolean): boolean {
    if (!workflow) {
      return true;
    } else {
      return !this.isEntryValid(workflow) || workflow.mode === Workflow.ModeEnum.STUB || !isOwner;
    }
  }

  /**
   * Tool publish should be disabled entirely based on whether it's valid or not
   *
   * @param {(DockstoreTool | null)} tool  The tool to publish/unpublish
   * @returns {boolean}  Whether the publish button should be disabled or not
   * @memberof EntryActionsService
   */
  publishToolDisabled(tool: DockstoreTool | null): boolean {
    if (!tool) {
      return true;
    } else {
      return !this.isEntryValid(tool);
    }
  }

  isEntryHosted(entry: DockstoreTool | Workflow | null): boolean {
    if (DockstoreTool.ModeEnum.HOSTED !== Workflow.ModeEnum.HOSTED) {
      console.error('ModeEnum.Hosted for all entries should be the same');
    }
    if (entry) {
      return entry.mode === DockstoreTool.ModeEnum.HOSTED;
    } else {
      return true;
    }
  }

  getPublishMessage(entry: Entry | null, entryType: EntryType | null): string {
    if (!entry) {
      console.error('Null entry, component should exist');
      return '';
    }
    if (!entryType) {
      console.error('Null entryType, entryType should be present');
      return '';
    }
    if (entry.is_published) {
      return `Unpublish the ${entryType} to remove it from the public`;
    } else if (!entry.workflowVersions || !entry.workflowVersions.some((version) => version.valid)) {
      return 'Unable to publish: No valid versions found';
    } else {
      return `Publish the ${entryType} to make it visible to the public`;
    }
  }

  private isEntryValid(entry: Entry | null): boolean {
    if (!entry) {
      return false;
    }
    if (entry.is_published) {
      return true;
    }
    const versionTags = entry.workflowVersions;
    if (!versionTags) {
      return false;
    }
    return versionTags.some((version) => version.valid);
  }

  private hasDefaultTag(entry: Entry): boolean {
    return entry.defaultVersion != null;
  }

  openNoDefaultDialog(entry: Entry, entryType: string, showVersions: EventEmitter<void> | null): void {
    const informationDialogData: InformationDialogData = {
      title: 'Default Version Required',
      message: `Your ${entryType} must have a default version to be published.  Please use the Actions menu in the Versions tab to select a default version.`,
      closeButtonText: 'OK',
    };
    const observable = this.informationDialogService.openDialog(informationDialogData, bootstrap4mediumModalSize);
    if (showVersions != null) {
      observable.subscribe(() => {
        showVersions.emit();
      });
    }
  }

  publishWorkflowToggle(workflow: Workflow, isOwner: boolean, entryType: EntryType, emitter: EventEmitter<void> | null): void {
    const currentlyPublished = workflow.is_published;
    if (this.publishWorkflowDisabled(workflow, isOwner)) {
      return;
    } else {
      if (!currentlyPublished && !this.hasDefaultTag(workflow)) {
        this.openNoDefaultDialog(workflow, 'workflow', emitter);
        return;
      }
      const request: PublishRequest = {
        publish: !currentlyPublished,
      };
      const message = !currentlyPublished ? `Publishing ${entryType}` : `Unpublishing ${entryType}`;
      this.alertService.start(message);
      this.workflowsService.publish1(workflow.id, request).subscribe(
        (response: Workflow) => {
          this.workflowService.upsertWorkflowToWorkflow(response);
          this.workflowService.setWorkflow(response);
          this.alertService.detailedSuccess();
          // Publishing a workflow with a checker also updates the checker workflow in my-workflows
          if (response.checker_id) {
            this.workflowsService.getWorkflow(response.checker_id, includesVersions + ',' + includesAuthors).subscribe(
              (responseWorkflow: Workflow) => {
                this.workflowService.upsertWorkflowToWorkflow(responseWorkflow);
              },
              (error: HttpErrorResponse) => this.alertService.detailedError(error)
            );
          }
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
        }
      );
    }
  }

  publishToolToggle(tool: DockstoreTool, emitter: EventEmitter<void> | null) {
    const currentlyPublished = tool.is_published;
    if (this.publishToolDisabled(tool)) {
      return;
    } else {
      if (!currentlyPublished && !this.hasDefaultTag(tool)) {
        this.openNoDefaultDialog(tool, 'tool', emitter);
        return;
      }
      const request: PublishRequest = {
        publish: !currentlyPublished,
      };
      const message = !currentlyPublished ? 'Publishing tool' : 'Unpublishing tool';
      this.alertService.start(message);
      this.containersService.publish(tool.id, request).subscribe(
        (response) => {
          this.containerService.upsertToolToTools(response);
          this.containerService.setTool(response);
          this.alertService.detailedSuccess();
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
        }
      );
    }
  }

  archiveEntry(entry: Entry) {
    const dialogRef = this.dialog.open(ArchiveEntryDialogComponent, {
      width: bootstrap4largeModalSize,
      data: entry,
    });
    dialogRef.afterClosed().subscribe((archived: Entry) => {
      if (archived) {
        this.updateBackingEntry(archived);
      }
    });
  }

  unarchiveEntry(entry: Entry) {
    this.alertService.start('Unarchiving entry');
    this.entriesService.unarchiveEntry(entry.id).subscribe(
      (unarchived: Entry) => {
        this.updateBackingEntry(unarchived);
        this.alertService.detailedSuccess();
      },
      (error: HttpErrorResponse) => {
        this.alertService.detailedError(error);
      }
    );
  }

  updateBackingEntry(entry: Entry) {
    if (entry.entryType === OpenApiEntryType.TOOL) {
      const tool = entry as DockstoreTool;
      this.containerService.upsertToolToTools(tool);
      this.containerService.setTool(tool);
    } else {
      const workflow = entry as Workflow;
      this.workflowService.upsertWorkflowToWorkflow(workflow);
      this.workflowService.setWorkflow(workflow);
    }
  }
}
