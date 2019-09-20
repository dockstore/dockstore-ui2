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
import { Component, Input } from '@angular/core';
import { AlertService } from '../../shared/alert/state/alert.service';
import { FileEditing } from '../../shared/file-editing';
import { DockstoreTool, ToolDescriptor } from '../../shared/swagger';
import { ContainerService } from './../../shared/container.service';
import { HostedService } from './../../shared/swagger/api/hosted.service';
import { SourceFile } from './../../shared/swagger/model/sourceFile';
import { Tag } from './../../shared/swagger/model/tag';

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
  selectedDescriptorType: ToolDescriptor.TypeEnum = ToolDescriptor.TypeEnum.CWL;
  isNewestVersion = false;
  ToolDescriptor = ToolDescriptor;
  @Input() entrypath: string;
  @Input() set selectedVersion(value: Tag) {
    this.currentVersion = value;
    this.isNewestVersion = this.checkIfNewestVersion();
    this.editing = false;
    this.clearSourceFiles();
    if (value != null) {
      // Fix the JSON.parse later.  Currently used to deep copy values but not keep the read-only attribute of state management.
      this.originalSourceFiles = JSON.parse(JSON.stringify(value.sourceFiles));
      this.loadVersionSourcefiles();
    }
  }

  constructor(private hostedService: HostedService, private containerService: ContainerService, protected alertService: AlertService) {
    super(alertService);
  }

  checkIfNewestVersion(): boolean {
    if (!this.versions || this.versions.length === 0) {
      return true;
    }
    const mostRecentId = this.versions.reduce((max, n) => Math.max(max, n.id), this.versions[0].id);
    return this.currentVersion.id === mostRecentId;
  }

  /**
   * Fix the JSON.parse later.  Currently used to deep copy values but not keep the read-only attribute of state management.
   * Splits up the sourcefiles for the version into descriptor files and test parameter files
   */
  loadVersionSourcefiles(): void {
    this.descriptorFiles = JSON.parse(JSON.stringify(this.getDescriptorFiles(this.currentVersion.sourceFiles)));
    this.testParameterFiles = JSON.parse(JSON.stringify(this.getTestFiles(this.currentVersion.sourceFiles)));
    this.dockerFile = JSON.parse(JSON.stringify(this.getDockerFile(this.currentVersion.sourceFiles)));
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
    const combinedSourceFiles = this.getCombinedSourceFiles();
    const newSourceFiles = this.commonSaveVersion(this.originalSourceFiles, combinedSourceFiles);
    this.alertService.start('Updating hosted tool');
    this.hostedService.editHostedTool(this.id, newSourceFiles).subscribe(
      (editedDockstoreTool: DockstoreTool) => {
        if (editedDockstoreTool) {
          // Only stop editing when version change was successful (not 204)
          this.toggleEdit();
          this.containerService.setTool(editedDockstoreTool);
          this.alertService.detailedSuccess();
        } else {
          // Probably encountered a 204
          this.handleNoContentResponse();
        }
      },
      error => {
        if (error) {
          this.alertService.detailedError(error);
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
