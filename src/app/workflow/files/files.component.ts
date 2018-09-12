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

import { ParamfilesService } from '../../container/paramfiles/paramfiles.service';
import { ga4ghWorkflowIdPrefix } from '../../shared/constants';
import { GA4GHFilesStateService } from '../../shared/entry/GA4GHFiles.state.service';
import { Files } from '../../shared/files';
import { WorkflowVersion } from '../../shared/swagger/model/workflowVersion';

@Component({
  selector: 'app-files-workflow',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesWorkflowComponent extends Files {
  @Input() selectedVersion: WorkflowVersion;
  @Input() descriptorType: string;
  constructor() {
    super();
  }
}
