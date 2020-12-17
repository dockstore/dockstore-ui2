import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { WdlViewerPipelineResponse } from './wdl-viewer.model';

export interface WdlViewerState extends EntityState<WdlViewerPipelineResponse> {}

const initialState: WdlViewerState = {};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'wdl-viewer' })
export class WdlViewerStore extends EntityStore<WdlViewerState, WdlViewerPipelineResponse> {
  constructor() {
    super(initialState);
  }
}
