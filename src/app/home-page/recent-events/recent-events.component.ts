import { Component, OnInit } from '@angular/core';
import { ID } from '@datorama/akita';
import { Event } from 'app/shared/openapi';
import { Observable } from 'rxjs';
import { RecentEventsQuery } from '../state/recent-events.query';
import { RecentEventsService } from '../state/recent-events.service';

@Component({
  selector: 'recent-events',
  templateUrl: '../../organizations/events/events.component.html',
  styleUrls: ['../../organizations/events/events.component.scss']
})
export class RecentEventsComponent implements OnInit {
  events$: Observable<Event[]>;
  loading$: Observable<boolean>;
  EventType = Event.TypeEnum;
  constructor(private recentEventsQuery: RecentEventsQuery, private recentEventsService: RecentEventsService) {}

  ngOnInit() {
    this.events$ = this.recentEventsQuery.selectAll();
    this.loading$ = this.recentEventsQuery.selectLoading();

    this.recentEventsService.get().subscribe({
      error(err) {
        this.error = err;
      }
    });
  }

  add(recentEvent: Event) {
    this.recentEventsService.add(recentEvent);
  }

  update(id: ID, recentEvent: Partial<Event>) {
    this.recentEventsService.update(id, recentEvent);
  }

  remove(id: ID) {
    this.recentEventsService.remove(id);
  }
}
