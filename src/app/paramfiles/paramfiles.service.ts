import { Injectable } from '@angular/core';

import { ContainersService } from '../shared/swagger';

@Injectable()
export class ParamFilesService {

  constructor(private containersService: ContainersService) { }

  getContainerTestParamFiles(toolId: number, tagName?: string, descriptorType?: string) {
    return this.containersService.getTestParameterFiles(toolId, tagName, descriptorType);
  }

  getTagsWithParam(toolId: number, validTags) {
    for (const tag of validTags) {
       this.getContainerTestParamFiles(toolId, tag.name).subscribe();
    }
  }
}
