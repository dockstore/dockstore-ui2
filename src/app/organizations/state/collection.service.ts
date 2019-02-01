import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CollectionStore } from './collection.store';
import { transaction } from '@datorama/akita';
import { UrlSegment, Router, PRIMARY_OUTLET } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Collection, OrganisationsService } from '../../shared/swagger';
import { AlertService } from '../../shared/alert/state/alert.service';

@Injectable({ providedIn: 'root' })
export class CollectionService {

  constructor(private collectionStore: CollectionStore,
              private http: HttpClient, private router: Router, private organizationsService: OrganisationsService,
              private alertService: AlertService) {
  }

  getCollectionId(): number {
    const thing: Array<UrlSegment> = this.router.parseUrl(this.router.url).root.children[PRIMARY_OUTLET].segments;
    const orgIndex = thing.findIndex((urlSegment: UrlSegment) => {
      return urlSegment.path === 'collections';
    });
    const collectionId = thing[orgIndex + 1];
    if (!collectionId) {
      return undefined;
    }
    return parseInt(collectionId.path, 10);
  }

  getOrganizationId(): number {
    const thing: Array<UrlSegment> = this.router.parseUrl(this.router.url).root.children[PRIMARY_OUTLET].segments;
    const orgIndex = thing.findIndex((urlSegment: UrlSegment) => {
      return urlSegment.path === 'organizations';
    });
    const organisationId = thing[orgIndex + 1];
    if (!organisationId) {
      return undefined;
    }
    return parseInt(organisationId.path, 10);
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

  /**
   * Removes the given entry from the collection for the given organisation
   * @param organisationId
   * @param collectionId
   * @param entryId
   * @param entryName
   */
  removeEntryFromCollection(organisationId: number, collectionId: number, entryId: number, entryName: string) {
    this.alertService.start('Removing entry ' + entryName);
    this.organizationsService.deleteEntryFromCollection(organisationId, collectionId, entryId).pipe(
      finalize(() => this.collectionStore.setLoading(false)
      ))
      .subscribe((collection: Collection) => {
        this.alertService.simpleSuccess();
        this.updateCollectionFromName();
      }, () => {
        this.collectionStore.setError(true);
        this.alertService.simpleError();
      });
  }
}
