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

  protected getSecondaryNextFlow(id: number, versionName: string) {
    // not implemented yet, may not be applicable
      return '';
  }

  protected getNextFlow(id: number, versionName: string) {
    // not implemented yet, may not be applicable
      return '';
  }
}
