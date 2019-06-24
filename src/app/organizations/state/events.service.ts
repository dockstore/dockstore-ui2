import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventsStore } from './events.store';
import { Event } from '../../shared/swagger';
import { OrganizationsService } from '../../shared/swagger';
import { finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EventsService {
  constructor(private eventsStore: EventsStore, private http: HttpClient, private organizationsService: OrganizationsService) {}

  /**
   * Retrieves the events for an organization from the database and updates the entityStore
   */
  updateOrganizationEvents(id: number): void {
    this.eventsStore.setLoading(true);
    this.organizationsService
      .getOrganizationEvents(id, 0, 30)
      .pipe(finalize(() => this.eventsStore.setLoading(false)))
      .subscribe(
        (organizationEvents: Array<Event>) => {
          const EventType = Event.TypeEnum;
          const importantEvents = [
            EventType.CREATEORG,
            EventType.APPROVEORGINVITE,
            EventType.MODIFYORG,
            EventType.CREATECOLLECTION,
            EventType.MODIFYCOLLECTION,
            EventType.ADDTOCOLLECTION,
            EventType.REMOVEFROMCOLLECTION
          ];
          // Only return important events
          organizationEvents = organizationEvents.filter((event: Event) => importantEvents.includes(event.type));
          // Only return at most 10 events
          organizationEvents = organizationEvents.slice(0, 10);
          this.eventsStore.set(organizationEvents);
        },
        () => {
          this.eventsStore.setError(true);
        }
      );
  }
}
