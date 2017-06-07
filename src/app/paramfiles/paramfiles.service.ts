import { Injectable } from '@angular/core';

import { Dockstore } from '../shared/dockstore.model';
import { HttpService } from '../shared/http.service';

@Injectable()
export class ParamFilesService {

  constructor(private httpService: HttpService) { }

  getContainerTestParamFiles(toolId: number, tagName?: string, descriptorType?: string) {
    let testParamFilesUrl = Dockstore.API_URI + '/containers/' + toolId + '/testParameterFiles';
    if (tagName && descriptorType) {
      testParamFilesUrl += '?tag=' + tagName;
      testParamFilesUrl += '&descriptorType=' + descriptorType;
    } else if (tagName) {
      testParamFilesUrl += '?tag=' + tagName;
    } else if (testParamFilesUrl) {
      testParamFilesUrl += '?descriptorType=' + descriptorType;
    }
    return this.httpService.getResponse(testParamFilesUrl);
  }

  getTagsWithParam(toolId: number, validTags) {
    for (const tag of validTags) {
       this.getContainerTestParamFiles(toolId, tag.name).subscribe(
        (result) => {
          console.log(result);
        }
       );
    }
  }
}
