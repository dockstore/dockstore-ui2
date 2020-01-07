import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Event } from 'app/shared/swagger';

export interface RecentEventsState extends EntityState<Event> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'recent-events' })
export class RecentEventsStore extends EntityStore<RecentEventsState> {
  constructor() {
    super();
  }
}
