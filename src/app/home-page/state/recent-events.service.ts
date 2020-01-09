import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { Event, EventsService } from 'app/shared/openapi';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RecentEventsStore } from './recent-events.store';

@Injectable({ providedIn: 'root' })
export class RecentEventsService {
  constructor(private recentEventsStore: RecentEventsStore, private eventsService: EventsService) {}

  get() {
    return forkJoin([this.eventsService.getEvents('STARRED_ENTRIES'), this.eventsService.getEvents('STARRED_ORGANIZATION')]).pipe(
      tap(([starredEntriesEvents, starredOrganizationEvents]) => {
        const allStarredEvents: Array<Event> = this.cleanUpEvents(starredEntriesEvents, starredOrganizationEvents);
        this.recentEventsStore.set(allStarredEvents);
      })
    );
  }

  private cleanUpEvents(starredEntriesEvents: Event[], starredOrganizationEvents: Event[]) {
    let allStarredEvents: Array<Event> = [];
    // TODO: Need a less terrible way of getting unique events
    allStarredEvents = allStarredEvents.concat(starredEntriesEvents);
    const ids = allStarredEvents.map(ent => ent.id);
    starredOrganizationEvents.forEach(entity => {
      if (!ids.includes(entity.id)) {
        allStarredEvents.push(entity);
      }
    });
    allStarredEvents.sort((a, b) => +b.dbCreateDate - +a.dbCreateDate);
    return allStarredEvents;
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
