import { Injectable } from '@angular/core';
import { ID, transaction } from '@datorama/akita';
import { CollectionOrganization, EntriesService } from '../../shared/openapi';
import { CurrentCollectionsStore } from './current-collections.store';

@Injectable({ providedIn: 'root' })
export class CurrentCollectionsService {
  constructor(private currentCollectionsStore: CurrentCollectionsStore, private entriesService: EntriesService) {}

  @transaction()
  get(id: number) {
    if (id) {
      this.entriesService.entryCollections(id).subscribe((CollectionOrganizations: Array<CollectionOrganization>) => {
        this.currentCollectionsStore.remove();
        this.currentCollectionsStore.set(CollectionOrganizations);
      });
    } else {
      this.currentCollectionsStore.remove();
    }
  }

  add(currentCollection: CollectionOrganization) {
    this.currentCollectionsStore.add(currentCollection);
  }

  update(id: ID, currentCollection: Partial<CollectionOrganization>) {
    this.currentCollectionsStore.update(id, currentCollection);
  }

  remove(id: ID) {
    this.currentCollectionsStore.remove(id);
  }
}
