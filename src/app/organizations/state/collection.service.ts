import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CollectionStore } from './collection.store';
import { transaction } from '@datorama/akita';
import { UrlSegment, Router, PRIMARY_OUTLET } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Collection, OrganisationsService } from '../../shared/swagger';

@Injectable({ providedIn: 'root' })
export class CollectionService {

  constructor(private collectionStore: CollectionStore,
              private http: HttpClient, private router: Router, private organizationsService: OrganisationsService) {
  }

  getCollectionId(): number {
    const thing: Array<UrlSegment> = this.router.parseUrl(this.router.url).root.children[PRIMARY_OUTLET].segments;
    const collectionId = thing[thing.length - 1];
    return parseInt(collectionId.path, 10);
  }

  getOrganizationId(): number {
    const thing: Array<UrlSegment> = this.router.parseUrl(this.router.url).root.children[PRIMARY_OUTLET].segments;
    const collectionId = thing[1];
    return parseInt(collectionId.path, 10);
  }

  clearState(): void {
    this.collectionStore.setState(state => {
      return {
        ...state,
        collection: null
      };
    });
  }

  updateCollection(collection: Collection) {
    this.collectionStore.setState(state => {
      return {
        ...state,
        collection: collection,
      };
    });
  }

  @transaction()
  updateCollectionFromName() {
    this.clearState();
    const collectionId = this.getCollectionId();
    const organizationId = this.getOrganizationId();
    this.collectionStore.setLoading(true);
    this.organizationsService.getCollectionById(organizationId, collectionId).pipe(finalize(() => this.collectionStore.setLoading(false)))
    .subscribe((collection: Collection) => {
      this.collectionStore.setError(false);
      this.updateCollection(collection);
    }, () => {
      this.collectionStore.setError(true);
    });
  }
}
