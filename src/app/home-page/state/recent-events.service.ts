import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { Event, EventsService, User } from 'app/shared/openapi';
import { finalize, tap } from 'rxjs/operators';
import { RecentEventsStore } from './recent-events.store';

@Injectable({ providedIn: 'root' })
export class RecentEventsService {
  constructor(private recentEventsStore: RecentEventsStore, private eventsService: EventsService) {}

  get(user?: User) {
    this.recentEventsStore.setLoading(true);
    const events = user ? this.eventsService.getUserEvents(user.id, 'PROFILE') : this.eventsService.getEvents('PROFILE');
    events
      .pipe(
        finalize(() => this.recentEventsStore.setLoading(false)),
        tap((allStarredEvents) => {
          this.recentEventsStore.set(allStarredEvents);
        })
      )
      .subscribe();
  }

  add(recentEvent: Event) {
    this.recentEventsStore.add(recentEvent);
  }

  update(id: ID, recentEvent: Partial<Event>) {
    this.recentEventsStore.update(id, recentEvent);
  }

  remove(id: ID) {
    this.recentEventsStore.remove(id);
  }
}
