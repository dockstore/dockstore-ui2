import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { EventsService } from '../state/events.service';
import { EventsQuery } from '../state/events.query';
import { Event } from '../../shared/swagger';
import { Observable } from 'rxjs';
import { AlertQuery } from '../../shared/alert/state/alert.query';

@Component({
  selector: 'events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit, OnChanges {
  @Input() organizationID: number;
  events$: Observable<Array<Event>>;
  loading$: Observable<boolean>;

  constructor(private eventsQuery: EventsQuery,
              private eventsService: EventsService,
              private alertQuery: AlertQuery
  ) { }

  ngOnInit() {
    this.loading$ = this.alertQuery.showInfo$;
    this.events$ = this.eventsQuery.organizationEvents$;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.eventsService.updateOrganizationEvents(this.organizationID);
  }
}
