import { DockstoreService } from './dockstore.service';
import { DateService } from './date.service';
import { ImageProviderService } from './image-provider.service';
import { Observable } from 'rxjs/Observable';
import { DockstoreTool } from './swagger/model/dockstoreTool';
import { ProviderService } from './provider.service';
import { ExtendedDockstoreTool } from './models/ExtendedDockstoreTool';
import { BehaviorSubject } from 'rxjs/Rx';
import { ContainerService } from './container.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ExtendedToolService {
    extendedDockstoreTool: Observable<ExtendedDockstoreTool>;
    constructor(private containerService: ContainerService, private providerService: ProviderService,
        private imageProviderService: ImageProviderService, private dateService: DateService, private dockstoreService: DockstoreService) {
        this.extendedDockstoreTool = this.containerService.tool$.map((tool: DockstoreTool) => this.extendTool(tool));
    }
    extendTool(tool: DockstoreTool): ExtendedDockstoreTool {
        if (tool) {
            let extendededTool: ExtendedDockstoreTool = this.providerService.setUpProvider(tool);
              extendededTool = this.providerService.setUpProvider(tool);
              extendededTool.buildMode = this.containerService.getBuildMode(extendededTool.mode);
              extendededTool.buildModeTooltip = this.containerService.getBuildModeTooltip(extendededTool.mode);
              extendededTool = this.imageProviderService.setUpImageProvider(extendededTool);
              extendededTool.agoMessage = this.dateService.getAgoMessage(new Date(extendededTool.lastBuild).getTime());
              extendededTool.email = this.dockstoreService.stripMailTo(extendededTool.email);
              extendededTool.lastBuildDate = this.dateService.getDateTimeMessage(new Date(extendededTool.lastBuild).getTime());
              extendededTool.lastUpdatedDate = this.dateService.getDateTimeMessage(new Date(extendededTool.lastUpdated).getTime());
              extendededTool.versionVerified = this.dockstoreService.getVersionVerified(extendededTool.tags);
              extendededTool.verifiedSources = this.dockstoreService.getVerifiedSources(extendededTool);
            return extendededTool;
        } else {
            return null;
        }
    }
}
