/*
 *    Copyright 2017 OICR
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

import { WorkflowDescriptorService } from './workflow-descriptor.service';
import { Component, Input, ElementRef, OnInit, AfterViewChecked } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HighlightJsService } from '../../shared/angular2-highlight-js/lib/highlight-js.module';

import { WorkflowService } from '../../shared/workflow.service';

import { EntryFileSelector } from '../../shared/selectors/entry-file-selector';

import { FileService } from '../../shared/file.service';
import { WorkflowVersion } from './../../shared/swagger/model/workflowVersion';
import { Ga4ghFilesStateService } from '../../shared/entry/ga4gh-files-state.service';
import { ToolFile, ToolDescriptor, GA4GHService } from '../../shared/swagger';

@Component({
  selector: 'app-descriptors-workflow',
  templateUrl: './descriptors.component.html',
  styleUrls: ['./descriptors.component.css']
})
export class DescriptorsWorkflowComponent extends EntryFileSelector implements AfterViewChecked {
  @Input() id: number;
  @Input() entrypath: string;
  @Input() set selectedVersion(value: WorkflowVersion) {
    this.onVersionChange(value);
  }

  content: string;
  contentHighlighted: boolean;
  public downloadFilePath: string;
  constructor(private highlightJsService: HighlightJsService, private ga4ghFilesStateService: Ga4ghFilesStateService,
              private workflowDescriptorService: WorkflowDescriptorService, private ga4ghService: GA4GHService,
              public fileService: FileService,
              private workflowService: WorkflowService,
              private elementRef: ElementRef) {
    super();
    this.published$ = this.workflowService.workflowIsPublished$;
  }
  getDescriptors(version): Array<any> {
    return this.workflowDescriptorService.getDescriptors(this._selectedVersion);
  }

  getFiles(descriptor): Observable<Array<ToolFile>> {
    return this.ga4ghFilesStateService.descriptorToolFiles$;
  }

  reactToFile(): void {

  }

  getFileContent(toolFile: ToolFile): void {
    this.currentFile = toolFile;
    const type = this.currentDescriptor;
    const id = this.entrypath;
    const versionId = this._selectedVersion.name;
    const relativePath = toolFile.path;
    // TODO: Use oneOf in OpenAPI 3.0 to avoid casting
    this.ga4ghService.toolsIdVersionsVersionIdTypeDescriptorRelativePathGet(type, '#workflow/' + id, versionId, relativePath)
      .subscribe((file: ToolDescriptor) => {
        if (file) {
          this.content = file.descriptor;
          this.contentHighlighted = true;
          this.downloadFilePath = this.fileService.getDescriptorPath(this.entrypath, this._selectedVersion, relativePath,
            this.currentDescriptor, 'workflow');
        }
      });
  }

  updateToolFiles(): void {
    this.ga4ghFilesStateService.update(this.currentDescriptor, '#workflow/' + this.entrypath, this._selectedVersion.name);
  }

  ngAfterViewChecked() {
    if (this.contentHighlighted  && this.elementRef.nativeElement.querySelector('.highlight')) {
      this.contentHighlighted = false;
      this.highlightJsService.highlight(this.elementRef.nativeElement.querySelector('.highlight'));
    }
  }

  // Get the path of the file
  getFilePath(file): string {
    return this.fileService.getFilePath(file);
  }
}
