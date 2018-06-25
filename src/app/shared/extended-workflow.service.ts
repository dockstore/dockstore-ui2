import { Workflow } from './swagger/model/workflow';
import { ContainerService } from './container.service';
import { DockstoreService } from './dockstore.service';
import { DateService } from './date.service';
import { ImageProviderService } from './image-provider.service';
import { ProviderService } from './provider.service';
import { WorkflowService } from './workflow.service';
import { Observable } from 'rxjs/Observable';
import { ExtendedWorkflow } from './models/ExtendedWorkflow';
import { Injectable } from '@angular/core';

/**
 * This service contains the ExtendedWorkflow observable.
 * All components that rely on the extended properties of the Workflow should subscribe to the observable in this service.
 * @export
 * @class ExtendedWorkflowService
 */
@Injectable()
export class ExtendedWorkflowService {
    extendedWorkflow$: Observable<ExtendedWorkflow>;
    constructor(private workflowService: WorkflowService, private providerService: ProviderService,
        private imageProviderService: ImageProviderService, private dateService: DateService,
        private dockstoreService: DockstoreService) {
            this.extendedWorkflow$ = this.workflowService.workflow$.map((workflow: Workflow) => this.extendWorkflow(workflow));
        }

    /**
     * Converts a Workflow to an Extended Workflow with more properties
     * UPDATE THIS WHEN NEW EXTENDED PROPERTIES ARE ADDED
     * @param {Workflow} workflow
     * @returns {ExtendedWorkflow}
     * @memberof ExtendedWorkflowService
     */
    extendWorkflow(workflow: Workflow): ExtendedWorkflow {
        if (workflow) {
            const extendedWorkflow: ExtendedWorkflow = <ExtendedWorkflow>this.providerService.setUpProvider(workflow);
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
