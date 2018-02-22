import { updatedWorkflow } from './../../../test/mocked-objects';
import { CheckerWorkflowService } from './../../checker-workflow.service';
import { Workflow } from './../../swagger/model/workflow';
import { WorkflowService } from './../../workflow.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-launch-checker-workflow',
  templateUrl: './launch-checker-workflow.component.html',
  styleUrls: ['./launch-checker-workflow.component.css']
})
export class LaunchCheckerWorkflowComponent implements OnInit {
  command = '';
  workflowPath: string;
  versionName: string;
  constructor(private checkerWorkflowService: CheckerWorkflowService) { }

  ngOnInit() {
    this.checkerWorkflowService.checkerWorkflowPath$.subscribe((workflowPath: string) => {
      this.workflowPath = workflowPath;
      this.updateCommand();
    });
    this.checkerWorkflowService.checkerWorkflowVersion$.subscribe((versionName: string) => {
      this.versionName = versionName;
      this.updateCommand();
    });
  }

  /**
   * Updates the command based on the subscribed workflowPath and versionName
   */
  private updateCommand(): void {
    if (this.workflowPath) {
      this.command = this.getCommand(this.workflowPath, this.versionName);
    }
  }

  /**
   * Gets the checker workflow check command
   * @param workflowPath The checker workflow's path
   * @param version The version of the checker workflow
   */
  private getCommand(workflowPath: string, version: string): string {
    return '$ dockstore workflow check --entry ' + workflowPath + ':' + version + ' checkparam.json';
  }
}
