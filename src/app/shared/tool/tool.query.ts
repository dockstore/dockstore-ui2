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
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DockstoreTool } from '../swagger';
import { ToolState, ToolStore } from './tool.store';

@Injectable({
  providedIn: 'root',
})
export class ToolQuery extends QueryEntity<ToolState, DockstoreTool> {
  public tool$: Observable<DockstoreTool> = this.selectActive();
  public toolId$: Observable<number> = this.tool$.pipe(map((tool: DockstoreTool) => (tool ? tool.id : null)));
  public toolIsPublished$: Observable<boolean> = this.tool$.pipe(map((tool: DockstoreTool) => (tool ? tool.is_published : null)));
  public isManualMode$: Observable<boolean> = this.tool$.pipe(
    map((tool: DockstoreTool) => tool && tool.mode === DockstoreTool.ModeEnum.MANUALIMAGEPATH)
  );
  constructor(protected store: ToolStore) {
    super(store);
  }
}
