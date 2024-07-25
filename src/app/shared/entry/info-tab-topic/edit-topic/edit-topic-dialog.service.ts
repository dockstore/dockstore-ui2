import { Injectable } from '@angular/core';
import { AlertService } from '../../../alert/state/alert.service';
import { ContainersService, DockstoreTool, EntryType, Workflow, WorkflowsService } from '../../../openapi';
import { WorkflowService } from '../../../state/workflow.service';
import { ContainerService } from '../../../container.service';
import { WorkflowQuery } from 'app/shared/state/workflow.query';
import { ToolQuery } from 'app/shared/tool/tool.query';

@Injectable()
export class EditTopicDialogService {
  constructor(
    private alertService: AlertService,
    private workflowsService: WorkflowsService,
    private workflowService: WorkflowService,
    private containersService: ContainersService,
    private containerService: ContainerService,
    private workflowQuery: WorkflowQuery,
    private toolQuery: ToolQuery
  ) {}

  saveTopicChanges(entry: Workflow | DockstoreTool, topicManual: string, topicSelection: Workflow.TopicSelectionEnum) {
    this.alertService.start('Saving topic changes');
    const newEntryForUpdate = { ...entry, topicManual: topicManual, topicSelection: topicSelection };

    if (entry.entryType === EntryType.TOOL) {
      this.containersService.updateContainer(entry.id, newEntryForUpdate as DockstoreTool).subscribe(
        (response) => {
          this.alertService.detailedSuccess();
          this.containerService.setTool({
            ...this.toolQuery.getActive(),
            topicManual: response.topicManual,
            topicSelection: response.topicSelection,
            approvedAITopic: response.approvedAITopic,
          });
        },
        (error) => {
          this.alertService.detailedError(error);
        }
      );
    } else {
      this.workflowsService.updateWorkflow(entry.id, newEntryForUpdate as Workflow).subscribe(
        (response) => {
          this.alertService.detailedSuccess();
          this.workflowService.setWorkflow({
            ...this.workflowQuery.getActive(),
            topicManual: response.topicManual,
            topicSelection: response.topicSelection,
            approvedAITopic: response.approvedAITopic,
          });
        },
        (error) => {
          this.alertService.detailedError(error);
        }
      );
    }
  }
}
