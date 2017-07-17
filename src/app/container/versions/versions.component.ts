import { ContainersWebService } from './../../shared/webservice/containers-web.service';
import { ContainerService } from './../../shared/container.service';
import { StateService } from './../../shared/state.service';
import { Component, Input, OnChanges, OnInit } from '@angular/core';

import { DateService } from '../../shared/date.service';

import { Versions } from '../../shared/versions';
import { DockstoreService } from '../../shared/dockstore.service';

@Component({
  selector: 'app-versions-container',
  templateUrl: './versions.component.html',
  styleUrls: [ './versions.component.css' ]
})
export class VersionsContainerComponent extends Versions implements OnInit {
  verifiedLink: string;
  publicPage: boolean;
  defaultVersion: string;
  @Input() versions: Array<any>;
  @Input() verifiedSource: Array<any>;
  tool: any;
  setNoOrderCols(): Array<number> {
    return [ 5, 6 ];
  }
  constructor(dockstoreService: DockstoreService,
    dateService: DateService,
              private stateService: StateService,
              private containerService: ContainerService,
              private containersWebService: ContainersWebService) {
    super(dockstoreService, dateService);
    this.verifiedLink = dateService.getVerifiedLink();
  }

  ngOnInit() {
    this.stateService.publicPage.subscribe(publicPage => this.publicPage = publicPage);
    this.containerService.tool$.subscribe(tool => {
      this.tool = tool;
      if (tool) {
        this.defaultVersion = tool.defaultVersion;
      }
    });
  }

  updateDefaultVersion(newDefaultVersion: string) {
    this.tool.defaultVersion = newDefaultVersion;
    this.containersWebService.updateContainer(this.tool.id, this.tool).subscribe(response => this.containerService.setTool(response));
  }

  getVerifiedSource(name: string) {
    for (const source of this.verifiedSource) {
      if (source.version === name) {
        return source.verifiedSource;
      }

    }
    return '';
  }
}
