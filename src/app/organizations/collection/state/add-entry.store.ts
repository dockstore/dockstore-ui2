import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { Collection, OrganizationUser } from '../../../shared/swagger';

export interface AddEntryState {
  memberships: Array<OrganizationUser>;
  collections: Array<Collection>;
}

export function createInitialState(): AddEntryState {
  return {
    memberships: null,
    collections: null
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'add-entry' })
export class AddEntryStore extends Store<AddEntryState> {
  constructor() {
    super(createInitialState());
  }
}
