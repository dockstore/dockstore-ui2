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
import { Injectable } from '@angular/core';

import { Dockstore } from '../../shared/dockstore.model';
import { LaunchService } from '../../shared/launch.service';
import { ga4ghPath } from './../../shared/constants';
import { EntryType } from './../../shared/enum/entryType.enum';
import { Workflow } from './../../shared/swagger/model/workflow';
import { WorkflowService } from './../../shared/workflow.service';

@Injectable()
export class WorkflowLaunchService extends LaunchService {
  private type = 'workflow';
  constructor(private workflowService: WorkflowService) {
    super();
    workflowService.workflow$.subscribe((workflow: Workflow) => {
      if (!workflow) {
        this.type = 'workflow';
      } else {
        if (workflow.is_checker) {
          this.type = 'checker';
        } else {
          this.type = 'workflow';
        }
      }
    });
  }
  getParamsString(path: string, versionName: string, currentDescriptor: string) {
    if (currentDescriptor === 'nextflow') {
      return `$ vim Dockstore.json`;
    }
    return `$ dockstore ${this.type} convert entry2json --entry ${path}:${versionName} > Dockstore.json
            \n$ vim Dockstore.json`;
  }

  getCliString(path: string, versionName: string, currentDescriptor: string) {
    return `$ dockstore ${this.type} launch --entry ${path}:${versionName} --json Dockstore.json`;
  }

  getCwlString(path: string, versionName: string, mainDescriptor: string) {
    return `$ cwl-runner ${Dockstore.API_URI}${ga4ghPath}/tools/${encodeURIComponent('#workflow/' + path)}` +
      `/versions/${encodeURIComponent(versionName)}/plain-CWL/descriptor/${mainDescriptor} Dockstore.json`;
  }

  getCheckWorkflowString(path: string, versionName: string): string {
    return this.getCheckEntry(path, versionName, EntryType.WORKFLOW);
  }
}
