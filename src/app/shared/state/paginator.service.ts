import { Injectable } from '@angular/core';
import { PaginatorInfo, PaginatorStore } from './paginator.store';

@Injectable({ providedIn: 'root' })
export class PaginatorService {
  constructor(private paginatorStore: PaginatorStore) {}

  setPaginator(type: 'tool' | 'workflow' | 'lambdaEvent', pageSize: number, pageNumber: number): void {
    const paginatorInfo: PaginatorInfo = {
      pageSize: pageSize,
      pageIndex: pageNumber,
    };
    if (type === 'tool') {
      this.setToolPaginatorSize(paginatorInfo);
    } else if (type === 'workflow') {
      this.setWorkflowPaginatorSize(paginatorInfo);
    } else {
      this.setLambdaEventPaginatorSize(paginatorInfo);
    }
  }

  setToolPaginatorSize(paginatorInfo: PaginatorInfo) {
    this.paginatorStore.update((state) => {
      return {
        ...state,
        tool: paginatorInfo,
      };
    });
  }

  setWorkflowPaginatorSize(paginatorInfo: PaginatorInfo) {
    this.paginatorStore.update((state) => {
      return {
        ...state,
        workflow: paginatorInfo,
      };
    });
  }
  setLambdaEventPaginatorSize(paginatorInfo: PaginatorInfo) {
    this.paginatorStore.update((state) => {
      return {
        ...state,
        lambdaEvent: paginatorInfo,
      };
    });
  }
}
