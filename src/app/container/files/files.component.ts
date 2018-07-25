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
import { Component, Input, OnChanges, OnInit } from '@angular/core';

import { GA4GHFilesStateService } from '../../shared/entry/GA4GHFiles.state.service';
import { Files } from '../../shared/files';
import { Tag } from '../../shared/swagger/model/tag';
import { ParamfilesService } from '../paramfiles/paramfiles.service';

@Component({
  selector: 'app-files-container',
  templateUrl: './files.component.html'
})
export class FilesContainerComponent extends Files implements OnInit, OnChanges {
  @Input() selectedVersion: Tag;
  versionsWithParamfiles: Array<any>;
  constructor(private paramfilesService: ParamfilesService, private gA4GHFilesStateService: GA4GHFilesStateService) {
    super();
  }

  ngOnInit() {
    this.versionsWithParamfiles = this.paramfilesService.getVersions(this.versions);
  }
  ngOnChanges() {
    this.gA4GHFilesStateService.update(this.entrypath, this.selectedVersion.name);
    this.versionsWithParamfiles = this.paramfilesService.getVersions(this.versions);
  }

}
