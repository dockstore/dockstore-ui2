import { Injectable } from '@angular/core';

import { Dockstore } from '../shared/dockstore.model';
import { DockstoreService } from '../shared/dockstore.service';

@Injectable()
export class DescriptorsService {

  constructor(private dockstoreService: DockstoreService) { }

  getCwl(toolId: number, tagName?: string) {
    let cwlUrl = Dockstore.API_URI + '/containers/' + toolId + '/cwl';
    if (tagName) {
      cwlUrl += '?tag=' + tagName;
    }
    return this.dockstoreService.getResponse(cwlUrl);
  }

  getSecondaryCwl(toolId: number, tagName?: string) {
    let secondaryCwlUrl = Dockstore.API_URI + '/containers/' + toolId + '/secondaryCwl';
    if (tagName) {
      secondaryCwlUrl += '?tag=' + tagName;
    }
    return this.dockstoreService.getResponse(secondaryCwlUrl);
  }

  getWdl(toolId: number, tagName?: string) {
    let wdlUrl = Dockstore.API_URI + '/containers/' + toolId + '/wdl';
    if (tagName) {
      wdlUrl += '?tag=' + tagName;
    }
    return this.dockstoreService.getResponse(wdlUrl);
  }

  getSecondaryWdl(toolId: number, tagName?: string) {
    let secondaryWdlUrl = Dockstore.API_URI + '/containers/' + toolId + '/secondaryWdl';
    if (tagName) {
      secondaryWdlUrl += '?tag=' + tagName;
    }
    return this.dockstoreService.getResponse(secondaryWdlUrl);
  }
}
