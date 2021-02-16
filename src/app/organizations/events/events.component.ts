import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Base } from '../../shared/base';
import { Event } from '../../shared/swagger';
import { EventsQuery } from '../state/events.query';
import { EventsService } from '../state/events.service';

@Component({
  selector: 'events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent extends Base implements OnInit, OnChanges {
  @Input() organizationID: number;
  events$: Observable<Array<Event>>;
  loading$: Observable<boolean>;
  EventType = Event.TypeEnum;
  @Output() eventsLength = new EventEmitter<number>();

  constructor(private eventsQuery: EventsQuery, private eventsService: EventsService) {
    super();
  }

  ngOnInit() {
    this.loading$ = this.eventsQuery.loading$;
    this.events$ = this.eventsQuery.organizationEvents$;
    this.events$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((x) => {
      this.eventsLength.emit(x.length);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.eventsService.updateOrganizationEvents(this.organizationID);
  }
}
