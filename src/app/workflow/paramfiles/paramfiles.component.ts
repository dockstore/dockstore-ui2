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

import {Component, Input, OnInit, ElementRef} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ParamfilesService } from '../../container/paramfiles/paramfiles.service';
import { EntryFileSelector } from '../../shared/selectors/entry-file-selector';

import { FileService } from '../../shared/file.service';
import { WorkflowService } from '../../shared/workflow.service';
import { WorkflowVersion } from './../../shared/swagger/model/workflowVersion';

@Component({
  selector: 'app-paramfiles-workflow',
  templateUrl: './paramfiles.component.html',
  styleUrls: ['./paramfiles.component.css']
})
export class ParamfilesWorkflowComponent extends EntryFileSelector {
  @Input() id: number;
  @Input() entrypath: string;
  @Input() set selectedVersion(value: WorkflowVersion) {
    this.clearContent();
    this.onVersionChange(value);
  }

  constructor(private paramfilesService: ParamfilesService,
              public fileService: FileService,
              private elementRef: ElementRef,
              private workflowService: WorkflowService) {
    super();
  }
  getDescriptors(version): Array<any> {
    return this.paramfilesService.getDescriptors(this._selectedVersion);
  }

  getFiles(descriptor): Observable<any> {
    return this.paramfilesService.getFiles(this.id, 'workflows', this._selectedVersion.name, this.currentDescriptor);
  }

  reactToFile(): void {
    this.content = this.currentFile.content;
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
