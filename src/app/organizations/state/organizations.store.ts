import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { Organization } from '../../shared/swagger';

export interface OrganizationsState {
  organizations: Array<Organization>;
  searchName: string;
  sortBy: string;
  pageSize: number;
  pageIndex: number;
}

export function createInitialState(): OrganizationsState {
  return {
    organizations: null,
    searchName: '',
    sortBy: 'name',
    pageSize: 10,
    pageIndex: 0,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'organizations' })
export class OrganizationsStore extends Store<OrganizationsState> {
  constructor() {
    super(createInitialState());
  }
}
