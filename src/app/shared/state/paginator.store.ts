import { Injectable } from '@angular/core';
import { Store, StoreConfig, EntityStore, EntityState } from '@datorama/akita';

export interface PaginatorState {
  tool: PaginatorInfo;
  workflow: PaginatorInfo;
}

export interface PaginatorInfo {
   pageSize: number;
}

const initialState: PaginatorState = {
  tool: { pageSize: 10 },
  workflow: { pageSize: 10 }
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'paginator' })
export class PaginatorStore extends Store<PaginatorState> {

  constructor() {
    super(initialState);
  }

}

