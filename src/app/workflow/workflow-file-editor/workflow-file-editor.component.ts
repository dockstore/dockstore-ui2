/*
 *    Copyright 2019 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { WorkflowsService as OpenApiWorkflowServices } from 'app/shared/openapi';
import { Observable } from 'rxjs';
import { AlertService } from '../../shared/alert/state/alert.service';
import { FileEditing } from '../../shared/file-editing';

import { WorkflowQuery } from '../../shared/state/workflow.query';
import { WorkflowService } from '../../shared/state/workflow.service';
import { ToolDescriptor, Workflow } from '../../shared/swagger';
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
  @Input() id: number;
  @Input() set selectedVersion(value: WorkflowVersion) {
    this._selectedVersion = value;
    this.editing = false;
    this.isNewestVersion = this.checkIfNewestVersion();
    this.clearSourceFiles();
    if (value != null) {
      this.originalSourceFiles = JSON.parse(JSON.stringify(value.sourceFiles));
      this.loadVersionSourcefiles();
    }
  }
  constructor(
    private hostedService: HostedService,
    private workflowService: WorkflowService,
    private workflowsService: WorkflowsService,
    private openapiWorkflowsService: OpenApiWorkflowServices,
    protected alertService: AlertService,
    private workflowQuery: WorkflowQuery
  ) {
    super(alertService);
    this.selectedDescriptorType$ = this.workflowQuery.descriptorType$;
    this.isNFL$ = this.workflowQuery.isNFL$;
  }

  checkIfNewestVersion(): boolean {
    if (!this.versions || this.versions.length === 0) {
      return true;
    }
    const mostRecentId = this.getIdOfNewestVersion(this.versions);
    return this._selectedVersion.id === mostRecentId;
  }

  getIdOfNewestVersion(versions: Array<WorkflowVersion>): number {
    return versions.reduce((max, n) => Math.max(max, n.id), this.versions[0].id);
  }

  /**
   * Getting the newest workflowVersion based on the id
   */
  getNewestVersion(versions: Array<WorkflowVersion>): WorkflowVersion {
    return versions.reduce((p, c) => (p.id > c.id ? p : c));
  }

  /**
   * Splits up the sourcefiles for the version into descriptor files and test parameter files
   */
  loadVersionSourcefiles() {
    this.openapiWorkflowsService.getWorkflowVersionsSourcefiles(this.id, this._selectedVersion.id).subscribe(sourcefiles => {
      this.originalSourceFiles = sourcefiles;
      this.descriptorFiles = JSON.parse(JSON.stringify(this.getDescriptorFiles(this.originalSourceFiles)));
      this.testParameterFiles = JSON.parse(JSON.stringify(this.getTestFiles(this.originalSourceFiles)));
    });
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
    const combinedSourceFiles = this.getCombinedSourceFiles();
    const newSourceFiles = this.commonSaveVersion(this.originalSourceFiles, combinedSourceFiles);
    this.alertService.start('Updating hosted workflow');
    this.hostedService.editHostedWorkflow(this.id, newSourceFiles).subscribe(
      (editedWorkflow: Workflow) => {
        if (editedWorkflow) {
          // Only stop editing when version change was successful (not 204)
          this.toggleEdit();
          // TODO: Comment why workflow is explicitly gotten again when tool does not
          this.workflowsService.getWorkflow(editedWorkflow.id).subscribe(
            (newlyGottenWorkflow: Workflow) => {
              this.workflowService.setWorkflow(newlyGottenWorkflow);
              const updatedVersion = this.getNewestVersion(newlyGottenWorkflow.workflowVersions);
              this.alertService.detailedSuccess(
                'Saved version ' + updatedVersion.name + ' of hosted workflow ' + newlyGottenWorkflow.repository
              );
            },
            error => {
              this.alertService.detailedError(error);
            }
          );
        } else {
          // Probably encountered a 204
          this.handleNoContentResponse();
        }
      },
      (error: HttpErrorResponse) => {
        if (error.status === 413) {
          this.alertService.detailedError(error, 'Cannot save new version: versions have a 60 kilobyte limit');
        } else if (error) {
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
