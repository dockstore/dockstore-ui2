import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface DagState {
  wdlViewerResults: any,
  dagResults: any;
}

export function createInitialState(): DagState {
  return {
    wdlViewerResults: null,
    dagResults: null
  };
}

@Injectable()
@StoreConfig({ name: 'dag' })
export class DagStore extends Store<DagState> {

  constructor() {
    super(createInitialState());
  }

}

