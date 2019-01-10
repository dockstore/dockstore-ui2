import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { CreateCollectionStore, CreateCollectionState } from './create-collection.store';

@Injectable({ providedIn: 'root' })
export class CreateCollectionQuery extends Query<CreateCollectionState> {

  constructor(protected store: CreateCollectionStore) {
    super(store);
  }

}
