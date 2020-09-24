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
import { SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { finalize, first } from 'rxjs/operators';

import { ga4ghPath } from '../../shared/constants';
import { Dockstore } from '../../shared/dockstore.model';
import { FileService } from '../../shared/file.service';
import { ContainersService } from '../../shared/swagger';
import { Tag } from '../../shared/swagger/model/tag';
import { ToolQuery } from '../../shared/tool/tool.query';

@Component({
  selector: 'app-dockerfile',
  templateUrl: './dockerfile.component.html',
  styleUrls: ['./dockerfile.component.scss'],
})
export class DockerfileComponent {
  @Input() id: number;
  @Input() entrypath: string;
  @Input() publicPage: boolean;

  _selectedVersion: Tag;
  @Input() set selectedVersion(value: Tag) {
    this._selectedVersion = value;
    this.reactToVersion();
  }
  content: string;
  filePath: string;
  public published$: Observable<boolean>;
  public downloadFilePath: string;
  public customDownloadHREF: SafeUrl;
  public customDownloadPath: string;
  public loading = true;
  constructor(public fileService: FileService, private toolQuery: ToolQuery, private containersService: ContainersService) {
    this.filePath = '/Dockerfile';
    this.published$ = this.toolQuery.toolIsPublished$;
  }

  reactToVersion(): void {
    if (this._selectedVersion) {
      this.loading = true;
      this.containersService
        .dockerfile(this.id, this._selectedVersion.name)
        .pipe(
          first(),
          finalize(() => (this.loading = false))
        )
        .subscribe(
          (file) => {
            this.content = file.content;
            this.filePath = file.path;
            this.downloadFilePath = this.getContainerfilePath();
            this.customDownloadFile();
          },
          (error) => {
            this.content = null;
          }
        );
    } else {
      this.content = null;
      this.loading = false;
    }
  }

  private getContainerfilePath(): string {
    const basepath = Dockstore.API_URI + ga4ghPath + '/tools/';
    const customPath =
      encodeURIComponent(this.entrypath) + '/versions/' + encodeURIComponent(this._selectedVersion.name) + '/containerfile';
    return basepath + customPath;
  }

  customDownloadFile(): void {
    this.customDownloadHREF = this.fileService.getFileData(this.content);
    this.customDownloadPath = this.fileService.getFileName(this.filePath);
  }
}
