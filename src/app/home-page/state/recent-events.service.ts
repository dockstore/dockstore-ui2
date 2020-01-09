import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { Event, EventsService } from 'app/shared/openapi';
import { tap } from 'rxjs/operators';
import { RecentEventsStore } from './recent-events.store';

@Injectable({ providedIn: 'root' })
export class RecentEventsService {
  constructor(private recentEventsStore: RecentEventsStore, private eventsService: EventsService) {}

  get() {
    return this.eventsService.getEvents('ALL_STARRED').pipe(
      tap(allStarredEvents => {
        this.recentEventsStore.set(allStarredEvents);
      })
    );
  }

  add(recentEvent: Event) {
    this.recentEventsStore.add(recentEvent);
  }

  update(id, recentEvent: Partial<Event>) {
    this.recentEventsStore.update(id, recentEvent);
  }

  remove(id: ID) {
    this.recentEventsStore.remove(id);
  }
}
