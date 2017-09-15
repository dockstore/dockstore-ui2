import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { WorkflowService } from './../../shared/workflow.service';
import { Component, Input } from '@angular/core';

import { DateService } from '../../shared/date.service';

import { Versions } from '../../shared/versions';
import { DockstoreService } from '../../shared/dockstore.service';


@Component({
  selector: 'app-versions-workflow',
  templateUrl: './versions.component.html',
  styleUrls: ['./versions.component.css']
})
export class VersionsWorkflowComponent extends Versions {
  @Input() versions: Array<any>;
  @Input() verifiedSource: Array<any>;
  @Input() workflowId: number;
  verifiedLink: string;
  defaultVersion: string;
  workflow: any;
  setNoOrderCols(): Array<number> {
    return [4, 5];
  }

  constructor(dockstoreService: DockstoreService, dateService: DateService,
    private workflowService: WorkflowService, private workflowsService: WorkflowsService) {
    super(dockstoreService, dateService);
    this.verifiedLink = dateService.getVerifiedLink();
    this.workflowService.workflow$.subscribe(workflow => {
      this.workflow = workflow;
      if (workflow) {
        this.defaultVersion = workflow.defaultVersion;
      }
    });
  }

  updateDefaultVersion(newDefaultVersion: string) {
    this.workflow.defaultVersion = newDefaultVersion;
    this.workflowsService.updateWorkflow(this.workflowId, this.workflow).subscribe(
      response => this.workflowService.setWorkflow(response));
  }

  getVerifiedSource(name: string) {
    return this.dockstoreService.getVerifiedSource(name, this.verifiedSource);
  }
}
