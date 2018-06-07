import { Component, Input } from '@angular/core';
import { Files } from '../../shared/files';
import { Tag } from './../../shared/swagger/model/tag';
import { HostedService } from './../../shared/swagger/api/hosted.service';
import { ContainerService } from './../../shared/container.service';
import { RefreshService } from './../../shared/refresh.service';

@Component({
  selector: 'app-tool-file-editor',
  templateUrl: './tool-file-editor.component.html',
  styleUrls: ['./tool-file-editor.component.scss']
})
export class ToolFileEditorComponent extends Files {
  dockerFile = [];
  descriptorFiles = [];
  testParameterFiles = [];
  originalSourceFiles = [];
  _selectedVersion: Tag;
  selectedDescriptorType = 'cwl';
  @Input() publicPage: boolean;
  @Input() set selectedVersion(value: Tag) {
      this._selectedVersion = value;
      if (value != null) {
        this.originalSourceFiles =  jQuery.extend(true, [], value.sourceFiles);
        this.loadVersionSourcefiles();
      }
    }
    constructor(private hostedService: HostedService, private containerService: ContainerService, private refreshService: RefreshService) {
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
   * Deletes the current version of the tool
   */
  deleteVersion() {
    const message = 'Delete Version';
    this.hostedService.deleteHostedToolVersion(
        this.id * 1, // Converts to a number
        this._selectedVersion.name).subscribe(result => {
          this.containerService.setTool(result);
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
   */
  loadVersionSourcefiles() {
    this.descriptorFiles = this.getDescriptorFiles(this._selectedVersion.sourceFiles);
    this.testParameterFiles = this.getTestFiles(this._selectedVersion.sourceFiles);
    this.dockerFile = this.getDockerFile(this._selectedVersion.sourceFiles);
  }

  /**
   * Retrieves all dockerfiles from the list of sourcefiles
   * @param  sourceFiles Array of sourcefiles
   * @return {Array<SourceFile>}      Array of test parameter files
   */
  getDockerFile(sourceFiles) {
    return sourceFiles.filter(
      sourcefile => sourcefile.type === 'DOCKERFILE');
  }

  /**
   * Retrieves all descriptor files from the list of sourcefiles
   * @param  sourceFiles Array of sourcefiles
   * @return  {Array<SourceFile>}     Array of descriptor files
   */
  getDescriptorFiles(sourceFiles) {
    return sourceFiles.filter(
      sourcefile => sourcefile.type === 'DOCKSTORE_WDL' || sourcefile.type === 'DOCKSTORE_CWL');
  }

  /**
   * Retrieves all test parameter files from the list of sourcefiles
   * @param  sourceFiles Array of sourcefiles
   * @return {Array<SourceFile>}      Array of test parameter files
   */
  getTestFiles(sourceFiles) {
    return sourceFiles.filter(
      sourcefile => sourcefile.type === 'WDL_TEST_JSON' || sourcefile.type === 'CWL_TEST_JSON');
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
    if (this.dockerFile) {
      baseFiles = baseFiles.concat(this.dockerFile);
    }
    return baseFiles;
  }

  /**
   * Creates a new version based on changes made
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
        console.log('deleting ' + originalSourceFile.path);
        const sourceFileCopy = originalSourceFile;
        sourceFileCopy.content = null;
        sourceFilesToDelete.push(sourceFileCopy);
      } else {
        console.log('NOT deleting ' + originalSourceFile.path);
      }
    }

    if (sourceFilesToDelete.length > 0) {
      newSourceFiles = newSourceFiles.concat(sourceFilesToDelete);
    }

    this.hostedService.editHostedTool(
        this.id,
        newSourceFiles).subscribe(result => {
          this.toggleEdit();
          this.containerService.setTool(result);
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
   */
  resetFiles() {
    this.descriptorFiles = this.getDescriptorFiles(this.originalSourceFiles);
    this.testParameterFiles = this.getTestFiles(this.originalSourceFiles);
    this.dockerFile = this.getDockerFile(this.originalSourceFiles);
  }


}
