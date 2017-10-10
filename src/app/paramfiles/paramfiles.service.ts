/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

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
