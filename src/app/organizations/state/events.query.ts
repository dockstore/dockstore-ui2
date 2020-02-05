import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { Event } from '../../shared/swagger';
import { EventsState, EventsStore } from './events.store';

@Injectable({
  providedIn: 'root'
})
export class EventsQuery extends QueryEntity<EventsState, Event> {
  organizationEvents$: Observable<Array<Event>> = this.selectAll();
  loading$: Observable<boolean> = this.selectLoading();

  constructor(protected store: EventsStore) {
    super(store);
  }
}
