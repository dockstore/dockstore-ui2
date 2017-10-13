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

import { ContainersService } from '../../shared/swagger';
import { Component, Input, ElementRef, OnInit, AfterViewChecked} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HighlightJsService } from '../../shared/angular2-highlight-js/lib/highlight-js.module';

import { ContainerService } from '../../shared/container.service';
import { ParamfilesService } from './paramfiles.service';

import { FileSelector } from '../../shared/selectors/file-selector';
import { FileService } from '../../shared/file.service';

@Component({
  selector: 'app-paramfiles-container',
  templateUrl: './paramfiles.component.html'
})

export class ParamfilesComponent extends FileSelector implements AfterViewChecked {

  @Input() id: number;
  content: string;
  contentHighlighted: boolean;

  constructor(private containerService: ContainerService, private containersService: ContainersService,
              private highlightJsService: HighlightJsService,
              private paramfilesService: ParamfilesService,
              public fileService: FileService,
              private elementRef: ElementRef) {
    super();
  }
  getDescriptors(version): Array<any> {
    return this.paramfilesService.getDescriptors(this.currentVersion);
  }

  getFiles(descriptor): Observable<any> {
    return this.paramfilesService.getFiles(this.id, 'containers', this.currentVersion.name, this.currentDescriptor);
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
    this.containerService.copyBtn$.subscribe(
      copyBtn => {
        this.toolCopyBtn = copyBtn;
      });
  }
  toolCopyBtnClick(copyBtn): void {
    this.containerService.setCopyBtn(copyBtn);
  }
}
