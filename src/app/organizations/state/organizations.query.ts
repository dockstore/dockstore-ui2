import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Organization } from '../../shared/swagger';
import { OrganizationsState, OrganizationsStore } from './organizations.store';

@Injectable({ providedIn: 'root' })
export class OrganizationsQuery extends Query<OrganizationsState> {
  organizations$: Observable<Array<Organization>> = this.select(state => state.organizations);
  searchName$: Observable<string> = this.select(state => state.searchName);
  filteredOrganizations$: Observable<Array<Organization>> = combineLatest(this.organizations$, this.searchName$).pipe(
    map(([organizations, searchName]: [Array<Organization>, string]) => {
      return this.filterOrganizations(organizations, searchName);
    })
  );

  // loading$ is currently not being used because the alertQuery global loading is used instead
  // loading$: Observable<boolean> = this.loading$;
  constructor(protected store: OrganizationsStore) {
    super(store);
  }

  /**
   * Filters the organization based on a string
   * Case insensitive
   * Partial match
   * Searches the name, description, displayName, location, and topic of each organization (does not search its collections)
   *
   * @param {Array<Organization>} organizations  List of all approved organizations
   * @param {string} searchName                  Search string
   * @returns {(Array<Organization> | null)}     Array of organizations that have been filtered by string
   * @memberof OrganizationsQuery
   */
  filterOrganizations(organizations: Array<Organization>, searchName: string): Array<Organization> | null {
    searchName = searchName.toLowerCase();
    if (organizations) {
      return searchName
        ? organizations.filter(organization => {
            const matchOptions: string[] = [
              organization.description,
              organization.displayName,
              organization.location,
              organization.name,
              organization.topic
            ].filter(matchOption => !!matchOption);
            return matchOptions.some(stringIdentifier => stringIdentifier.toLowerCase().includes(searchName));
          })
        : organizations;
    }
    return null;
  }
}
