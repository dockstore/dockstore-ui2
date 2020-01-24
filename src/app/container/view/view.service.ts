import { Injectable } from '@angular/core';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { ContainerService } from 'app/shared/container.service';
import { ContainersService } from 'app/shared/swagger';
import { ToolQuery } from 'app/shared/tool/tool.query';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  constructor(
    private alertService: AlertService,
    private containersService: ContainersService,
    private containerService: ContainerService,
    private toolQuery: ToolQuery
  ) {}
  updateDefaultVersion(newDefaultVersion: string): void {
    const toolId = this.toolQuery.getActive().id;
    const message = 'Updating default tool version';
    this.alertService.start(message);
    this.containersService.updateToolDefaultVersion(toolId, newDefaultVersion).subscribe(
      response => {
        this.alertService.detailedSuccess();
        this.containerService.replaceTool(null, response);
        this.containerService.setTool(response);
      },
      error => this.alertService.detailedError(error)
    );
  }
}
