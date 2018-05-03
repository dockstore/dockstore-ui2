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
import { MyEntriesService } from './../shared/myentries.service';

@Injectable()
export class MytoolsService extends MyEntriesService {
  constructor() {
  }

  getGroupIndex(nsContainers: any[], group: string): number {
    return nsContainers.findIndex(nsContainer => nsContainer.namespace === group);
  }
}
