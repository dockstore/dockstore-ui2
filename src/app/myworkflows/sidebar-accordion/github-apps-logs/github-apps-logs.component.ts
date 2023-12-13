import { animate, state, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { LambdaEvent, LambdaEventsService } from 'app/shared/openapi';
import { debounceTime, distinctUntilChanged, finalize, takeUntil, tap } from 'rxjs/operators';
import { MapFriendlyValuesPipe } from '../../../search/map-friendly-values.pipe';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { formInputDebounceTime } from '../../../shared/constants';
import { HttpResponse } from '@angular/common/http';
import { PaginatorService } from '../../../shared/state/paginator.service';
import { PaginatorQuery } from '../../../shared/state/paginator.query';
import { Base } from '../../../shared/base';

/**
 * Based on https://material.angular.io/components/table/examples example with expandable rows
 * TODO: Add backend pagination
 * @export
 * @class GithubAppsLogsComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-github-apps-logs',
  templateUrl: './github-apps-logs.component.html',
  styleUrls: ['./github-apps-logs.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class GithubAppsLogsComponent extends Base implements OnInit, AfterViewInit {
  datePipe: DatePipe;
  columnsToDisplay: string[];
  displayedColumns: string[];
  lambdaEvents: LambdaEvent[] | null;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  loading = true;
  public LambdaEvent = LambdaEvent;
  dataSource: MatTableDataSource<LambdaEvent> = new MatTableDataSource();
  expandedElement: LambdaEvent | null;
  showContent: 'table' | 'error' | 'empty' | 'noResult' | null;
  type: 'workflow' | 'tool' | 'lambdaEvent' = 'lambdaEvent';
  private eventsSubject$ = new BehaviorSubject<LambdaEvent[]>([]);
  public eventsLength$ = new BehaviorSubject<number>(0);

  public pageSize$: Observable<number>;
  public pageIndex$: Observable<number>;
  private sortCol: string;
  private sortDirection: string;
  private pageFilter: string;

  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  constructor(
    @Inject(MAT_DIALOG_DATA) public matDialogData: { userId?: number; organization?: string },
    private paginatorService: PaginatorService,
    private lambdaEventsService: LambdaEventsService,
    private matSnackBar: MatSnackBar,
    private mapPipe: MapFriendlyValuesPipe,
    private paginatorQuery: PaginatorQuery
  ) {
    super();
    this.datePipe = new DatePipe('en');
    const defaultPredicate = this.dataSource.filterPredicate;
    this.dataSource.filterPredicate = (data, filter) => {
      const formattedDate = this.datePipe.transform(data.eventDate, 'yyyy-MM-ddTHH:mm').toLowerCase();
      const formattedStatus = this.mapPipe.transform('success', String(data.success)).toLowerCase();
      return formattedDate.indexOf(filter) >= 0 || formattedStatus.indexOf(filter) >= 0 || defaultPredicate(data, filter);
    };
  }

  ngOnInit() {
    this.columnsToDisplay = this.matDialogData.userId
      ? ['organization', 'repository', 'entryName', 'deliveryId', 'reference', 'success', 'type']
      : ['repository', 'entryName', 'deliveryId', 'reference', 'success', 'type'];
    this.displayedColumns = ['eventDate', 'githubUsername', ...this.columnsToDisplay];
    this.loading = true;
  }

  ngAfterViewInit() {
    this.loadAppsLogs();
  }

  loadAppsLogs() {
    this.dataSource.sort = this.sort;
    this.pageSize$ = this.paginatorQuery.eventPageSize$;
    this.pageIndex$ = this.paginatorQuery.eventPageIndex$;

    // Initial load
    this.loadEvents(this.paginator.pageIndex * this.paginator.pageSize, this.paginator.pageSize, null, null, null);
    this.paginatorService.setPaginator(this.type, this.paginator.pageSize, this.paginator.pageIndex);

    // Handle paginator changes
    merge(this.paginator.page)
      .pipe(distinctUntilChanged())
      .subscribe(() => {
        this.loadEvents(
          this.paginator.pageIndex * this.paginator.pageSize, // set offset to the new pageIndex * the page size
          this.paginator.pageSize,
          this.pageFilter,
          this.sortDirection,
          this.sortCol
        );
        this.paginatorService.setPaginator(this.type, this.paginator.pageSize, this.paginator.pageIndex);
      });

    // Handle sort changes
    this.sort.sortChange
      .pipe(
        tap(() => {
          this.paginator.pageIndex = 0; // go back to first page after changing sort
          if (this.sort.active === 'eventDate') {
            this.sortCol = 'dbCreateDate';
          } else {
            this.sortCol = this.sort.active;
          }
          if (this.sort.direction == '') {
            this.sortCol = null;
            this.sortDirection = null;
          }
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        this.loadEvents(this.paginator.pageIndex, this.paginator.pageSize, this.pageFilter, this.sort.direction, this.sortCol);
      });

    // Handle input text field changes
    fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(
        debounceTime(formInputDebounceTime),
        distinctUntilChanged(),
        tap(() => {
          this.sortDirection = this.sort.direction;
          this.pageFilter = this.filter.nativeElement.value;
          this.paginator.pageIndex = 0; //go back to first page after adding filter
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        this.loadEvents(this.paginator.pageIndex, this.paginator.pageSize, this.pageFilter, this.sort.direction, this.sortCol);
      });
  }

  loadEvents(pageIndex: number, pageSize: number, filter: string, sortDirection: string, sortCol: string) {
    const filtered = filter?.length > 0;
    let lambdaEvents: Observable<HttpResponse<LambdaEvent[]>>;
    if (this.matDialogData.userId) {
      lambdaEvents = this.lambdaEventsService.getUserLambdaEvents(
        this.matDialogData.userId,
        pageIndex,
        pageSize,
        filter,
        sortCol,
        sortDirection,
        'response'
      );
    } else {
      lambdaEvents = this.lambdaEventsService.getLambdaEventsByOrganization(
        this.matDialogData.organization,
        pageIndex,
        pageSize,
        filter,
        sortCol,
        sortDirection,
        'response'
      );
    }
    lambdaEvents
      .pipe(
        finalize(() => {
          this.loading = false;
          this.updateContentToShow(this.lambdaEvents, filtered);
        })
      )
      .subscribe(
        (lambdaEvents) => {
          this.eventsSubject$.next((this.lambdaEvents = lambdaEvents.body));
          this.eventsLength$.next(Number(lambdaEvents.headers.get('X-total-count')));
        },
        (error) => {
          this.lambdaEvents = null;
          this.dataSource.data = [];
          const detailedErrorMessage = AlertService.getDetailedErrorMessage(error);
          this.matSnackBar.open(detailedErrorMessage);
        }
      );
  }

  updateContentToShow(lambdaEvents: LambdaEvent[] | null, filtered: boolean) {
    this.dataSource.data = lambdaEvents ? lambdaEvents : [];
    if (!lambdaEvents) {
      this.showContent = 'error';
    } else if (lambdaEvents.length === 0 && !filtered) {
      this.showContent = 'empty';
    } else if (lambdaEvents.length === 0 && filtered) {
      this.showContent = 'noResult';
    } else {
      this.showContent = 'table';
    }
  }
}
