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

import {Component, Input, OnInit, ElementRef, AfterViewChecked} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ParamfilesService } from '../../container/paramfiles/paramfiles.service';
import { HighlightJsService } from '../../shared/angular2-highlight-js/lib/highlight-js.module';
import { FileSelector } from '../../shared/selectors/file-selector';
import { FileService } from '../../shared/file.service';
import { WorkflowService } from '../../shared/workflow.service';
import { Dockstore } from '../../shared/dockstore.model';

@Component({
  selector: 'app-paramfiles-workflow',
  templateUrl: './paramfiles.component.html',
  styleUrls: ['./paramfiles.component.css']
})
export class ParamfilesWorkflowComponent extends FileSelector implements AfterViewChecked {
  @Input() id: number;
  @Input() entrypath: string;
  content: string;

  contentHighlighted: boolean;

  constructor(private paramfilesService: ParamfilesService,
              private highlightJsService: HighlightJsService,
              public fileService: FileService,
              private elementRef: ElementRef,
              private workflowService: WorkflowService) {
    super();
  }
  getDescriptors(version): Array<any> {
    return this.paramfilesService.getDescriptors(this.currentVersion);
  }

  getFiles(descriptor): Observable<any> {
    return this.paramfilesService.getFiles(this.id, 'workflows', this.currentVersion.name, this.currentDescriptor);
  }

  reactToFile(): void {
    this.content = this.currentFile.content;
    this.contentHighlighted = true;
  }

  ngAfterViewChecked() {
    if (this.contentHighlighted && this.elementRef.nativeElement.querySelector('.highlight')) {
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

  // Downloads a file
  downloadFile(file, id): void {
    this.fileService.downloadFile(file, id);
  }

  // Get the path of the file
  getFilePath(file): string {
    return this.fileService.getFilePath(file);
  }
}
