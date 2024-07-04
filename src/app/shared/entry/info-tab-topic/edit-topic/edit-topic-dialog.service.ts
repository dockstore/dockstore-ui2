import { Injectable } from '@angular/core';
import { AlertService } from '../../../alert/state/alert.service';
import { ContainersService, DockstoreTool, EntryType, Workflow, WorkflowsService } from '../../../openapi';
import { WorkflowService } from '../../../state/workflow.service';
import { ContainerService } from '../../../container.service';

@Injectable()
export class EditTopicDialogService {
  constructor(
    private alertService: AlertService,
    private workflowsService: WorkflowsService,
    private workflowService: WorkflowService,
    private containersService: ContainersService,
    private containerService: ContainerService
  ) {}

  saveTopicChanges(entry: Workflow | DockstoreTool, topicManual: string, topicSelection: Workflow.TopicSelectionEnum) {
    this.alertService.start('Saving topic changes');
    const newEntryForUpdate = { ...entry, topicManual: topicManual, topicSelection: topicSelection };

    if (entry.entryType === EntryType.TOOL) {
      //const partialEntryForUpdate = this.getPartialToolForUpdate(entry);
      this.containersService.updateContainer(entry.id, newEntryForUpdate as DockstoreTool).subscribe(
        (response) => {
          this.alertService.detailedSuccess();
          const newTopicSelection = response.topicSelection;
          this.containerService.updateActiveTopicSelection(newTopicSelection);
          const newTopic = response.topicManual;
          this.containerService.updateActiveTopic(newTopic);
        },
        (error) => {
          this.alertService.detailedError(error);
        }
      );
    } else {
      this.workflowsService.updateWorkflow(entry.id, newEntryForUpdate as Workflow).subscribe(
        (response) => {
          this.alertService.detailedSuccess();
          const newTopicSelection = response.topicSelection;
          const newTopic = response.topicManual;
          this.workflowService.updateActiveTopicManualAndTopicSelection(newTopic, newTopicSelection);
        },
        (error) => {
          this.alertService.detailedError(error);
        }
      );
    }
    //const partialEntryForUpdate = this.getPartialEntryForUpdate(newWorkflow);
  }
}
