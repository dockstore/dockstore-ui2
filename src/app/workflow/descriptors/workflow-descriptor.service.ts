import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { DescriptorService } from '../../shared/descriptor.service';
import { Injectable } from '@angular/core';

@Injectable()
export class WorkflowDescriptorService extends DescriptorService {
constructor(private workflowsService: WorkflowsService) {
    super();
  }

  protected getCwl(id: number, versionName: string) {
      return this.workflowsService.cwl(id, versionName);
  }

  protected getSecondaryCwl(id: number, versionName: string) {
      return this.workflowsService.secondaryCwl(id, versionName);
  }

  protected getWdl(id: number, versionName: string) {
      return this.workflowsService.wdl(id, versionName);
  }

  protected getSecondaryWdl(id: number, versionName: string) {
      return this.workflowsService.secondaryWdl(id, versionName);
  }
}
