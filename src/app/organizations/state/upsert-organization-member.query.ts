import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { UpsertOrganizationMemberState, UpsertOrganizationMemberStore } from './upsert-organization-member.store';

@Injectable({ providedIn: 'root' })
export class UpsertOrganizationMemberQuery extends Query<UpsertOrganizationMemberState> {
  constructor(protected store: UpsertOrganizationMemberStore) {
    super(store);
  }
}
