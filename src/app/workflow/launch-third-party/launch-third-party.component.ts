import { Component, Input } from '@angular/core';
import { Workflow, WorkflowVersion } from '../../shared/swagger';
import { ExtendedWorkflow } from '../../shared/models/ExtendedWorkflow';
import { SourceFile } from '../../shared/swagger/model/sourceFile';
import { WorkflowsService } from '../../shared/swagger/api/workflows.service';
import { LaunchThirdPartyService } from './launch-third-party.service';

@Component({
  selector: 'app-launch-third-party',
  templateUrl: './launch-third-party.component.html',
  styleUrls: ['./launch-third-party.component.scss']
})
export class LaunchThirdPartyComponent {

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
  dnanexusURL: string;

  constructor(private workflowsService: WorkflowsService, private launchThirdPartyService: LaunchThirdPartyService) { }

  private onChange() {
    this.fireCloudURL = null;
    this.dnastackURL = null;
    this.dnanexusURL = null;
    if (this.isWdl(this.workflow)) {
      this.dnastackURL = this.launchThirdPartyService.dnastackUrl(this.workflow.full_workflow_path, this.workflow.descriptorType);
      const version = this.selectedVersion;
      if (version && this.isWdl(this.workflow)) {
        this.dnanexusURL = this.launchThirdPartyService.dnanexusUrl(version.workflow_path, version.name);
        this.setupFireCloudUrl(this.workflow);
      }
    }
  }

  private isWdl(workflowRef: ExtendedWorkflow) {
    return workflowRef && workflowRef.full_workflow_path && workflowRef.descriptorType === 'wdl';
  }

  private setupFireCloudUrl(workflowRef: ExtendedWorkflow) {
    const version: WorkflowVersion = this.selectedVersion;
    this.workflowsService.wdl(workflowRef.id, version.name).subscribe((sourceFile: SourceFile) => {
      if (sourceFile && sourceFile.content && sourceFile.content.length) {
        this.workflowsService.secondaryWdl(workflowRef.id, version.name).subscribe((sourceFiles: Array<SourceFile>) => {
          if (!sourceFiles || sourceFiles.length === 0) {
            this.fireCloudURL = this.launchThirdPartyService.firecloudUrl(workflowRef.full_workflow_path, version.name);
          }
        });
      }
    });
  }

}
