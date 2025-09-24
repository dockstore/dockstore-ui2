import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { merge, Observable } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Base } from '../../../shared/base';
import { ShowContent } from './lambda-events-datasource';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgIf, NgFor, AsyncPipe, TitleCasePipe, DatePipe } from '@angular/common';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { Dockstore } from 'app/shared/dockstore.model';
import { CodeEditorComponent } from 'app/shared/code-editor/code-editor.component';
import { MatDividerModule } from '@angular/material/divider';
import { GitHubAppNotificationsDataSource } from './github-app-notifications.datasource';
import { GenerateDockstoreYmlButtonComponent } from 'app/github-landing-page/generate-dockstore-yml-button.component';
import { PaginatorService } from 'app/shared/state/paginator.service';
import { NotificationsService } from 'app/notifications/state/notifications.service';
import { CurationService } from 'app/shared/openapi';

/**
 * Based on https://material.angular.io/components/table/examples example with expandable rows
 * @export
 * @class GithubAppsLogsComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-recommended-actions',
  templateUrl: './recommended-actions.component.html',
  styleUrls: [],
  standalone: true,
  imports: [
    LoadingComponent,
    NgIf,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    NgFor,
    FlexModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule,
    AsyncPipe,
    TitleCasePipe,
    DatePipe,
    CodeEditorComponent,
    MatButtonModule,
    MatDividerModule,
    GenerateDockstoreYmlButtonComponent,
  ],
})
export class RecommendedActionsComponent extends Base implements OnInit, AfterViewInit {
  Dockstore = Dockstore;
  columnsToDisplay: string[];
  displayedColumns: string[];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public showContent$: Observable<ShowContent>;
  public eventsLength$: Observable<number>;
  type: 'workflow' | 'tool' | 'lambdaEvent' | 'gitHubAppNotification' = 'gitHubAppNotification';

  public pageSize$: Observable<number>;
  public pageIndex$: Observable<number>;

  public dataSource: GitHubAppNotificationsDataSource;

  constructor(
    private paginatorService: PaginatorService,
    private alertService: AlertService,
    private notificationsService: NotificationsService,
    private curationService: CurationService
  ) {
    super();
  }

  ngOnInit() {
    this.dataSource = new GitHubAppNotificationsDataSource(this.notificationsService);
    this.showContent$ = this.dataSource.showContent$;
    this.eventsLength$ = this.dataSource.gitHubAppNotificationsLength$;
    this.columnsToDisplay = ['notifications'];
    this.displayedColumns = this.columnsToDisplay;
  }

  ngAfterViewInit() {
    this.dataSource.gitHubAppNotifications$
      .pipe(takeUntil(this.ngUnsubscribe))
      // Subscribe to errors only here; The MatTable listens to events GitHubAppNotificationsDataSource.connect
      .subscribe({ error: (error) => this.alertService.detailedError(error) });
    this.loadGitHubAppNotifications();
  }

  loadGitHubAppNotifications() {
    this.loadEvents();
    this.paginatorService.setPaginator(this.type, this.paginator.pageSize, this.paginator.pageIndex);

    // Handle paginator changes
    merge(this.paginator.page)
      .pipe(distinctUntilChanged(), takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.loadEvents();
        this.paginatorService.setPaginator(this.type, this.paginator.pageSize, this.paginator.pageIndex);
      });
  }

  deleteGitHubAppNotification(notificationId: number) {
    this.curationService.hideUserNotification(notificationId).subscribe(() => {
      this.alertService.detailedSuccess(`Successfully deleted notification`);
      this.loadGitHubAppNotifications();
    });
  }

  private loadEvents() {
    this.dataSource.loadEvents(this.paginator.pageIndex, this.paginator.pageSize);
  }
}
