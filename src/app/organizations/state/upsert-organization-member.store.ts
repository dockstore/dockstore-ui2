import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface UpsertOrganizationMemberState {
  key: string;
}

export function createInitialState(): UpsertOrganizationMemberState {
  return {
    key: ''
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'upsert-organization-member' })
export class UpsertOrganizationMemberStore extends Store<UpsertOrganizationMemberState> {
  constructor() {
    super(createInitialState());
  }
}
