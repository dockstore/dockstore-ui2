import { Component, Input } from '@angular/core';
import { Files } from '../../shared/files';
import { WorkflowVersion } from './../../shared/swagger/model/workflowVersion';
import { HostedService } from './../../shared/swagger/api/hosted.service';
import { WorkflowService } from './../../shared/workflow.service';
import { RefreshService } from './../../shared/refresh.service';

@Component({
  selector: 'app-workflow-file-editor',
  templateUrl: './workflow-file-editor.component.html',
  styleUrls: ['./workflow-file-editor.component.scss']
})
export class WorkflowFileEditorComponent extends Files {
  descriptorFiles = [];
  testParameterFiles = [];
  originalSourceFiles = [];
  _selectedVersion: WorkflowVersion;
  @Input() descriptorType: string;
  @Input() publicPage: boolean;
  @Input() set selectedVersion(value: WorkflowVersion) {
    this._selectedVersion = value;
    if (value != null) {
      this.originalSourceFiles =  jQuery.extend(true, [], value.sourceFiles);
      this.loadVersionSourcefiles();
    }
  }
  constructor(private hostedService: HostedService, private workflowService: WorkflowService, private refreshService: RefreshService) {
    super();
  }

  /**
   * Toggles edit mode
   * @return
   */
  toggleEdit() {
    this.editing = !this.editing;
  }

  /**
   * Deletes the current version of the workflow
   * @return
   */
  deleteVersion() {
    const message = 'Delete Version';
    this.hostedService.deleteHostedWorkflowVersion(
        this.id * 1,
        this._selectedVersion.name).subscribe(result => {
          this.workflowService.setWorkflow(result);
          this.refreshService.handleSuccess(message);
        }, error =>  {
          if (error) {
              this.refreshService.handleError(message, error);
          }
        }
      );
  }

  /**
   * Splits up the sourcefiles for the version into descriptor files and test parameter files
   * @return void
   */
  loadVersionSourcefiles() {
    this.descriptorFiles = this.getDescriptorFiles(this._selectedVersion.sourceFiles);
    this.testParameterFiles = this.getTestFiles(this._selectedVersion.sourceFiles);
  }

  /**
   * Retrieves all descriptor files from the list of sourcefiles
   * @param  sourceFiles Array of sourcefiles
   * @return             Array of descriptor files
   */
  getDescriptorFiles(sourceFiles) {
    const descriptorFiles = [];
    for (const sourcefile of sourceFiles) {
      if (sourcefile.type === 'DOCKSTORE_WDL' || sourcefile.type === 'DOCKSTORE_CWL') {
        descriptorFiles.push(sourcefile);
      }
    }
    return descriptorFiles;
  }

  /**
   * Retrieves all test parameter files from the list of sourcefiles
   * @param  sourceFiles Array of sourcefiles
   * @return             Array of test parameter files
   */
  getTestFiles(sourceFiles) {
    const testParameterFiles = [];
    for (const sourcefile of sourceFiles) {
      if (sourcefile.type === 'WDL_TEST_JSON' || sourcefile.type === 'CWL_TEST_JSON') {
        testParameterFiles.push(sourcefile);
      }
    }
    return testParameterFiles;
  }

  /**
   * Combines sourcefiles into one array
   * @return Array of sourcefiles
   */
  getCombinedSourceFiles() {
    let baseFiles = [];
    if (this.descriptorFiles) {
      baseFiles = baseFiles.concat(this.descriptorFiles);
    }
    if (this.descriptorFiles) {
      baseFiles = baseFiles.concat(this.testParameterFiles);
    }
    return baseFiles;
  }

  /**
   * Creates a new version based on changes made
   * @return
   */
  saveVersion() {
    const message = 'Save Version';
    let newSourceFiles = this.getCombinedSourceFiles();
    const sourceFilesToDelete = [];

    // Deal with file renames
    for (const originalSourceFile of this.originalSourceFiles) {
      let toDelete = true;
      for (const newSourceFile of newSourceFiles) {
        if (newSourceFile.path === originalSourceFile.path) {
          toDelete = false;
          break;
        }
      }

      if (toDelete) {
        const sourceFileCopy = originalSourceFile;
        sourceFileCopy.content = null;
        sourceFilesToDelete.push(sourceFileCopy);
      }
    }

    if (sourceFilesToDelete.length > 0) {
      newSourceFiles = newSourceFiles.concat(sourceFilesToDelete);
    }

    this.hostedService.editHostedWorkflow(
        this.id,
        newSourceFiles).subscribe(result => {
          this.toggleEdit();
          this.workflowService.setWorkflow(result);
          this.refreshService.handleSuccess(message);
        }, error =>  {
          if (error) {
            this.refreshService.handleError(message, error);
          }
        }
      );
  }

  /**
   * Resets the files back to their original state
   * @return
   */
  resetFiles() {
    this.descriptorFiles = this.getDescriptorFiles(this.originalSourceFiles);
    this.testParameterFiles = this.getTestFiles(this.originalSourceFiles);
  }
}
