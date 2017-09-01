import { DescriptorService } from '../../shared/descriptor.service';
import { ContainersService } from '../../shared/swagger/api/containers.service';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Dockstore } from '../../shared/dockstore.model';
import { HttpService } from '../../shared/http.service';

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
