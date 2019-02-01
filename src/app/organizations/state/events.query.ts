import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { EventsStore, EventsState } from './events.store';
import { Event } from '../../shared/swagger';
import { Observable } from 'rxjs';

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
