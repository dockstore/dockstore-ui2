import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { WorkflowVersion } from './../../shared/swagger/model/workflowVersion';
import { Workflow } from './../../shared/swagger/model/workflow';
import { WorkflowService } from './../../shared/workflow.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tool-tab',
  templateUrl: './tool-tab.component.html',
  styleUrls: ['./tool-tab.component.css']
})
export class ToolTabComponent implements OnInit {
  workflow: Workflow;
  selectVersion: WorkflowVersion;
  toolsContent: any;
  constructor(private workflowService: WorkflowService, private workflowsService: WorkflowsService) { }

  ngOnInit() {
    this.workflowService.workflow$.subscribe(workflow => {
      this.workflow = workflow;
      this.selectVersion = this.workflow.workflowVersions.find(x => x.name === this.workflow.defaultVersion);
      this.onChange();
    });
  }

  onChange() {
    if (this.selectVersion) {
      this.workflowsService.getTableToolContent(this.workflow.id, this.selectVersion.id).subscribe(
        (toolContent) => {
          this.toolsContent = toolContent;
        }, error => this.toolsContent = null);
    } else {
      this.toolsContent = null;
    }
  }
}
