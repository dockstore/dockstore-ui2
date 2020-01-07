import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { RecentEventsState, RecentEventsStore } from './recent-events.store';

@Injectable({ providedIn: 'root' })
export class RecentEventsQuery extends QueryEntity<RecentEventsState> {
  constructor(protected store: RecentEventsStore) {
    super(store);
  }
}
