/*
 *    Copyright 2018 OICR
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
import { QueryEntity } from '@datorama/akita';

import { DockstoreTool } from '../swagger';
import { ToolState, ToolStore } from './tool.store';
import { ExtendedDockstoreTool } from '../models/ExtendedDockstoreTool';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ToolQuery extends QueryEntity<ToolState, DockstoreTool> {
  public tool$ = this.selectActive();
  public toolId$ = this.tool$.pipe(map((tool: DockstoreTool) => {
    if (tool) {
      return tool.id;
    } else {
      return null;
    }
  }));
  public toolIsPublished$ = this.tool$.pipe(map((tool: DockstoreTool) => {
    if (tool) {
      return tool.is_published;
    } else {
      return null;
    }
  }));
  constructor(protected store: ToolStore) {
    super(store);
  }

}
