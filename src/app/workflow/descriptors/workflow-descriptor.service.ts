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

import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { DescriptorService } from '../../shared/descriptor.service';
import { Injectable } from '@angular/core';

@Injectable()
export class WorkflowDescriptorService extends DescriptorService {
constructor(private workflowsService: WorkflowsService) {
    super();
  }

  protected getCwl(id: number, versionName: string) {
      this.workflowsService.getPublishedWorkflow(id)
      return this.workflowsService.cwl(id, versionName);
  }

  protected getSecondaryCwl(id: number, versionName: string) {
      return this.workflowsService.secondaryCwl(id, versionName);
  }

  protected getWdl(id: number, versionName: string) {
      return this.workflowsService.wdl(id, versionName);
  }

  protected getSecondaryWdl(id: number, versionName: string) {
      return this.workflowsService.secondaryWdl(id, versionName);
  }
}
