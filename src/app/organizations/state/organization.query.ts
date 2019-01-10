import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { OrganizationState, OrganizationStore } from './organization.store';

@Injectable({ providedIn: 'root' })
export class OrganizationQuery extends Query<OrganizationState> {
  organization$ = this.select(state => state.organization);
  loading$ = this.selectLoading();

  constructor(protected store: OrganizationStore) {
    super(store);
  }

}
