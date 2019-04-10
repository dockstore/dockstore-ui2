import { Injectable } from '@angular/core';
import { StoreConfig, EntityState, EntityStore } from '@datorama/akita';
import { WdlViewerPipeline } from './wdl-viewer.model';


export interface WdlViewerState extends EntityState<WdlViewerPipeline> {}

const initialState: WdlViewerState = {};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'wdl-viewer' })
export class WdlViewerStore extends EntityStore<WdlViewerState, WdlViewerPipeline> {

  constructor() {
    super(initialState);
  }

}
