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
import { Dockstore } from '../../shared/dockstore.model';
import { HighlightJsService } from '../../shared/angular2-highlight-js/lib/highlight-js.module';

import { WorkflowService } from '../../shared/workflow.service';

import { FileSelector } from '../../shared/selectors/file-selector';
import { FileService } from '../../shared/file.service';

@Component({
  selector: 'app-descriptors-workflow',
  templateUrl: './descriptors.component.html',
  styleUrls: ['./descriptors.component.css']
})
export class DescriptorsWorkflowComponent extends FileSelector implements AfterViewChecked, OnInit {
  @Input() id: number;
  @Input() toolpath: string;

  content: string;
  contentHighlighted: boolean;
  constructor(private highlightJsService: HighlightJsService,
              private workflowDescriptorService: WorkflowDescriptorService,
              public fileService: FileService,
              private workflowService: WorkflowService,
              private elementRef: ElementRef) {
    super();
  }
  getDescriptors(version): Array<any> {
    return this.workflowDescriptorService.getDescriptors(this.versions, this.currentVersion);
  }

  getFiles(descriptor): Observable<any> {
    return this.workflowDescriptorService.getFiles(this.id, this.currentVersion.name, this.currentDescriptor);
  }

  reactToFile(): void {
    this.content = this.currentFile.content;
    this.contentHighlighted = true;
  }
  ngAfterViewChecked() {
    if (this.contentHighlighted) {
      this.contentHighlighted = false;
      this.highlightJsService.highlight(this.elementRef.nativeElement.querySelector('.highlight'));
    }
  }
  copyBtnSubscript(): void {
    this.workflowService.copyBtn$.subscribe(
      copyBtn => {
        this.workflowCopyBtn = copyBtn;
      });
  }
  workflowCopyBtnClick(copyBtn): void {
    this.workflowService.setCopyBtn(copyBtn);
  }

  getDescriptorPath(descType) : string {
    if (this.currentFile != null) {
      const basepath = Dockstore.API_URI + '/api/ga4gh/v1/tools/';
      let descriptor = 'plain-CWL';
      if (descType === 'wdl') {
        descriptor = 'plain-WDL';
      }
      
      let customPath =  encodeURIComponent('#workflow/' + this.toolpath) + '/versions/' + this.currentVersion.name + '/' + descriptor + '/descriptor/' + encodeURIComponent(this.currentFile.path);
      return basepath + customPath;
    } else {
      return null;
    }
  }
}
