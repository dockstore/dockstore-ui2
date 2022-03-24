import { animate, state, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { LambdaEvent, LambdaEventsService } from 'app/shared/openapi';
import { finalize } from 'rxjs/operators';
import { MapFriendlyValuesPipe } from '../../../search/map-friendly-values.pipe';
import { DescriptorLanguageService } from '../../../shared/entry/descriptor-language.service';

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
export class GithubAppsLogsComponent implements OnInit {
  datePipe: DatePipe;
  mapPipe: MapFriendlyValuesPipe;
  columnsToDisplay: string[] = ['repository', 'reference', 'success', 'type'];
  displayedColumns: string[] = ['eventDate', 'githubUsername', ...this.columnsToDisplay];
  lambdaEvents: LambdaEvent[] | null;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  loading = true;
  public LambdaEvent = LambdaEvent;
  dataSource: MatTableDataSource<LambdaEvent> = new MatTableDataSource();
  expandedElement: LambdaEvent | null;
  showContent: 'table' | 'error' | 'empty' | null;
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  constructor(
    @Inject(MAT_DIALOG_DATA) public matDialogData: string,
    private lambdaEventsService: LambdaEventsService,
    private matSnackBar: MatSnackBar,
    private descriptorLanguageService: DescriptorLanguageService
  ) {
    this.datePipe = new DatePipe('en');
    this.mapPipe = new MapFriendlyValuesPipe(this.descriptorLanguageService);
    const defaultPredicate = this.dataSource.filterPredicate;
    this.dataSource.filterPredicate = (data, filter) => {
      const formattedDate = this.datePipe.transform(data.eventDate, 'yyyy-MM-ddTHH:mm').toLowerCase();
      const formattedStatus = this.mapPipe.transform('success', String(data.success)).toLowerCase();
      return formattedDate.indexOf(filter) >= 0 || formattedStatus.indexOf(filter) >= 0 || defaultPredicate(data, filter);
    };
  }

  ngOnInit() {
    this.loading = true;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.lambdaEventsService
      .getLambdaEventsByOrganization(this.matDialogData)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.updateContentToShow(this.lambdaEvents);
        })
      )
      .subscribe(
        (lambdaEvents) => (this.lambdaEvents = lambdaEvents),
        (error) => {
          this.lambdaEvents = null;
          const detailedErrorMessage = AlertService.getDetailedErrorMessage(error);
          this.matSnackBar.open(detailedErrorMessage);
        }
      );
  }

  updateContentToShow(lambdaEvents: LambdaEvent[] | null) {
    this.dataSource.data = lambdaEvents ? lambdaEvents : [];
    if (!lambdaEvents) {
      this.showContent = 'error';
    } else {
      if (lambdaEvents.length === 0) {
        this.showContent = 'empty';
      } else {
        this.showContent = 'table';
      }
    }
  }

  applyFilter(event: string) {
    this.dataSource.filter = event.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
