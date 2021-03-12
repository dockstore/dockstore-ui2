import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Organization } from '../../shared/swagger';
import { OrganizationsState, OrganizationsStore } from './organizations.store';

@Injectable({ providedIn: 'root' })
export class OrganizationsQuery extends Query<OrganizationsState> {
  organizations$: Observable<Array<Organization>> = this.select((state) => state.organizations);
  searchName$: Observable<string> = this.select((state) => state.searchName);
  sortBy$: Observable<'starred' | 'name'> = this.select((state) => state.sortBy);
  orgsLength$: Observable<number> = this.organizations$.pipe(map((orgs) => orgs.length));
  filteredOrganizations$: Observable<Array<Organization>> = combineLatest([this.organizations$, this.searchName$, this.sortBy$]).pipe(
    map(([organizations, searchName, sortBy]: [Array<Organization>, string, 'starred' | 'name']) => {
      return this.filterAndSortOrganizations(organizations, searchName, sortBy);
    })
  );

  // loading$ is currently not being used because the alertQuery global loading is used instead
  // loading$: Observable<boolean> = this.loading$;
  constructor(protected store: OrganizationsStore) {
    super(store);
  }

  /**
   * Filters the organizations based on a string
   * Case insensitive
   * Partial match
   * Searches the name, description, displayName, location, and topic of each organization (does not search its collections)
   *
   * @param {Array<Organization> | null} organizations  List of all approved organizations
   * @param {string} searchName                  Search string
   * @returns {(Array<Organization> | null)}     Array of organizations that have been filtered by string
   * @memberof OrganizationsQuery
   */
  filterOrganizations(organizations: Array<Organization> | null, searchName: string): Array<Organization> | null {
    if (organizations) {
      const lowerCaseSearchName: string = searchName.toLowerCase();
      return lowerCaseSearchName
        ? organizations.filter((organization) => {
            const matchOptions: string[] = [
              organization.description,
              organization.displayName,
              organization.location,
              organization.name,
              organization.topic,
            ].filter((matchOption) => !!matchOption);
            return matchOptions.some((stringIdentifier) => stringIdentifier.toLowerCase().includes(lowerCaseSearchName));
          })
        : organizations;
    }
    return null;
  }

  /**
   * Filters the organizations based on a string, and sort the organizations based on either number of stars or name
   * Case insensitive
   * Partial match
   * Searches the name, description, displayName, location, and topic of each organization (does not search its collections)
   * Also able to sort the organizations by name alphabetically or by number of stars
   *
   * @param {Array<Organization> | null} organizations  List of all approved organizations
   * @param {string} searchName                  Search string
   * @param {'starred' | 'name'} sortBy          Sort by either 'name' or 'starred'
   * @returns {(Array<Organization> | null)}     Array of organizations that have been filtered by string
   * @memberof OrganizationsQuery
   */
  filterAndSortOrganizations(
    organizations: Array<Organization> | null,
    searchName: string,
    sortBy: 'starred' | 'name'
  ): Array<Organization> | null {
    if (organizations) {
      let newOrganizations = this.filterOrganizations(organizations, searchName);
      const arrayForSort = [...newOrganizations];
      if (sortBy === 'name') {
        arrayForSort.sort((a, b) => (a.displayName < b.displayName ? -1 : 1));
        newOrganizations = arrayForSort;
      } else if (sortBy === 'starred') {
        arrayForSort.sort((a, b) => (a.starredUsers.length < b.starredUsers.length ? 1 : -1));
        newOrganizations = arrayForSort;
      }
      return newOrganizations;
    }
    return null;
  }
}
