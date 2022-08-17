import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { Base } from 'app/shared/base';
import { Event, UsersService, EventsService } from 'app/shared/openapi';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-starred-box',
  templateUrl: './starred-box.component.html',
  styleUrls: ['./starred-box.component.scss'],
})
export class StarredBoxComponent extends Base implements OnInit {
  totalStarredWorkflows: number = 0;
  totalStarredTools: number = 0;
  totalStarredServices: number = 0;
  totalStarredOrganizations: number = 0;
  events: Array<Event> = [];
  public isLoading = true;
  EventType = Event.TypeEnum;
  readonly supportedEventTypes = [
    Event.TypeEnum.ADDVERSIONTOENTRY,
    Event.TypeEnum.CREATECOLLECTION,
    Event.TypeEnum.ADDTOCOLLECTION,
    Event.TypeEnum.PUBLISHENTRY,
    Event.TypeEnum.UNPUBLISHENTRY,
    Event.TypeEnum.MODIFYCOLLECTION,
    Event.TypeEnum.ADDUSERTOORG,
  ];

  constructor(private usersService: UsersService, private eventsService: EventsService, private alertService: AlertService) {
    super();
  }

  ngOnInit(): void {
    this.getMyEvents();
    this.usersService.getStarredServices().subscribe((starredServices) => {
      this.totalStarredServices = starredServices.length;
    });
    this.usersService.getStarredTools().subscribe((starredTools) => {
      this.totalStarredTools = starredTools.length;
    });
    this.usersService.getStarredWorkflows().subscribe((starredWorkflows) => {
      this.totalStarredWorkflows = starredWorkflows.length;
    });
    this.usersService.getStarredOrganizations().subscribe((starredOrganizations) => {
      this.totalStarredOrganizations = starredOrganizations.length;
    });
  }

  getMyEvents() {
    this.eventsService
      .getEvents('ALL_STARRED')
      .pipe(
        finalize(() => (this.isLoading = false)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        (events) => {
          events
            .filter((event) => this.supportedEventTypes.includes(event.type))
            .forEach((ev: Event) => {
              if (this.events.length < 4) {
                this.events.push(ev);
              }
            });
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
        }
      );
  }
}
