import { Component, Input } from '@angular/core';
import { CommunicatorService } from '../../shared/communicator.service';

import { ToolLister } from '../../shared/tool-lister';

import { ListService } from '../../shared/list.service';
import { ProviderService } from '../../shared/provider.service';

import { WorkflowService } from '../../shared/workflow.service';
import { DockstoreService } from '../../shared/dockstore.service';

@Component({
  selector: 'app-list-workflows',
  templateUrl: './list.component.html'
})
export class ListWorkflowsComponent extends ToolLister {
  @Input() previewMode: boolean;
  // TODO: make an API endpoint to retrieve only the necessary properties for the workflows table
  constructor(private communicatorService: CommunicatorService,
              private workflowService: WorkflowService,
              private dockstoreService: DockstoreService,
              listService: ListService, providerService: ProviderService) {
    super(listService, providerService, 'workflows');
  }

  sendWorkflowInfo(workflow) {
    this.communicatorService.setWorkflow(workflow);
    this.workflowService.setWorkflow(workflow);
  }

  initToolLister(): void {
  }
  getVerified(workflow) {
    return this.dockstoreService.getVersionVerified(workflow.workflowVersions);
  }
}
