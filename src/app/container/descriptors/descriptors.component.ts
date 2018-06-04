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

import { EntryFileSelector } from '../../shared/selectors/entry-file-selector';

import { FileService } from '../../shared/file.service';
import { Tag } from '../../shared/swagger/model/tag';
import { Ga4ghFilesStateService } from '../../shared/entry/ga4gh-files-state.service';
import { ToolFile, GA4GHService, ToolDescriptor } from '../../shared/swagger';

@Component({
  selector: 'app-descriptors-container',
  templateUrl: './descriptors.component.html',
  providers: [ToolDescriptorService]
})

export class DescriptorsComponent extends EntryFileSelector implements AfterViewChecked {

  @Input() id: number;
  @Input() entrypath: string;
  @Input() set selectedVersion(value: Tag) {
    this.clearContent();
    this.onVersionChange(value);
  }

  public downloadFilePath: string;
  constructor(private containerService: ContainerService, private ga4ghFilesStateService: Ga4ghFilesStateService,
              private highlightJsService: HighlightJsService, private ga4ghService: GA4GHService,
              private descriptorsService: ToolDescriptorService,
              public fileService: FileService,
              private elementRef: ElementRef) {
    super();
    this.published$ = this.containerService.toolIsPublished$;
  }

  getDescriptors(version): Array<any> {
    return this.descriptorsService.getDescriptors(this._selectedVersion);
  }

  getFiles(descriptor): Observable<Array<ToolFile>> {
    return this.ga4ghFilesStateService.descriptorToolFiles$;
  }

  updateToolFiles(): void {
    this.ga4ghFilesStateService.update(this.currentDescriptor, this.entrypath, this._selectedVersion.name);
  }

  reactToFile(): void {
    this.contentHighlighted = true;
  }

  getFileContent(toolFile: ToolFile): void {
    this.currentFile = toolFile;
    const type = this.currentDescriptor;
    const id = this.entrypath;
    const versionId = this._selectedVersion.name;
    const relativePath = toolFile.path;
    // TODO: Use oneOf in OpenAPI 3.0 to avoid casting
    this.ga4ghService.toolsIdVersionsVersionIdTypeDescriptorRelativePathGet(type, id, versionId, relativePath)
      .subscribe((file: ToolDescriptor) => {
        if (file) {
          this.content = file.descriptor;
          this.contentHighlighted = true;
          this.downloadFilePath = this.fileService.getDescriptorPath(this.entrypath, this._selectedVersion, relativePath,
            this.currentDescriptor, 'tool');
        }
      });
  }

  ngAfterViewChecked() {
    if (this.contentHighlighted && !this.nullDescriptors  && this.elementRef.nativeElement.querySelector('.highlight')) {
      this.contentHighlighted = false;
      this.highlightJsService.highlight(this.elementRef.nativeElement.querySelector('.highlight'));
    }
  }

  // Get the path of the file
  getFilePath(file): string {
    return this.fileService.getFilePath(file);
  }

}
