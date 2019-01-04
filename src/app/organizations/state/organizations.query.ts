import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { OrganizationsStore, OrganizationsState } from './organizations.store';
import { Organisation } from '../../shared/swagger';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrganizationsQuery extends Query<OrganizationsState> {
  organizations$: Observable<Array<Organisation>> = this.select(state => state.organizations);
  // loading$ is currently not being used because the alertService loading is used instead
  // loading$: Observable<boolean> = this.loading$;
  constructor(protected store: OrganizationsStore) {
    super(store);
  }

}
