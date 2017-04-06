import { Injectable } from '@angular/core';

import { Dockstore } from '../../shared/dockstore.model';
import { DockstoreService } from '../../shared/dockstore.service';

@Injectable()
export class DockerfileService {

  constructor(private dockstoreService: DockstoreService) { }

  getDescriptorFile(toolId: number, tag: string) {
    let dockerFileUrl = Dockstore.API_URI + '/containers/' + toolId + '/dockerfile';

    if (tag) {
      dockerFileUrl += '?tag=' + tag;
    }

    return this.dockstoreService.getResponse(dockerFileUrl);
  }

}
