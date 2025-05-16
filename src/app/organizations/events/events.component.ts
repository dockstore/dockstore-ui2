import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Event } from '../../shared/openapi';
import { EventsQuery } from '../state/events.query';
import { EventsService } from '../state/events.service';
import { RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { NgFor, NgIf, AsyncPipe, DatePipe } from '@angular/common';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  standalone: true,
  imports: [MatCardModule, LoadingComponent, FlexModule, NgFor, MatChipsModule, MatTooltipModule, RouterLink, NgIf, AsyncPipe, DatePipe],
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
