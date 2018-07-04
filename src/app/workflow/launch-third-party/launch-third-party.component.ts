import { Component, Input } from '@angular/core';
import { Workflow, WorkflowVersion } from '../../shared/swagger';
import { Dockstore } from '../../shared/dockstore.model';
import { ExtendedWorkflow } from '../../shared/models/ExtendedWorkflow';
import { SourceFile } from '../../shared/swagger/model/sourceFile';
import { WorkflowsService } from '../../shared/swagger/api/workflows.service';
import { URLSearchParams } from '@angular/http';
import { LaunchThirdPartyService } from './launch-third-party.service';

const NO_CONTENT_ERROR = 'The WDL has no content.';
const IMPORTS_NOT_SUPPORTED = 'DNAstack does not support the WDL import statement.';
const FILE_IMPORTS_NOT_SUPPORTED = 'FireCloud does not support file-path imports in WDL. ' + '' +
  'It only supports http(s) imports.';


@Component({
  selector: 'app-launch-third-party',
  providers: [LaunchThirdPartyService],
  templateUrl: './launch-third-party.component.html',
  styleUrls: ['./launch-third-party.component.scss']
})
export class LaunchThirdPartyComponent {

  private _workflow: Workflow;
  private _selectedVersion: WorkflowVersion;
  private isWdl: boolean;

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
  fireCloudErrorMessage: string;
  dnastackErrorMessage: string;

  constructor(private workflowsService: WorkflowsService, private launchThirdPartyService: LaunchThirdPartyService) { }

  gotoFirecloud() {
    window.open(this.fireCloudURL, '_blank');
  }

  gotoDnastack() {
    window.open(this.dnastackURL, '_blank');
  }

  private onChange() {
    this.isWdl =  this.workflow && this.workflow.full_workflow_path && this.workflow.descriptorType === 'wdl';
    this.setupFireCloudUrl(this.workflow, this.selectedVersion);
    this.setupDnaStackUrl(this.workflow, this.selectedVersion);
  }

  private setupFireCloudUrl(workflowRef: ExtendedWorkflow, version: WorkflowVersion) {
    if (Dockstore.FEATURES.enableLaunchWithFireCloud) {
      this.fireCloudURL = null;
      this.fireCloudErrorMessage = '';
      if (version && this.isWdl) {
        this.workflowsService.wdl(workflowRef.id, version.name).subscribe((sourceFile: SourceFile) => {
          if (sourceFile && sourceFile.content && sourceFile.content.length) {
            this.workflowsService.secondaryWdl(workflowRef.id, version.name).subscribe((sourceFiles: Array<SourceFile>) => {
              if (!sourceFiles || sourceFiles.length === 0) {
                this.fireCloudURL =  `${Dockstore.FIRECLOUD_IMPORT_URL}/${workflowRef.full_workflow_path}:${version.name}`;
              } else {
                this.fireCloudErrorMessage = FILE_IMPORTS_NOT_SUPPORTED;
              }
            });
          } else {
            this.fireCloudErrorMessage = NO_CONTENT_ERROR;
          }
        });
      }
    }
  }

  private setupDnaStackUrl(workflow: ExtendedWorkflow, version: WorkflowVersion) {
    this.dnastackURL = null;
    this.dnastackErrorMessage = '';
    if (version && this.isWdl) {
      this.workflowsService.wdl(workflow.id, version.name).subscribe((sourceFile: SourceFile) => {
        if (sourceFile && sourceFile.content && sourceFile.content.length) {
          this.workflowsService.secondaryWdl(workflow.id, version.name).subscribe((sourceFiles: Array<SourceFile>) => {
            if (!sourceFiles || sourceFiles.length === 0 && !this.launchThirdPartyService.wdlHasHttpImports(sourceFile.content)) {
              const myParams = new URLSearchParams();
              myParams.set('path', workflow.full_workflow_path);
              myParams.set('descriptorType', workflow.descriptorType);
              this.dnastackURL = Dockstore.DNASTACK_IMPORT_URL + '?' + myParams;
            } else {
              this.dnastackErrorMessage = IMPORTS_NOT_SUPPORTED;
            }
          });
        } else {
          this.dnastackErrorMessage = NO_CONTENT_ERROR;
        }
      });
    }
  }


}
