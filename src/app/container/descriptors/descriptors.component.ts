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

import { Component, Input, ElementRef, OnInit, AfterViewChecked} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HighlightJsService } from '../../shared/angular2-highlight-js/lib/highlight-js.module';

import { ContainerService } from '../../shared/container.service';
import { ToolDescriptorService } from './tool-descriptor.service';

import { FileSelector } from '../../shared/selectors/file-selector';
import { FileService } from '../../shared/file.service';

@Component({
  selector: 'app-descriptors-container',
  templateUrl: './descriptors.component.html',
  providers: [ToolDescriptorService]
})

export class DescriptorsComponent extends FileSelector implements AfterViewChecked {

  @Input() id: number;
  @Input() entrypath: string;
  version: any;
  @Input() set selectedTag(value: any) {
    if (value != null) {
      this.version = value;
      this.reactToVersion();
    }
  }
  content: string;
  contentHighlighted: boolean;
  constructor(private containerService: ContainerService,
              private highlightJsService: HighlightJsService,
              private descriptorsService: ToolDescriptorService,
              public fileService: FileService,
              private elementRef: ElementRef
  ) {
    super();
  }

  getDescriptors(version): Array<any> {
    return this.descriptorsService.getDescriptors(this.versions, this.version);
  }

  getFiles(descriptor): Observable<any> {
    return this.descriptorsService.getFiles(this.id, this.version.name, this.currentDescriptor);
  }

  reactToFile(): void {
    this.content = this.currentFile.content;
    this.contentHighlighted = true;
  }

  ngAfterViewChecked() {
    if (this.contentHighlighted && !this.nullDescriptors) {
      this.contentHighlighted = false;
      this.highlightJsService.highlight(this.elementRef.nativeElement.querySelector('.highlight'));
    }
  }
  copyBtnSubscript(): void {
    this.containerService.copyBtn$.subscribe(
      copyBtn => {
        this.toolCopyBtn = copyBtn;
      });
  }
  toolCopyBtnClick(copyBtn): void {
    this.containerService.setCopyBtn(copyBtn);
  }

  getDescriptorPath(descType): string {
    return this.fileService.getDescriptorPath(this.entrypath, this.version, this.currentFile, this.currentDescriptor, 'tool');
  }

  // Get the path of the file
  getFilePath(file): string {
    return this.fileService.getFilePath(file);
  }

}
