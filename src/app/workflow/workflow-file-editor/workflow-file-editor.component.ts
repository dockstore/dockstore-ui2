import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { AlertService } from '../../shared/alert/state/alert.service';
import { FileEditing } from '../../shared/file-editing';
import { WorkflowQuery } from '../../shared/state/workflow.query';
import { WorkflowService } from '../../shared/state/workflow.service';
import { ToolDescriptor, Workflow } from '../../shared/swagger';
import { RefreshService } from './../../shared/refresh.service';
import { HostedService } from './../../shared/swagger/api/hosted.service';
import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { WorkflowVersion } from './../../shared/swagger/model/workflowVersion';

@Component({
  selector: 'app-workflow-file-editor',
  templateUrl: './workflow-file-editor.component.html',
  styleUrls: ['./workflow-file-editor.component.scss']
})
export class WorkflowFileEditorComponent extends FileEditing {
  descriptorFiles = [];
  testParameterFiles = [];
  originalSourceFiles = [];
  _selectedVersion: WorkflowVersion;
  isNewestVersion = false;
  public selectedDescriptorType$: Observable<ToolDescriptor.TypeEnum>;
  public isNFL$: Observable<boolean>;
  @Input() entrypath: string;
  @Input() set selectedVersion(value: WorkflowVersion) {
    this._selectedVersion = value;
    this.editing = false;
    this.isNewestVersion = this.checkIfNewestVersion();
    this.clearSourceFiles();
    if (value != null) {
      this.originalSourceFiles =  JSON.parse(JSON.stringify(value.sourceFiles));
      this.loadVersionSourcefiles();
    }
  }
  constructor(private hostedService: HostedService, private workflowService: WorkflowService, private refreshService: RefreshService,
    private workflowsService: WorkflowsService, private alertService: AlertService, private workflowQuery: WorkflowQuery) {
    super();
    this.selectedDescriptorType$ = this.workflowQuery.descriptorType$;
    this.isNFL$ = this.workflowQuery.isNFL$;
  }

  checkIfNewestVersion(): boolean {
    if (!this.versions || this.versions.length === 0) {
      return true;
    }
    const mostRecentId = this.versions.reduce((max, n) => Math.max(max, n.id), this.versions[0].id);
    return this._selectedVersion.id === mostRecentId;
  }

  /**
   * Splits up the sourcefiles for the version into descriptor files and test parameter files
   */
  loadVersionSourcefiles() {
    this.descriptorFiles = JSON.parse(JSON.stringify(this.getDescriptorFiles(this._selectedVersion.sourceFiles)));
    this.testParameterFiles = JSON.parse(JSON.stringify(this.getTestFiles(this._selectedVersion.sourceFiles)));
  }

  /**
   * Combines sourcefiles into one array
   * @return {Array<SourceFile>} Array of sourcefiles
   */
  getCombinedSourceFiles() {
    let baseFiles = [];
    if (this.descriptorFiles) {
      baseFiles = baseFiles.concat(this.descriptorFiles);
    }
    if (this.testParameterFiles) {
      baseFiles = baseFiles.concat(this.testParameterFiles);
    }
    return baseFiles;
  }

  /**
   * Creates a new version based on changes made
   */
  saveVersion() {
    const message = 'Save Version';
    const combinedSourceFiles = this.getCombinedSourceFiles();
    const newSourceFiles = this.commonSaveVersion(this.originalSourceFiles, combinedSourceFiles);
    this.alertService.start('Updating hosted workflow');
    this.hostedService.editHostedWorkflow(
        this.id,
        newSourceFiles).subscribe((workflow: Workflow) => {
          this.toggleEdit();
          this.workflowsService.getWorkflow(workflow.id).subscribe((workflow2: Workflow) => {
            this.alertService.detailedSuccess();
            this.workflowService.setWorkflow(workflow2);
          });
        }, error =>  {
          if (error) {
            this.alertService.detailedError(error);
          }
        }
      );
  }

  /**
   * Resets the files back to their original state
   */
  resetFiles() {
    this.descriptorFiles = this.getDescriptorFiles(this.originalSourceFiles);
    this.testParameterFiles = this.getTestFiles(this.originalSourceFiles);
  }

  /**
   * Clear the sourcefiles stored
   */
  clearSourceFiles() {
    this.descriptorFiles = [];
    this.testParameterFiles = [];
    this.originalSourceFiles = [];
  }

}
