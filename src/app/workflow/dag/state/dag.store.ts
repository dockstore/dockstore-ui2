import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface DagState {
  dagResults: any;
}

export function createInitialState(): DagState {
  return {
    dagResults: null,
  };
}

@Injectable()
@StoreConfig({ name: 'dag' })
export class DagStore extends Store<DagState> {
  constructor() {
    super(createInitialState());
  }
}
