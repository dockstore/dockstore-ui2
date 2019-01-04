import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { OrganizationStore, OrganizationState } from './organization.store';

@Injectable({ providedIn: 'root' })
export class OrganizationQuery extends Query<OrganizationState> {

  constructor(protected store: OrganizationStore) {
    super(store);
  }

}
