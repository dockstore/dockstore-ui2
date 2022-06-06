import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ID } from '@datorama/akita';
import { Dockstore } from 'app/shared/dockstore.model';
import { Event } from 'app/shared/openapi';
import { User } from 'app/shared/openapi';
import { UserQuery } from 'app/shared/user/user.query';
import { UsersService } from 'app/shared/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { RecentEventsQuery } from '../state/recent-events.query';
import { RecentEventsService } from '../state/recent-events.service';
import { AlertService } from 'app/shared/alert/state/alert.service';

/**
 * Shows recent events related to starred organization and entries
 * Only shows when a child has been added to parent (version added to entry, collection added to organization, entry added to collection)
 * TODO: collapse events with the same date (refresh all adding multiple versions at the same time)
 */
@Component({
  selector: 'app-recent-events',
  templateUrl: './recent-events.component.html',
  styleUrls: ['./recent-events.component.scss'],
})
export class RecentEventsComponent implements OnInit {
  events$: Observable<Event[]>;
  loading$: Observable<boolean>;
  EventType = Event.TypeEnum;
  noEvents$: Observable<boolean>;
  user: User;
  username: string;
  readonly starringDocUrl = `${Dockstore.DOCUMENTATION_URL}/end-user-topics/starring.html#starring-tools-and-workflows`;
  homepage = true;
  readonly supportedEventTypes = [
    Event.TypeEnum.ADDVERSIONTOENTRY,
    Event.TypeEnum.CREATECOLLECTION,
    Event.TypeEnum.ADDTOCOLLECTION,
    Event.TypeEnum.PUBLISHENTRY,
    Event.TypeEnum.UNPUBLISHENTRY,
  ];
  constructor(
    private recentEventsQuery: RecentEventsQuery,
    private recentEventsService: RecentEventsService,
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private alertService: AlertService,
    protected userQuery: UserQuery
  ) {
    this.username = this.activatedRoute.snapshot.paramMap.get('username');
  }

  ngOnInit() {
    if (this.username) {
      this.usersService.listUser(this.username).subscribe(
        (currentUser: User) => {
          this.recentEventsService.get(currentUser);
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
        }
      );
    } else {
      this.userQuery.user$.subscribe((user: User) => {
        if (user) {
          this.recentEventsService.get(user);
        }
      });
    }

    this.events$ = this.recentEventsQuery.selectAll({
      filterBy: (entity) => this.supportedEventTypes.includes(entity.type),
    });
    this.loading$ = this.recentEventsQuery.selectLoading();
    this.noEvents$ = this.events$.pipe(map((events) => !events || events.length === 0));
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
