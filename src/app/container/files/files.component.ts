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
import { Component, Input, OnChanges } from '@angular/core';

import { Files } from '../../shared/files';
import { GA4GHFilesService } from '../../shared/ga4gh-files/ga4gh-files.service';
import { SourceFile } from '../../shared/openapi';
import { Tag } from '../../shared/openapi/model/tag';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { NgIf } from '@angular/common';
import { ParamfilesComponent } from '../paramfiles/paramfiles.component';
import { DescriptorsComponent } from '../descriptors/descriptors.component';
import { DockerfileComponent } from '../dockerfile/dockerfile.component';
import { MatLegacyTabsModule } from '@angular/material/legacy-tabs';

@Component({
  selector: 'app-files-container',
  templateUrl: './files.component.html',
  standalone: true,
  imports: [MatLegacyTabsModule, DockerfileComponent, DescriptorsComponent, ParamfilesComponent, NgIf, MatLegacyCardModule, MatIconModule],
})
export class FilesContainerComponent extends Files implements OnChanges {
  @Input() selectedVersion: Tag;
  @Input() versionsFileTypes: Array<SourceFile.TypeEnum>;
  constructor(private gA4GHFilesService: GA4GHFilesService) {
    super();
  }

  ngOnChanges() {
    if (!this.selectedVersion) {
      this.gA4GHFilesService.clearFiles();
    } else {
      this.gA4GHFilesService.updateFiles(this.entrypath, this.selectedVersion.name);
    }
  }
}
