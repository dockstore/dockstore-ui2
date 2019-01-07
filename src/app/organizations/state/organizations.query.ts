import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Organisation } from '../../shared/swagger';
import { OrganizationsState, OrganizationsStore } from './organizations.store';

@Injectable({ providedIn: 'root' })
export class OrganizationsQuery extends Query<OrganizationsState> {
  organizations$: Observable<Array<Organisation>> = this.select(state => state.organizations);
  searchName$: Observable<string> = this.select(state => state.searchName);
  filteredOrganizations$: Observable<Array<Organisation>> = combineLatest(this.organizations$, this.searchName$).pipe(
    map(([organizations, searchName]: [Array<Organisation>, string]) => {
      return this.filterOrganizations(organizations, searchName);
    }));

  // loading$ is currently not being used because the alertQuery global loading is used instead
  // loading$: Observable<boolean> = this.loading$;
  constructor(protected store: OrganizationsStore) {
    super(store);
  }

  filterOrganizations(organizations: Array<Organisation>, searchName: string): Array<Organisation> | null {
    searchName = searchName.toLowerCase();
    if (organizations) {
      return searchName ? organizations.filter(organization => organization.name.toLowerCase().includes(searchName)) : organizations;
    } else {
      return null;
    }
  }
}
