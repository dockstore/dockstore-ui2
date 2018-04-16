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
import { AfterViewChecked, Component, ElementRef, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HighlightJsService } from '../../shared/angular2-highlight-js/lib/highlight-js.module';
import { FileService } from '../../shared/file.service';
import { EntryFileSelector } from '../../shared/selectors/entry-file-selector';
import { Workflow } from '../../shared/swagger';
import { WorkflowService } from '../../shared/workflow.service';
import { WorkflowVersion } from './../../shared/swagger/model/workflowVersion';
import { WorkflowDescriptorService } from './workflow-descriptor.service';

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
  public descriptorPath: string;
  public filePath: string;
  constructor(private highlightJsService: HighlightJsService,
              private workflowDescriptorService: WorkflowDescriptorService,
              public fileService: FileService,
              private workflowService: WorkflowService,
              private elementRef: ElementRef) {
    super();
    this.published$ = this.workflowService.workflowIsPublished$;
  }
  getDescriptors(version): Array<any> {
    return this.workflowDescriptorService.getDescriptors(this._selectedVersion);
  }

  getFiles(descriptor): Observable<any> {
    return this.workflowDescriptorService.getFiles(this.id, this._selectedVersion.name, this.currentDescriptor);
  }

  reactToFile(): void {
    this.content = this.currentFile.content;
    this.contentHighlighted = true;
    this.descriptorPath = this.getDescriptorPath(this.currentDescriptor);
    this.filePath = this.getFilePath(this.currentFile);
  }
  ngAfterViewChecked() {
    if (this.contentHighlighted) {
      this.contentHighlighted = false;
      this.highlightJsService.highlight(this.elementRef.nativeElement.querySelector('.highlight'));
    }
  }

  private getDescriptorPath(entrytype): string {
    return this.fileService.getDescriptorPath(this.entrypath, this._selectedVersion, this.currentFile, this.currentDescriptor, 'workflow');
  }

  // Get the path of the file
  private getFilePath(file): string {
    return this.fileService.getFilePath(file);
  }
}
