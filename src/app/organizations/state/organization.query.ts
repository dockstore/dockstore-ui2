import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { OrganizationState, OrganizationStore } from './organization.store';
import { map } from 'rxjs/operators';
import { Organization } from '../../shared/swagger';


@Injectable({ providedIn: 'root' })
export class OrganizationQuery extends Query<OrganizationState> {
  organization$ = this.select(state => state.organization);
  loading$ = this.selectLoading();
  canEdit$ = this.select(state => state.canEdit);
  canEditMembership$ = this.select(state => state.canEditMembership);
  gravatarUrl$ = this.organization$.pipe(map((organization: Organization ) => {
    if (organization && organization.avatarUrl) {
      return this.genGravatarUrl(organization.avatarUrl);
    } else {
      return null;
    }}));
  constructor(protected store: OrganizationStore) {
    super(store);
  }

  genGravatarUrl(url: string): string {
    return url ? 'https://www.gravatar.com/avatar/' + '000' + '?d=' + url : null;
  }
}
