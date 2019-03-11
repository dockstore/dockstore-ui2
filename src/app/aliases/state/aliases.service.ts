import { Injectable } from '@angular/core';
import { AliasesStore } from './aliases.store';
import { OrganizationsService, Organization, Collection } from '../../shared/swagger';
import { transaction } from '@datorama/akita';
import { finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AliasesService {

  constructor(private aliasesStore: AliasesStore,
              private organizationsService: OrganizationsService) {
  }

  clearState(): void {
    this.aliasesStore.setState(state => {
      return {
        ...state,
        organization: null,
        collection: null
      }
    });
  }

  @transaction()
  updateOrganizationFromAlias(alias: string): void {
    this.clearState();
    this.aliasesStore.setLoading(true);
    this.organizationsService.getOrganizationByAlias(alias).pipe(finalize(() => this.aliasesStore.setLoading(false)))
      .subscribe((organization: Organization) => {
        this.aliasesStore.setError(false);
        this.updateOrganization(organization);
      }, () => {
        this.aliasesStore.setError(true);
      });
  }

  updateOrganization(organization: Organization) {
    this.aliasesStore.setState(state => {
      return {
        ...state,
        organization: organization,
      };
    });
  }

  @transaction()
  updateCollectionFromAlias(alias: string): void {
    this.clearState();
    this.aliasesStore.setLoading(true);
    this.organizationsService.getCollectionByAlias(alias).pipe(finalize(() => this.aliasesStore.setLoading(false)))
      .subscribe((collection: Collection) => {
        this.aliasesStore.setError(false);
        this.updateCollection(collection);
      }, () => {
        this.aliasesStore.setError(true);
      });
  }

  updateCollection(collection: Collection) {
    this.aliasesStore.setState(state => {
      return {
        ...state,
        collection: collection,
      };
    });
  }

}
