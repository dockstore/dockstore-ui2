import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Event } from '../../shared/swagger';
import { EventsQuery } from '../state/events.query';
import { EventsService } from '../state/events.service';

@Component({
  selector: 'events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit, OnChanges {
  @Input() organizationID: number;
  events$: Observable<Array<Event>>;
  loading$: Observable<boolean>;
  EventType = Event.TypeEnum;

  constructor(private eventsQuery: EventsQuery, private eventsService: EventsService) {}

  ngOnInit() {
    this.loading$ = this.eventsQuery.loading$;
    this.events$ = this.eventsQuery.organizationEvents$;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.eventsService.updateOrganizationEvents(this.organizationID);
  }
}
