import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginatorStore, PaginatorInfo } from './paginator.store';

@Injectable({ providedIn: 'root' })
export class PaginatorService {

  constructor(private paginatorStore: PaginatorStore,
    private http: HttpClient) {
  }

  setPaginatorSize(type: 'tool' | 'workflow', pageSize: number): void {
    const paginatorInfo: PaginatorInfo = {
      pageSize: pageSize
    };
    if (type === 'tool') {
      this.setToolPaginatorSize(paginatorInfo);
    } else {
      this.setWorkflowPaginatorSize(paginatorInfo);
    }
  }

  setToolPaginatorSize(paginatorInfo: PaginatorInfo) {
    this.paginatorStore.setState(state => {
      return {
        ...state,
        tool: paginatorInfo
      };
    });
  }

  setWorkflowPaginatorSize(paginatorInfo: PaginatorInfo) {
    this.paginatorStore.setState(state => {
      return {
        ...state,
        workflow: paginatorInfo
      };
    });
  }

}

