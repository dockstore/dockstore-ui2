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
import { ContainerService } from '../../shared/container.service';
import { FileService } from '../../shared/file.service';
import { PathService } from '../../shared/path.service';
import { EntryFileSelector } from '../../shared/selectors/entry-file-selector';
import { ContainersService } from '../../shared/swagger';
import { Tag } from '../../shared/swagger/model/tag';
import { ParamfilesService } from './paramfiles.service';

@Component({
  selector: 'app-paramfiles-container',
  templateUrl: './paramfiles.component.html'
})

export class ParamfilesComponent extends EntryFileSelector implements AfterViewChecked {

  @Input() id: number;
  @Input() entrypath: string;
  @Input() set selectedVersion(value: Tag) {
    this.clearContent();
    this.onVersionChange(value);
  }
  public filePath: string;
  public entryType = 'tool';
  public downloadFilePath: string;

  constructor(private containerService: ContainerService, private containersService: ContainersService,
              private highlightJsService: HighlightJsService,
              private paramfilesService: ParamfilesService,
              public fileService: FileService, private pathService: PathService,
              private elementRef: ElementRef) {
    super();
      this.published$ = this.containerService.toolIsPublished$;
  }
  getDescriptors(version): Array<any> {
    return this.paramfilesService.getDescriptors(this._selectedVersion);
  }

  getFiles(descriptor): Observable<any> {
    return this.paramfilesService.getFiles(this.id, 'containers', this._selectedVersion.name, this.currentDescriptor);
  }

  reactToFile(): void {
    this.content = this.currentFile.content;
    this.contentHighlighted = true;
    this.filePath = this.getFilePath(this.currentFile);
    let basePath: string;
    switch (this.currentDescriptor) {
      case 'wdl': {
        basePath = this._selectedVersion.wdl_path;
        break;
      }
      case 'cwl': {
        basePath = this._selectedVersion.cwl_path;
        break;
      }
      default: {
        console.log('Unrecognized descriptor type.  Could not get base path');
      }
    }
    const relativePath = this.pathService.relative(basePath, this.currentFile.path);
    this.currentFile.path = relativePath;
    this.downloadFilePath = this.fileService.getDescriptorPath(this.entrypath, this._selectedVersion,
      this.currentFile, this.currentDescriptor, this.entryType);
  }

  ngAfterViewChecked() {
    if (this.contentHighlighted && this.elementRef.nativeElement.querySelector('.highlight')) {
      this.contentHighlighted = false;
      this.highlightJsService.highlight(this.elementRef.nativeElement.querySelector('.highlight'));
    }
  }

  // Get the path of the file
  getFilePath(file): string {
    return this.fileService.getFilePath(file);
  }
}
