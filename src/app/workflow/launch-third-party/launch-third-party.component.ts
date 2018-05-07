import { Component, Input, OnInit } from '@angular/core';
import { Workflow, WorkflowVersion } from '../../shared/swagger';
import { Dockstore } from '../../shared/dockstore.model';
import { ExtendedWorkflow } from '../../shared/models/ExtendedWorkflow';
import { SourceFile } from '../../shared/swagger/model/sourceFile';
import { WorkflowsService } from '../../shared/swagger/api/workflows.service';
import { URLSearchParams } from '@angular/http';

@Component({
  selector: 'app-launch-third-party',
  templateUrl: './launch-third-party.component.html',
  styleUrls: ['./launch-third-party.component.scss']
})
export class LaunchThirdPartyComponent implements OnInit {

  private _workflow: Workflow;
  private _selectedVersion: WorkflowVersion;

  @Input() set workflow(value: Workflow) {
    this._workflow = value;
    this.onChange();
  }

  get workflow(): Workflow {
    return this._workflow;
  }

  @Input() set selectedVersion(value: WorkflowVersion) {
    this._selectedVersion = value;
    this.onChange();
  }

  get selectedVersion() {
    return this._selectedVersion;
  }

  dnastackURL: string;
  fireCloudURL: string;

  constructor(private workflowsService: WorkflowsService) { }

  ngOnInit() {
  }

  private onChange() {
    this.setupFireCloudUrl(this.workflow);
    this.setupDnaStackUrl(this.workflow);
  }

  private isWdl(workflowRef: ExtendedWorkflow) {
    return workflowRef && workflowRef.full_workflow_path && workflowRef.descriptorType === 'wdl';
  }


  private setupFireCloudUrl(workflowRef: ExtendedWorkflow) {
    if (Dockstore.FEATURES.enableLaunchWithFireCloud) {
      this.fireCloudURL = null;
      const version: WorkflowVersion = this.selectedVersion;
      if (version && this.isWdl(workflowRef)) {
        this.workflowsService.wdl(workflowRef.id, version.name).subscribe((sourceFile: SourceFile) => {
          if (sourceFile && sourceFile.content && sourceFile.content.length) {
            this.workflowsService.secondaryWdl(workflowRef.id, version.name).subscribe((sourceFiles: Array<SourceFile>) => {
              if (!sourceFiles || sourceFiles.length === 0) {
                this.fireCloudURL =  `${Dockstore.FIRECLOUD_IMPORT_URL}/${workflowRef.full_workflow_path}:${version.name}`;
              }
            });
          }
        });
      }
    }
  }

  private setupDnaStackUrl(workflow: ExtendedWorkflow) {
    if (this.isWdl(workflow)) {
      const myParams = new URLSearchParams();
      myParams.set('path', workflow.full_workflow_path);
      myParams.set('descriptorType', workflow.descriptorType);
      this.dnastackURL = Dockstore.DNASTACK_IMPORT_URL + '?' + myParams;
    }
  }
}
