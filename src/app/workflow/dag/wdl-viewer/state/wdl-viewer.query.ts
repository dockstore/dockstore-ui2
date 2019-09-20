import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { WdlViewerPipelineResponse } from './wdl-viewer.model';
import { WdlViewerState, WdlViewerStore } from './wdl-viewer.store';

@Injectable({
  providedIn: 'root'
})
export class WdlViewerQuery extends QueryEntity<WdlViewerState, WdlViewerPipelineResponse> {
  constructor(protected store: WdlViewerStore) {
    super(store);
  }
}
