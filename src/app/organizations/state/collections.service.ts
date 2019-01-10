import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CollectionsStore } from './collections.store';
import { OrganisationsService, Collection } from '../../shared/swagger';
import { finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CollectionsService {

  constructor(private collectionsStore: CollectionsStore, private organisationsService: OrganisationsService,
    private http: HttpClient) {
  }

  updateCollections(organizationID: number) {
    this.collectionsStore.setLoading(true);
    this.organisationsService.getCollectionsFromOrganisation(organizationID).pipe(
      finalize(() => this.collectionsStore.setLoading(false)))
      .subscribe((collections: Array<Collection>) => {
        this.updateCollectionsState(collections);
      }, error => {
        console.error(error);
        this.collectionsStore.setError(true);
      });
  }

  updateCollectionsState(collections: Array<Collection>) {
    this.collectionsStore.setState(state => {
      return {
        ...state,
        collections: collections
      };
    });

  }

}
