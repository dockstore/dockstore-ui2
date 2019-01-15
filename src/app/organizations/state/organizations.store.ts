import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { Organisation } from '../../shared/swagger';

export interface OrganizationsState {
   organizations: Array<Organisation>;
   searchName: string;
}

export function createInitialState(): OrganizationsState {
  return {
    organizations: null,
    searchName: ''
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'organizations' })
export class OrganizationsStore extends Store<OrganizationsState> {

  constructor() {
    super(createInitialState());
  }

}

