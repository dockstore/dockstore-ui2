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

import { Component, OnInit, OnChanges } from '@angular/core';
import { Files } from '../../shared/files';
import { ParamfilesService } from '../../container/paramfiles/paramfiles.service';
import {Subscription} from 'rxjs/Subscription';
import { WorkflowService } from '../../shared/workflow.service';

@Component({
  selector: 'app-files-workflow',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesWorkflowComponent extends Files implements OnInit, OnChanges {
  versionsWithParamfiles: Array<any>;
  constructor(private paramfilesService: ParamfilesService) {
    super();
  }

  ngOnInit() {
    this.versionsWithParamfiles = this.paramfilesService.getVersions(this.versions);
  }
  ngOnChanges() {
    this.versionsWithParamfiles = this.paramfilesService.getVersions(this.versions);
  }
}
