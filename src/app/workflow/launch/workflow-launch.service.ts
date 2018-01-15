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

import { LaunchService } from '../../shared/launch.service';
import { Dockstore } from '../../shared/dockstore.model';
export class WorkflowLaunchService extends LaunchService {
  getParamsString(path: string, versionName: string, currentDescriptor: string) {
    return `$ dockstore workflow convert entry2json --entry ${ path }:${ versionName } > Dockstore.json
            \n$ vim Dockstore.json`;
  }

  getCliString(path: string, versionName: string, currentDescriptor: string) {
    return `$ dockstore workflow launch --entry ${ path }:${ versionName } --json Dockstore.json`;
  }

  getCwlString(path: string, versionName: string, mainDescriptor: string) {
    return `$ cwl-runner ${ Dockstore.API_URI }/api/ga4gh/v1/tools/${ encodeURIComponent('#workflow/' + path) }` +
      `/versions/${ encodeURIComponent(versionName) }/plain-CWL/descriptor/${mainDescriptor} Dockstore.json`;
  }
}
