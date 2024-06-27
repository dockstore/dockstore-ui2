import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
import { OrgLogoService } from '../../shared/org-logo.service';
import { GravatarService } from '../../gravatar/gravatar.service';
import { RecentEventsPipe } from '../../shared/entry/recent-events.pipe';
import { GravatarPipe } from '../../gravatar/gravatar.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { ImgFallbackDirective } from '../../shared/img-fallback.directive';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { NgIf, NgFor, NgSwitch, NgSwitchCase, AsyncPipe, LowerCasePipe, SlicePipe, DatePipe } from '@angular/common';
import { LoadingComponent } from '../../shared/loading/loading.component';

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
  standalone: true,
  imports: [
    LoadingComponent,
    NgIf,
    NgFor,
    FlexModule,
    RouterLink,
    NgSwitch,
    NgSwitchCase,
    ImgFallbackDirective,
    MatLegacyCardModule,
    MatIconModule,
    AsyncPipe,
    LowerCasePipe,
    SlicePipe,
    DatePipe,
    GravatarPipe,
    RecentEventsPipe,
  ],
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
  public displayLimit: number;
  private userPageDisplayLimit = 10;
  private dashboardDisplayLimit = 4;
  private supportedEventTypes: Event.TypeEnum[];
  private readonly supportedUserEventTypes = [
    Event.TypeEnum.ADDVERSIONTOENTRY,
    Event.TypeEnum.CREATECOLLECTION,
    Event.TypeEnum.ADDTOCOLLECTION,
    Event.TypeEnum.REMOVEFROMCOLLECTION,
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
    private eventsService: EventsService,
    public orgLogoService: OrgLogoService,
    public gravatarService: GravatarService
  ) {
    super();
  }

  getUserInfo(username: string): void {
    if (!this.eventType && username) {
      // On user page, get user, then get user's events
      this.usersService.listUser(username).subscribe(
        (currentUser: User) => {
          this.recentEventsService.get(currentUser);
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
        }
      );
      this.loading$ = this.recentEventsQuery.selectLoading();
      this.displayLimit = this.userPageDisplayLimit;
      this.supportedEventTypes = this.supportedUserEventTypes;
      this.getAUsersEvents();
    } else {
      // On dashboard, get my events
      this.isLoading = true;
      this.displayLimit = this.dashboardDisplayLimit;
      this.supportedEventTypes = this.eventType === 'SELF_ORGANIZATIONS' ? this.supportedOrgEventTypes : this.supportedStarredEventTypes;
      this.getMyEventsByType();
    }
  }

  /**
   * Get another user's events when viewing their user page
   */
  private getAUsersEvents() {
    this.recentEventsQuery
      .selectAll()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((events) => {
        this.events = this.filterByEventType(events);
      });
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
          this.events = this.filterByEventType(events);
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
        }
      );
  }

  /**
   * Filter events by supported event types
   * @param events
   * @returns Event[]
   */
  private filterByEventType(events: Event[]): Event[] {
    return events.filter((event) => this.supportedEventTypes.includes(event.type));
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

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => this.getUserInfo(params['username']));
  }
}
