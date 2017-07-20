import { ContainersService } from './../../shared/swagger/api/containers.service';
import { StateService } from './../../shared/state.service';
import { validationPatterns } from './../../shared/validationMessages.model';
import { InfoTabService } from './info-tab.service';
import { ContainerService } from './../../shared/container.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-info-tab',
  templateUrl: './info-tab.component.html',
  styleUrls: ['./info-tab.component.css'],
  providers: [InfoTabService]
})
export class InfoTabComponent implements OnInit {
  @Input() validVersions;
  @Input() defaultVersion;
  tool: any;
  public validationPatterns = validationPatterns;
  dockerFileEditing: boolean;
  cwlPathEditing: boolean;
  wdlPathEditing: boolean;
  isPublic: boolean;
  constructor(private containerService: ContainerService, private infoTabService: InfoTabService, private StateService: StateService,
    private containersService: ContainersService) { }

  ngOnInit() {
    this.containerService.tool$.subscribe(tool => this.tool = tool);
    this.infoTabService.dockerFileEditing$.subscribe(editing => this.dockerFileEditing = editing);
    this.infoTabService.cwlPathEditing$.subscribe(editing => this.cwlPathEditing = editing);
    this.infoTabService.wdlPathEditing$.subscribe(editing => this.wdlPathEditing = editing);
    this.StateService.publicPage.subscribe(publicPage => this.isPublic = publicPage);
  }

  toggleEditDockerFile() {
    if (this.dockerFileEditing) {
      this.containersService.updateContainer(this.tool.id, this.tool).subscribe();
    }
    this.infoTabService.setDockerFileEditing(!this.dockerFileEditing);
  }

  toggleEditCWLPath() {
    if (this.cwlPathEditing) {
      this.containersService.updateContainer(this.tool.id, this.tool).subscribe();
    }
    this.infoTabService.setCWLPathEditing(!this.cwlPathEditing);
  }

  toggleEditWDLPath() {
    if (this.wdlPathEditing) {
      this.containersService.updateContainer(this.tool.id, this.tool).subscribe();
    }
    this.infoTabService.setWDLPathEditing(!this.wdlPathEditing);
  }
}
