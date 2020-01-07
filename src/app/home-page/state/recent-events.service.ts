import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { Event, EventsService } from 'app/shared/swagger';
import { tap } from 'rxjs/operators';
import { RecentEventsStore } from './recent-events.store';

@Injectable({ providedIn: 'root' })
export class RecentEventsService {
  constructor(private recentEventsStore: RecentEventsStore, private eventsService: EventsService) {}

  get() {
    return this.eventsService.getEvents('STARRED_ENTRIES', 10, 0).pipe(
      tap(entities => {
        entities.sort((a, b) => +b.dbCreateDate - +a.dbCreateDate);
        this.recentEventsStore.set(entities);
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
