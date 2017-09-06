import { Injectable } from '@angular/core';

import { DescriptorService } from '../../shared/descriptor.service';
import { ContainersService } from '../../shared/swagger/api/containers.service';

@Injectable()
export class ToolDescriptorService extends DescriptorService {
  constructor(private containersService: ContainersService) {
    super();
  }

  protected getCwl(id: number, versionName: string) {
      return this.containersService.cwl(id, versionName);
  }

  protected getSecondaryCwl(id: number, versionName: string) {
      return this.containersService.secondaryCwl(id, versionName);
  }

  protected getWdl(id: number, versionName: string) {
      return this.containersService.wdl(id, versionName);
  }

  protected getSecondaryWdl(id: number, versionName: string) {
      return this.containersService.secondaryWdl(id, versionName);
  }
}
