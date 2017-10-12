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

import { ContainersService } from './../../shared/swagger/api/containers.service';
import { WorkflowsService } from './../../shared/swagger/api/workflows.service';

@Injectable()
export class ParamfilesService {
  type: string;
  // TODO: have an endpoints to
  // - get versions with test paramfiles
  // - get descriptors with test paramfiles for each version

  constructor(private containersService: ContainersService, private workflowsService: WorkflowsService) { }

  getFiles(id: number, type: string, versionName?: string, descriptor?: string) {
    if (type === 'workflows') {
      return this.workflowsService.getTestParameterFiles(id, versionName);
    } else {
      return this.containersService.getTestParameterFiles(id, versionName, descriptor);
    }
  }

  // get descriptors which have test parameter files
  getDescriptors(version) {
    const descriptorsWithParamfiles = [];
    if (version) {
      for (const file of version.sourceFiles) {
        const type = file.type;
        if (type === 'CWL_TEST_JSON' && !descriptorsWithParamfiles.includes('cwl')) {
          descriptorsWithParamfiles.push('cwl');

        } else if (type === 'WDL_TEST_JSON' && !descriptorsWithParamfiles.includes('wdl')) {
          descriptorsWithParamfiles.push('wdl');
        }
      }
    }
    return descriptorsWithParamfiles;
  }

  // get versions which have test parameter files
  getVersions(versions) {
    const versionsWithParamfiles = [];
    if (versions) {
      for (const version of versions) {
        if (this.getDescriptors(version).length) {
          versionsWithParamfiles.push(version);
        }
      }
    }
    return versionsWithParamfiles;
  }

}
