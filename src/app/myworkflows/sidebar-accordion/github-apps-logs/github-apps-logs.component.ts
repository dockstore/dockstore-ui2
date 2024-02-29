import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { LambdaEvent, LambdaEventsService } from 'app/shared/openapi';
import { fromEvent, merge, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, tap } from 'rxjs/operators';
import { Base } from '../../../shared/base';
import { formInputDebounceTime } from '../../../shared/constants';
import { PaginatorService } from '../../../shared/state/paginator.service';
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
  columnsToDisplay: string[];
  displayedColumns: string[];
  lambdaEvents: LambdaEvent[] | null;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  public LambdaEvent = LambdaEvent;
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
  public dataSource: LambdaEventDataSource;

  constructor(
    @Inject(MAT_DIALOG_DATA) public matDialogData: { userId?: number; organization?: string },
    private paginatorService: PaginatorService,
    private lambdaEventsService: LambdaEventsService,
    private alertService: AlertService
  ) {
    super();
  }

  ngOnInit() {
    this.dataSource = new LambdaEventDataSource(this.lambdaEventsService);
    this.showContent$ = this.dataSource.showContent$;
    this.eventsLength$ = this.dataSource.eventsLength$;
    this.columnsToDisplay = this.matDialogData.userId
      ? ['organization', 'repository', 'entryName', 'deliveryId', 'reference', 'success', 'type']
      : ['repository', 'entryName', 'deliveryId', 'reference', 'success', 'type'];
    this.displayedColumns = ['eventDate', 'githubUsername', ...this.columnsToDisplay];
  }

  ngAfterViewInit() {
    this.dataSource.events$
      .pipe(takeUntil(this.ngUnsubscribe))
      // Subscribe to errors only here; The MatTable listens to events LambdaEventsDataSource.connect
      .subscribe({ error: (error) => this.alertService.detailedError(error) });
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
    this.dataSource.loadEvents(
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
      case 'desc':
      default: {
        direction = 'desc';
        break;
      }
    }
    return direction;
  }
}
