import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ID } from '@datorama/akita';
import { Dockstore } from 'app/shared/dockstore.model';
import { Event, User, UsersService, EventsService } from 'app/shared/openapi';
import { HttpErrorResponse } from '@angular/common/http';
import { RecentEventsQuery } from '../state/recent-events.query';
import { RecentEventsService } from '../state/recent-events.service';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { EntryType } from '../../shared/enum/entry-type';
import { finalize, takeUntil } from 'rxjs/operators';
import { Base } from 'app/shared/base';
import { Observable } from 'rxjs';

/**
 * Shows recent events related to starred organization and entries or user organization events
 * If no eventType input, will default to displaying events for the user being viewed (user page)
 *
 * Only shows when a child has been added to parent (version added to entry, collection added to organization, entry added to collection)
 * TODO: collapse events with the same date (refresh all adding multiple versions at the same time)
 */
@Component({
  selector: 'app-recent-events',
  templateUrl: './recent-events.component.html',
  styleUrls: ['../../shared/styles/dashboard-boxes.scss'],
})
export class RecentEventsComponent extends Base implements OnInit {
  @Input() eventType: 'SELF_ORGANIZATIONS' | 'ALL_STARRED';
  // For eventsService loading
  public isLoading: boolean;
  // For recentEventsQuery loading
  public loading$: Observable<boolean>;
  public events: Event[];
  public EventType = Event.TypeEnum;
  public EntryType = EntryType;
  public readonly starringDocUrl = `${Dockstore.DOCUMENTATION_URL}/end-user-topics/starring.html#starring-tools-and-workflows`;
  private username: string;
  private supportedEventTypes: string[];
  private readonly supportedUserEventTypes = [
    Event.TypeEnum.ADDVERSIONTOENTRY,
    Event.TypeEnum.CREATECOLLECTION,
    Event.TypeEnum.ADDTOCOLLECTION,
    Event.TypeEnum.PUBLISHENTRY,
    Event.TypeEnum.UNPUBLISHENTRY,
    Event.TypeEnum.MODIFYCOLLECTION,
    Event.TypeEnum.DELETECOLLECTION,
    Event.TypeEnum.CREATEORG,
  ];
  private readonly supportedStarredEventTypes = [
    Event.TypeEnum.ADDVERSIONTOENTRY,
    Event.TypeEnum.CREATECOLLECTION,
    Event.TypeEnum.ADDTOCOLLECTION,
    Event.TypeEnum.PUBLISHENTRY,
    Event.TypeEnum.UNPUBLISHENTRY,
    Event.TypeEnum.MODIFYCOLLECTION,
    Event.TypeEnum.ADDUSERTOORG,
    Event.TypeEnum.MODIFYORG,
    Event.TypeEnum.DELETECOLLECTION,
    Event.TypeEnum.REMOVEFROMCOLLECTION,
  ];
  private readonly supportedOrgEventTypes = [
    Event.TypeEnum.CREATEORG,
    Event.TypeEnum.MODIFYORG,
    Event.TypeEnum.APPROVEORG,
    Event.TypeEnum.REREQUESTORG,
    Event.TypeEnum.REJECTORG,
    Event.TypeEnum.ADDUSERTOORG,
    Event.TypeEnum.APPROVEORGINVITE,
    Event.TypeEnum.CREATECOLLECTION,
    Event.TypeEnum.MODIFYCOLLECTION,
    Event.TypeEnum.DELETECOLLECTION,
    Event.TypeEnum.REMOVEFROMCOLLECTION,
    Event.TypeEnum.ADDTOCOLLECTION,
  ];

  constructor(
    private recentEventsQuery: RecentEventsQuery,
    private recentEventsService: RecentEventsService,
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private alertService: AlertService,
    private eventsService: EventsService
  ) {
    super();
    this.username = this.activatedRoute.snapshot.paramMap.get('username');
  }

  ngOnInit() {
    if (!this.eventType && this.username) {
      // On user page, get user, then get user's events
      this.usersService.listUser(this.username).subscribe(
        (currentUser: User) => {
          this.recentEventsService.get(currentUser);
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
        }
      );
      this.getAUsersEvents();
      this.loading$ = this.recentEventsQuery.selectLoading();
    } else {
      // On dashboard, get my events
      this.isLoading = true;
      this.supportedEventTypes = this.eventType === 'SELF_ORGANIZATIONS' ? this.supportedOrgEventTypes : this.supportedStarredEventTypes;
      this.getMyEventsByType();
    }
  }

  /**
   * Get another user's events when viewing their user page
   */
  private getAUsersEvents() {
    this.recentEventsQuery.selectAll({ filterBy: (entity) => this.supportedUserEventTypes.includes(entity.type) }).subscribe(
      (events) => {
        this.events = events;
      },
      (error: HttpErrorResponse) => {
        this.alertService.detailedError(error);
      }
    );
  }

  /**
   * Get my events based on eventType input
   */
  private getMyEventsByType() {
    this.eventsService
      .getEvents(this.eventType)
      .pipe(
        finalize(() => (this.isLoading = false)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        (events) => {
          this.events = events.filter((event) => this.supportedEventTypes.includes(event.type)).slice(0, 4);
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
        }
      );
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
