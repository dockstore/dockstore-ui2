import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { AddEntryStore, AddEntryState } from './add-entry.store';
import { Observable } from 'rxjs';
import { Collection, OrganizationUser } from '../../../shared/swagger';

@Injectable({ providedIn: 'root' })
export class AddEntryQuery extends Query<AddEntryState> {
  memberships$: Observable<Array<OrganizationUser>> = this.select(state => state.memberships);
  collections$: Observable<Array<Collection>> = this.select(state => state.collections);
  isLoading$: Observable<boolean> = this.selectLoading();
  constructor(protected store: AddEntryStore) {
    super(store);
  }

}
