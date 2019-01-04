import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { Organisation } from '../../shared/swagger';

export interface OrganizationsState {
   organizations: Array<Organisation>;
}

export function createInitialState(): OrganizationsState {
  return {
    organizations: null
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'organizations' })
export class OrganizationsStore extends Store<OrganizationsState> {

  constructor() {
    super(createInitialState());
  }

}

