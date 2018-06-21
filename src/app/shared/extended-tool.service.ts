import { DockstoreService } from './dockstore.service';
import { DateService } from './date.service';
import { ImageProviderService } from './image-provider.service';
import { Observable } from 'rxjs/Observable';
import { DockstoreTool } from './swagger/model/dockstoreTool';
import { ProviderService } from './provider.service';
import { ExtendedDockstoreTool } from './models/ExtendedDockstoreTool';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ContainerService } from './container.service';
import { Injectable } from '@angular/core';

/**
 * This service contains the ExtendedDockstoreTool observable.
 * All components that rely on the extended properties of the DockstoreTool should subscribe to the observable in this service.
 * @export
 * @class ExtendedToolService
 */
@Injectable()
export class ExtendedToolService {
    extendedDockstoreTool$: Observable<ExtendedDockstoreTool>;
    constructor(private containerService: ContainerService, private providerService: ProviderService,
        private imageProviderService: ImageProviderService, private dateService: DateService, private dockstoreService: DockstoreService) {
        this.extendedDockstoreTool$ = this.containerService.tool$.map((tool: DockstoreTool) => this.extendTool(tool));
    }

    /**
     * Converts a Workflow to an Extended Workflow with more properties
     * UPDATE THIS WHEN NEW EXTENDED PROPERTIES ARE ADDED
     * @param {DockstoreTool} tool
     * @returns {ExtendedDockstoreTool}
     * @memberof ExtendedToolService
     */
    extendTool(tool: DockstoreTool): ExtendedDockstoreTool {
        if (tool) {
            let extendedTool: ExtendedDockstoreTool = this.providerService.setUpProvider(tool, null);
              extendedTool = this.providerService.setUpProvider(tool, null);
              extendedTool.buildMode = this.containerService.getBuildMode(extendedTool.mode);
              extendedTool.buildModeTooltip = this.containerService.getBuildModeTooltip(extendedTool.mode);
              extendedTool = this.imageProviderService.setUpImageProvider(extendedTool);
              extendedTool.agoMessage = this.dateService.getAgoMessage(new Date(extendedTool.lastBuild).getTime());
              extendedTool.email = this.dockstoreService.stripMailTo(extendedTool.email);
              extendedTool.lastBuildDate = this.dateService.getDateTimeMessage(new Date(extendedTool.lastBuild).getTime());
              extendedTool.lastUpdatedDate = this.dateService.getDateTimeMessage(new Date(extendedTool.lastUpdated).getTime());
              extendedTool.versionVerified = this.dockstoreService.getVersionVerified(extendedTool.tags);
              extendedTool.verifiedSources = this.dockstoreService.getVerifiedSources(extendedTool);
            return extendedTool;
        } else {
            return null;
        }
    }
}
