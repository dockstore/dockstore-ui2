import { Injectable } from '@angular/core';

import { Dockstore } from '../shared/dockstore.model';
import { DockstoreService } from '../shared/dockstore.service';

@Injectable()
export class ParamFilesService {

  constructor(private dockstoreService: DockstoreService) { }

  getTestParamFiles(toolId: number, tagName?: string, descriptorType?: string) {
    let testParamFilesUrl = Dockstore.API_URI + '/containers/' + toolId + '/testParameterFiles';

    if (tagName && descriptorType) {
      testParamFilesUrl += '?tag=' + tagName;
      testParamFilesUrl += '&descriptorType=' + descriptorType;
    } else if (tagName) {
      testParamFilesUrl += '?tag=' + tagName;
    } else if (testParamFilesUrl) {
      testParamFilesUrl += '?descriptorType=' + descriptorType;
    }

    return this.dockstoreService.getResponse(testParamFilesUrl);
  }

  getTagsWithParam(toolId: number, validTags) {
    for (const tag of validTags) {
       this.getTestParamFiles(toolId, tag.name).subscribe(
        (result) => {
          console.log(result);
        }
       );
    }
  }
}
