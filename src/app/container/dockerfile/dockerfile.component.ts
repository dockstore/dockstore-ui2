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
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ContainerService } from '../../shared/container.service';
import { Dockstore } from '../../shared/dockstore.model';
import { FileService } from '../../shared/file.service';
import { ContainersService, DockstoreTool } from '../../shared/swagger';
import { Tag } from '../../shared/swagger/model/tag';
import { ga4ghPath } from './../../shared/constants';

@Component({
  selector: 'app-dockerfile',
  templateUrl: './dockerfile.component.html',
})
export class DockerfileComponent {

  @Input() id: number;
  @Input() entrypath: string;
  _selectedVersion: Tag;
  @Input() set selectedVersion(value: Tag) {
    this._selectedVersion = value;
    this.reactToVersion();
  }
  content: string;
  filePath: string;
  nullContent: boolean;
  public published$: Observable<boolean>;
  public downloadFilePath: string;
  constructor(public fileService: FileService,
              private containerService: ContainerService, private containersService: ContainersService) {
    this.nullContent = false;
    this.filePath = '/Dockerfile';
    this.published$ = this.containerService.toolIsPublished$;
  }

  reactToVersion(): void {
    if (this._selectedVersion) {
      this.nullContent = false;
      this.containersService.dockerfile(this.id, this._selectedVersion.name).pipe(first())
        .subscribe(file => {
            this.content = file.content;
            this.filePath = file.path;
            this.downloadFilePath = this.getContainerfilePath();
          }, error => {
            this.nullContent = true;
            this.content = null;
          }
        );
    } else {
      this.nullContent = true;
      this.content = null;
    }
  }

  private getContainerfilePath(): string {
    const basepath = Dockstore.API_URI + ga4ghPath + '/tools/';
    const customPath = encodeURIComponent(this.entrypath) + '/versions/' + encodeURIComponent(this._selectedVersion.name)
       + '/containerfile';
    return basepath + customPath;
  }

  downloadFile(id: string): void {
    this.fileService.downloadFile(this.content, this.filePath, id);
  }

}
