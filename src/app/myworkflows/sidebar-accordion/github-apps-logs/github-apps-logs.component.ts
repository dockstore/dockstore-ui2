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
import { LambdaEventDataSource, ShowContent } from './lambda-events-datasource';

/**
 * Based on https://material.angular.io/components/table/examples example with expandable rows
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
  public showContent$: Observable<ShowContent>;
  public eventsLength$: Observable<number>;
  type: 'workflow' | 'tool' | 'lambdaEvent' = 'lambdaEvent';

  public pageSize$: Observable<number>;
  public pageIndex$: Observable<number>;
  private sortCol: string;
  private sortDirection: string;
  private pageFilter: string;

  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  public lambdaEventDataSource: LambdaEventDataSource;

  constructor(
    @Inject(MAT_DIALOG_DATA) public matDialogData: { userId?: number; organization?: string },
    private paginatorService: PaginatorService,
    private lambdaEventsService: LambdaEventsService,
    private matSnackBar: MatSnackBar,
    private mapPipe: MapFriendlyValuesPipe,
    private paginatorQuery: PaginatorQuery,
    private alertService: AlertService
  ) {
    super();
    this.datePipe = new DatePipe('en');
    const defaultPredicate = this.dataSource.filterPredicate;
    // this.dataSource.filterPredicate = (data, filter) => {
    //   const formattedDate = this.datePipe.transform(data.eventDate, 'yyyy-MM-ddTHH:mm').toLowerCase();
    //   const formattedStatus = this.mapPipe.transform('success', String(data.success)).toLowerCase();
    //   return formattedDate.indexOf(filter) >= 0 || formattedStatus.indexOf(filter) >= 0 || defaultPredicate(data, filter);
    // };
  }

  ngOnInit() {
    this.lambdaEventDataSource = new LambdaEventDataSource(this.lambdaEventsService);
    this.showContent$ = this.lambdaEventDataSource.showContent$;
    this.eventsLength$ = this.lambdaEventDataSource.eventsLength$;
    this.columnsToDisplay = this.matDialogData.userId
      ? ['organization', 'repository', 'entryName', 'deliveryId', 'reference', 'success', 'type']
      : ['repository', 'entryName', 'deliveryId', 'reference', 'success', 'type'];
    this.displayedColumns = ['eventDate', 'githubUsername', ...this.columnsToDisplay];
  }

  ngAfterViewInit() {
    this.lambdaEventDataSource.events$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(null, (error) => this.alertService.detailedError(error));
    this.loadAppsLogs();
  }

  loadAppsLogs() {
    this.loadEvents();
    this.paginatorService.setPaginator(this.type, this.paginator.pageSize, this.paginator.pageIndex);

    // Handle paginator changes
    merge(this.paginator.page)
      .pipe(distinctUntilChanged(), takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.loadEvents();
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
          if (this.sort.direction === '') {
            this.sortCol = null;
            this.sortDirection = null;
          }
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        this.loadEvents();
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
        this.loadEvents();
      });
  }

  private loadEvents() {
    this.lambdaEventDataSource.loadEvents(
      this.paginator.pageIndex * this.paginator.pageSize,
      this.paginator.pageSize,
      this.pageFilter,
      this.mapSortOrder(this.sortDirection),
      this.sortCol,
      this.matDialogData.userId,
      this.matDialogData.organization
    );
  }

  mapSortOrder(rawSortOrder: string): 'asc' | 'desc' {
    let direction: 'asc' | 'desc';
    switch (this.sort.direction) {
      case 'asc': {
        direction = 'asc';
        break;
      }
      case 'desc': {
        direction = 'desc';
        break;
      }
      default: {
        direction = 'desc';
      }
    }
    return direction;
  }
}
