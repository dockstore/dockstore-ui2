import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Observable } from 'rxjs';

import { CreateCollectionState, CreateCollectionStore } from './create-collection.store';

@Injectable({ providedIn: 'root' })
export class CreateCollectionQuery extends Query<CreateCollectionState> {
  loading$: Observable<boolean> = this.selectLoading();
  title$: Observable<string> = this.select((state) => state.title);
  saveLabel$: Observable<string> = this.select((state) => state.saveLabel);
  constructor(protected store: CreateCollectionStore) {
    super(store);
  }
}
