import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Event } from '../../shared/swagger';

export interface EventsState extends EntityState<Event> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'events' })
export class EventsStore extends EntityStore<EventsState, Event> {
  constructor() {
    super();
  }
}
