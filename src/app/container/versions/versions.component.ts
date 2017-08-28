import { ContainersService } from './../../shared/swagger/api/containers.service';
import { Component, Input, OnChanges, OnInit } from '@angular/core';

import { ContainerService } from './../../shared/container.service';
import { DateService } from '../../shared/date.service';
import { DockstoreService } from '../../shared/dockstore.service';
import { StateService } from './../../shared/state.service';
import { Versions } from '../../shared/versions';

@Component({
  selector: 'app-versions-container',
  templateUrl: './versions.component.html',
  styleUrls: [ './versions.component.css' ]
})
export class VersionsContainerComponent extends Versions implements OnInit {
  @Input() versions: Array<any>;
  @Input() verifiedSource: Array<any>;
  verifiedLink: string;
  publicPage: boolean;
  defaultVersion: string;
  tool: any;

  constructor(dockstoreService: DockstoreService, private containersService: ContainersService,
    dateService: DateService,
              private stateService: StateService,
              private containerService: ContainerService) {
    super(dockstoreService, dateService);
    this.verifiedLink = dateService.getVerifiedLink();
  }

  ngOnInit() {
    this.stateService.publicPage$.subscribe(publicPage => this.publicPage = publicPage);
    this.containerService.tool$.subscribe(tool => {
      this.tool = tool;
      if (tool) {
        this.defaultVersion = tool.defaultVersion;
      }
    });
  }

  setNoOrderCols(): Array<number> {
    return [ 5, 6 ];
  }

  updateDefaultVersion(newDefaultVersion: string) {
    this.tool.defaultVersion = newDefaultVersion;
    this.containersService.updateContainer(this.tool.id, this.tool).subscribe(response => this.containerService.setTool(response));
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
