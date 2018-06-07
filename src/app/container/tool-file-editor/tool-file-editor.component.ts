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
    const newSourceFiles = this.commonSaveVersion();

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
