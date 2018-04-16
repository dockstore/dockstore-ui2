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
import { Dockstore } from '../../shared/dockstore.model';
import { FileService } from '../../shared/file.service';
import { StateService } from '../../shared/state.service';
import { ContainersService } from '../../shared/swagger';
import { Tag } from '../../shared/swagger/model/tag';
import { ga4ghPath } from './../../shared/constants';

@Component({
  selector: 'app-dockerfile',
  templateUrl: './dockerfile.component.html',
})
export class DockerfileComponent implements AfterViewChecked {

  @Input() id: number;
  @Input() entrypath: string;
  _selectedVersion: Tag;
  @Input() set selectedVersion(value: Tag) {
    this._selectedVersion = value;
    this.reactToVersion();
  }
  content: string;
  filepath: string;
  nullContent: boolean;
  contentHighlighted: boolean;
  public publicPage$: Observable<boolean>;
  public containerFilePath: string;
  constructor(private highlightJsService: HighlightJsService,
              public fileService: FileService,
              private elementRef: ElementRef, private stateService: StateService,
              private containerService: ContainerService, private containersService: ContainersService) {
    this.nullContent = false;
    this.filepath = '/Dockerfile';
    this.publicPage$ = this.stateService.publicPage$;
  }

  reactToVersion(): void {
    if (this._selectedVersion) {
      this.nullContent = false;
      this.containersService.dockerfile(this.id, this._selectedVersion.name)
        .subscribe(file => {
            this.content = file.content;
            this.contentHighlighted = true;
            this.filepath = file.path;
            this.containerFilePath = this.getContainerfilePath();
          }
        );
    } else {
      this.nullContent = true;
      this.content = null;
    }
  }
  ngAfterViewChecked() {
    if (this.contentHighlighted && !this.nullContent && this.elementRef.nativeElement.querySelector('.highlight')) {
      this.contentHighlighted = false;
      this.highlightJsService.highlight(this.elementRef.nativeElement.querySelector('.highlight'));
    }
  }

  private getContainerfilePath(): string {
    const basepath = Dockstore.API_URI + ga4ghPath + '/tools/';
    const customPath = encodeURIComponent(this.entrypath) + '/versions/' + this._selectedVersion.name + '/containerfile';
    return basepath + customPath;
  }

}
