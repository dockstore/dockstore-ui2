import { Component, Input } from '@angular/core';

import { DescriptorSelector } from '../../shared/selectors/descriptor-selector';

import { LaunchService } from './launch.service';
import { ContainerService } from '../container.service';

@Component({
  selector: 'app-launch',
  templateUrl: './launch.component.html',
  styleUrls: ['./launch.component.css']
})
export class LaunchComponent extends DescriptorSelector {

  @Input() path?;

  params: string;
  cli: string;
  cwl: string;
  consonance: string;

  descriptors: Array<any>;

  constructor(private launchService: LaunchService,
              private containerService: ContainerService) {
    super();
  }

  getDescriptors(currentVersion): any {
    return this.containerService.getDescriptors(this.versions, this.default);
  }

  reactToDescriptor(): void {
    this.changeMessages(this.path, this.currentVersion.name);
  }

  private changeMessages(toolPath: string, versionName: string) {
    this.params = this.launchService.getParamsString(toolPath, versionName, this.currentDescriptor);
    this.cli = this.launchService.getCliString(toolPath, versionName, this.currentDescriptor);
    this.cwl = this.launchService.getCwlString(toolPath, versionName);
    this.consonance = this.launchService.getConsonanceString(toolPath, versionName);
  }

}
