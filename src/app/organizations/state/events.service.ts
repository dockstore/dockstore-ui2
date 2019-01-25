import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { HttpClient } from '@angular/common/http';
import { EventsStore, EventsState } from './events.store';
import { Event } from '../../shared/swagger';
import { AlertService } from '../../shared/alert/state/alert.service';
import { OrganisationsService } from '../../shared/swagger';
import { finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EventsService {

  constructor(private eventsStore: EventsStore,
              private http: HttpClient, private alertService: AlertService,
              private organisationsService: OrganisationsService) {
  }

  /**
   * Updates the list of events for the current organisation
   */
  updateOrginisationEvents(id: number): void {
    this.alertService.start('Getting organisation events');
    this.organisationsService.getOrganisationEvents(id).pipe(
      finalize(() => this.eventsStore.setLoading(false)
      ))
    .subscribe((organizationEvents: Array<Event>) => {
      this.updateEventsState(organizationEvents);
      this.alertService.simpleSuccess();
    }, () => {
      this.updateEventsState(null);
      this.eventsStore.setError(true);
      this.alertService.simpleError();
    });
  }

  /**
   * Updates the list of events
   * @param organizationEvents Newly updated list of pending organizations
   */
  updateEventsState(organizationEvents: Array<Event>): void {
    this.eventsStore.setState((state: EventsState) => {
      return {
        ...state,
        organizationEvents: organizationEvents
      };
    });
  }
}
