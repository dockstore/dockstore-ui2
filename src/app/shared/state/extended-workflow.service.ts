/*
 *    Copyright 2018 OICR
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

import { transaction } from '@datorama/akita';
import { DateService } from '../date.service';
import { DockstoreService } from '../dockstore.service';
import { ExtendedWorkflow } from '../models/ExtendedWorkflow';
import { ProviderService } from '../provider.service';
import { Workflow } from '../swagger';
import { BioWorkflow } from '../swagger/model/bioWorkflow';
import { Service } from '../swagger/model/service';
import { ExtendedWorkflowStore } from './extended-workflow.store';

@Injectable({ providedIn: 'root' })
export class ExtendedWorkflowService {
  constructor(
    private extendedWorkflowStore: ExtendedWorkflowStore,
    private dockstoreService: DockstoreService,
    private dateService: DateService,
    private providerService: ProviderService
  ) {}

  /**
   * Updates the extendedWorkflow by extending the current workflow
   *
   * @param {ExtendedWorkflow} workflow
   * @memberof ExtendedWorkflowService
   */
  @transaction()
  update(workflow: Workflow) {
    if (workflow) {
      this.extendedWorkflowStore.update(this.extendWorkflow(workflow));
    } else {
      this.remove();
    }
  }

  remove() {
    this.extendedWorkflowStore.update({});
  }

  /**
   * Converts a Workflow to an Extended Workflow with more properties
   * UPDATE THIS WHEN NEW EXTENDED PROPERTIES ARE ADDED
   *
   * @param {Workflow} workflow
   * @returns {ExtendedWorkflow}
   * @memberof ExtendedWorkflowService
   */
  extendWorkflow(workflow: BioWorkflow | Service): ExtendedWorkflow {
    if (workflow) {
      let extendedWorkflow: ExtendedWorkflow = { ...workflow };
      extendedWorkflow = <ExtendedWorkflow>this.providerService.setUpProvider(extendedWorkflow);
      extendedWorkflow.email = this.dockstoreService.stripMailTo(extendedWorkflow.email);
      extendedWorkflow.agoMessage = this.dateService.getAgoMessage(new Date(extendedWorkflow.last_modified_date).getTime());
      extendedWorkflow.versionVerified = this.dockstoreService.getVersionVerified(extendedWorkflow.workflowVersions);
      extendedWorkflow.verifiedSources = this.dockstoreService.getVerifiedWorkflowSources(extendedWorkflow);
      return extendedWorkflow;
    } else {
      return null;
    }
  }
}
