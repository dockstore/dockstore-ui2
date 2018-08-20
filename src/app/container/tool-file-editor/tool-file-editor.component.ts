import { Component, Input } from '@angular/core';
import { FileEditing } from '../../shared/file-editing';
import { Tag } from './../../shared/swagger/model/tag';
import { HostedService } from './../../shared/swagger/api/hosted.service';
import { ContainerService } from './../../shared/container.service';
import { RefreshService } from './../../shared/refresh.service';
import { SourceFile } from './../../shared/swagger/model/sourceFile';

@Component({
  selector: 'app-tool-file-editor',
  templateUrl: './tool-file-editor.component.html',
  styleUrls: ['./tool-file-editor.component.scss']
})
export class ToolFileEditorComponent extends FileEditing {
  dockerFile = [];
  descriptorFiles = [];
  testParameterFiles = [];
  originalSourceFiles = [];
  currentVersion: Tag;
  selectedDescriptorType = 'cwl';
  @Input() set selectedVersion(value: Tag) {
      this.currentVersion = value;
      this.clearSourceFiles();
      if (value != null) {
        this.originalSourceFiles =  $.extend(true, [], value.sourceFiles);
        this.loadVersionSourcefiles();
      }
  }

  constructor(private hostedService: HostedService, private containerService: ContainerService, private refreshService: RefreshService) {
    super();
  }

  /**
   * Splits up the sourcefiles for the version into descriptor files and test parameter files
   */
  loadVersionSourcefiles(): void {
    this.descriptorFiles = this.getDescriptorFiles(this.currentVersion.sourceFiles);
    this.testParameterFiles = this.getTestFiles(this.currentVersion.sourceFiles);
    this.dockerFile = this.getDockerFile(this.currentVersion.sourceFiles);
  }

  /**
   * Combines sourcefiles into one array
   * @return {Array<SourceFile>} Array of sourcefiles
   */
  getCombinedSourceFiles(): Array<SourceFile> {
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
  saveVersion(): void {
    const message = 'Save Version';
    const combinedSourceFiles = this.getCombinedSourceFiles();
    const newSourceFiles = this.commonSaveVersion(this.originalSourceFiles, combinedSourceFiles);

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
  resetFiles(): void {
    this.descriptorFiles = this.getDescriptorFiles(this.originalSourceFiles);
    this.testParameterFiles = this.getTestFiles(this.originalSourceFiles);
    this.dockerFile = this.getDockerFile(this.originalSourceFiles);
  }

  /**
   * Clear the sourcefiles stored
   */
  clearSourceFiles() {
    this.dockerFile = [];
    this.descriptorFiles = [];
    this.testParameterFiles = [];
    this.originalSourceFiles = [];
  }


}
