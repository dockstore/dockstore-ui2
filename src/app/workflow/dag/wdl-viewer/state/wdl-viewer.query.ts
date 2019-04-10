import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { WdlViewerPipeline } from './wdl-viewer.model';
import { WdlViewerState, WdlViewerStore } from './wdl-viewer.store';

@Injectable({
  providedIn: 'root'
})
export class WdlViewerQuery extends QueryEntity<WdlViewerState, WdlViewerPipeline> {

  constructor(protected store: WdlViewerStore) {
    super(store);
  }

}
