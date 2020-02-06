import { Injectable } from '@angular/core';
import { PaginatorInfo, PaginatorStore } from './paginator.store';

@Injectable({ providedIn: 'root' })
export class PaginatorService {
  constructor(private paginatorStore: PaginatorStore) {}

  setPaginator(type: 'tool' | 'workflow', pageSize: number, pageNumber: number): void {
    const paginatorInfo: PaginatorInfo = {
      pageSize: pageSize,
      pageIndex: pageNumber
    };
    if (type === 'tool') {
      this.setToolPaginatorSize(paginatorInfo);
    } else {
      this.setWorkflowPaginatorSize(paginatorInfo);
    }
  }

  setToolPaginatorSize(paginatorInfo: PaginatorInfo) {
    this.paginatorStore.update(state => {
      return {
        ...state,
        tool: paginatorInfo
      };
    });
  }

  setWorkflowPaginatorSize(paginatorInfo: PaginatorInfo) {
    this.paginatorStore.update(state => {
      return {
        ...state,
        workflow: paginatorInfo
      };
    });
  }
}
