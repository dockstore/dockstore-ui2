import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { HttpClient } from '@angular/common/http';
import { EventsStore, EventsState } from './events.store';
import { Event } from '../../shared/swagger';
import { OrganisationsService } from '../../shared/swagger';
import { finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EventsService {

  constructor(private eventsStore: EventsStore,
              private http: HttpClient,
              private organisationsService: OrganisationsService) {
  }

  /**
   * Retrieves the events for an organization from the database and updates the entryStore
   */
  updateOrganizationEvents(id: number): void {
    this.organisationsService.getOrganisationEvents(id).pipe(
      finalize(() => this.eventsStore.setLoading(false)
      ))
    .subscribe((organizationEvents: Array<Event>) => {
      this.eventsStore.set(organizationEvents);
    }, () => {
      this.eventsStore.setError(true);
    });
  }
}
