import { validationPatterns } from './../../shared/validationMessages.model';
import { InfoTabService } from './info-tab.service';
import { StateService } from './../../shared/state.service';
import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { Workflow } from './../../shared/swagger/model/workflow';
import { WorkflowService } from './../../shared/workflow.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-info-tab',
  templateUrl: './info-tab.component.html',
  styleUrls: ['./info-tab.component.css']
})
export class InfoTabComponent implements OnInit {
  @Input() validVersions;
  @Input() defaultVersion;
  public validationPatterns = validationPatterns;
  workflow: Workflow;
  workflowPathEditing: boolean;
  descriptorTypeEditing: boolean;
  isPublic: boolean;
  constructor(private workflowService: WorkflowService, private workflowsService: WorkflowsService, private stateService: StateService,
  private infoTabService: InfoTabService) { }

  ngOnInit() {
    this.workflowService.workflow$.subscribe(workflow => this.workflow = workflow);
    this.stateService.publicPage.subscribe(isPublic => this.isPublic = isPublic);
    this.infoTabService.workflowPathEditing$.subscribe(editing => this.workflowPathEditing = editing);
    this.infoTabService.descriptorTypeEditing$.subscribe(editing => this.descriptorTypeEditing = editing);
  }

  restubWorkflow() {
    this.workflowsService.restub(this.workflow.id).subscribe(response => {
      this.workflowService.setWorkflow(response);
    });
  }

  toggleEditWorkflowPath() {
    if (this.workflowPathEditing) {
      this.save();
    }
    this.infoTabService.setWorkflowPathEditing(!this.workflowPathEditing);
  }

  save() {
    this.infoTabService.updateAndRefresh(this.workflow);
  }
}
