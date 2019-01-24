import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { CreateCollectionStore, CreateCollectionState } from './create-collection.store';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CreateCollectionQuery extends Query<CreateCollectionState> {
  loading$: Observable<boolean> = this.selectLoading();
  title$: Observable<string> = this.select(state => state.title);
  constructor(protected store: CreateCollectionStore) {
    super(store);
  }

}
