import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface PaginatorState {
  tool: PaginatorInfo;
  workflow: PaginatorInfo;
  lambdaEvent: PaginatorInfo;
  version: PaginatorInfo;
  gitHubAppNotification: PaginatorInfo;
}

export interface PaginatorInfo {
  pageSize: number;
  pageIndex: number;
}

const initialState: PaginatorState = {
  tool: { pageSize: 10, pageIndex: 0 },
  workflow: { pageSize: 10, pageIndex: 0 },
  lambdaEvent: { pageSize: 10, pageIndex: 0 },
  version: { pageSize: 10, pageIndex: 0 },
  gitHubAppNotification: { pageSize: 10, pageIndex: 0 },
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'paginator' })
export class PaginatorStore extends Store<PaginatorState> {
  constructor() {
    super(initialState);
  }
}
