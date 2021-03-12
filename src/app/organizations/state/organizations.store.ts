import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { Organization } from '../../shared/swagger';

export interface OrganizationsState {
  organizations: Array<Organization>;
  searchName: string;
  sortBy: 'starred' | 'name';
}

export function createInitialState(): OrganizationsState {
  return {
    organizations: null,
    searchName: '',
    sortBy: 'starred',
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'organizations' })
export class OrganizationsStore extends Store<OrganizationsState> {
  constructor() {
    super(createInitialState());
  }
}
