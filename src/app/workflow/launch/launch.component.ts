import { Component, Input } from '@angular/core';
import { DescriptorSelector } from '../../shared/selectors/descriptor-selector';
import { WorkflowLaunchService } from '../launch/workflow-launch.service';
import { ContainerService } from '../../shared/container.service';

@Component({
  selector: 'app-launch',
  templateUrl: './launch.component.html',
  styleUrls: ['./launch.component.css']
})
export class LaunchWorkflowComponent extends DescriptorSelector {
  @Input() path;

  params: string;
  cli: string;
  cwl: string;
  consonance: string;

  descriptors: Array<any>;

  constructor(private launchService: WorkflowLaunchService,
              private containerService: ContainerService) {
    super();
  }
  getDescriptors(currentVersion): any {
    return this.containerService.getDescriptors(this.versions, this.default);
  }
  reactToDescriptor(): void {
    this.changeMessages(this.path, this.currentVersion.name);
  }
  private changeMessages(workflowPath: string, versionName: string) {
    this.params = this.launchService.getParamsString(workflowPath, versionName, this.currentDescriptor);
    this.cli = this.launchService.getCliString(workflowPath, versionName, this.currentDescriptor);
    this.cwl = this.launchService.getCwlString(workflowPath, versionName);
    this.consonance = this.launchService.getConsonanceString(workflowPath, versionName);
    console.log(this.consonance);
  }
}
