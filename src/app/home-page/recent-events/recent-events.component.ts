import { Component, OnInit } from '@angular/core';
import { ID } from '@datorama/akita';
import { Dockstore } from 'app/shared/dockstore.model';
import { Event } from 'app/shared/openapi';
import { Observable } from 'rxjs';
import { RecentEventsQuery } from '../state/recent-events.query';
import { RecentEventsService } from '../state/recent-events.service';

/**
 * Shows recent events related to starred organization and entries
 * Only shows when a child has been added to parent (version added to entry, collection added to organization, entry added to collection)
 * TODO: collapse events with the same date (refresh all adding multiple versions at the same time)
 */
@Component({
  selector: 'recent-events',
  templateUrl: './recent-events.component.html',
  styleUrls: ['./recent-events.component.scss'],
})
export class RecentEventsComponent implements OnInit {
  events$: Observable<Event[]>;
  loading$: Observable<boolean>;
  EventType = Event.TypeEnum;
  readonly starringDocUrl = `${Dockstore.DOCUMENTATION_URL}/end-user-topics/starring.html#starring-tools-and-workflows`;
  homepage = true;
  readonly supportedEventTypes = [Event.TypeEnum.ADDVERSIONTOENTRY, Event.TypeEnum.CREATECOLLECTION, Event.TypeEnum.ADDTOCOLLECTION];
  constructor(private recentEventsQuery: RecentEventsQuery, private recentEventsService: RecentEventsService) {}

  ngOnInit() {
    this.events$ = this.recentEventsQuery.selectAll({
      filterBy: (entity) => this.supportedEventTypes.includes(entity.type),
    });
    this.loading$ = this.recentEventsQuery.selectLoading();

    this.recentEventsService.get();
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
