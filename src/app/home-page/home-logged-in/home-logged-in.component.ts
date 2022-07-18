import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MytoolsService } from 'app/mytools/mytools.service';
import { MyWorkflowsService } from 'app/myworkflows/myworkflows.service';
import { Base } from 'app/shared/base';
import { TwitterService } from 'app/shared/twitter.service';
import { EntryType } from 'app/shared/enum/entry-type';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '../../shared/swagger/model/user';
import { UserQuery } from '../../shared/user/user.query';
import { Workflow } from '../../shared/swagger';
import { OrgWorkflowObject } from 'app/myworkflows/my-workflow/my-workflow.component';
import { DockstoreTool, UsersService, EntryUpdateTime } from 'app/shared/openapi';
import { WorkflowService } from 'app/shared/state/workflow.service';
import { WorkflowQuery } from 'app/shared/state/workflow.query';
import { OrgToolObject } from 'app/mytools/my-tool/my-tool.component';
import { RegisterToolService } from 'app/container/register-tool/register-tool.service';
import { MatDialog } from '@angular/material/dialog';
import { RegisterToolComponent } from 'app/container/register-tool/register-tool.component';
import { AlertService } from 'app/shared/alert/state/alert.service';

@Component({
  selector: 'app-home-logged-in',
  templateUrl: './home-logged-in.component.html',
  styleUrls: ['./home-logged-in.component.scss'],
})
export class HomeLoggedInComponent extends Base implements OnInit {
  public user$: Observable<User>;
  user: User;
  EntryType: EntryType;
  public listOfTools: Array<EntryUpdateTime> = [];
  public listOfWorkflows: Array<EntryUpdateTime> = [];
  public listOfServices: Array<EntryUpdateTime> = [];
  workflows: Array<Workflow>;
  public workflowsObject$: Observable<Array<OrgWorkflowObject<Workflow>>>;
  public toolsObject$: Observable<Array<OrgToolObject<DockstoreTool>>>;
  @ViewChild('twitter') twitterElement: ElementRef;

  constructor(
    protected userQuery: UserQuery,
    private twitterService: TwitterService,
    protected myWorkflowsService: MyWorkflowsService,
    protected workflowService: WorkflowService,
    protected workflowQuery: WorkflowQuery,
    private usersService: UsersService,
    private registerToolService: RegisterToolService,
    private dialog: MatDialog,
    private alertService: AlertService
  ) {
    super();

    this.user$ = this.userQuery.user$;
  }

  ngOnInit() {
    this.userQuery.user$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((user) => {
      this.user = user;
    });
    this.registerToolService.isModalShown.pipe(takeUntil(this.ngUnsubscribe)).subscribe((isModalShown: boolean) => {
      if (isModalShown) {
        const dialogRef = this.dialog.open(RegisterToolComponent, { width: '600px' });
        dialogRef
          .afterClosed()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(() => {
            this.alertService.clearEverything();
          });
      } else {
        this.dialog.closeAll();
      }
    });
    this.getMyEntries();
  }

  protected getMyEntries() {
    this.usersService
      .getUserEntries(10)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((myEntries: Array<EntryUpdateTime>) => {
        myEntries.forEach((entry: EntryUpdateTime) => {
          if (entry.entryType === 'WORKFLOW') {
            this.listOfWorkflows.push(entry);
          } else if (entry.entryType === 'APPTOOL' || entry.entryType === 'TOOL') {
            this.listOfTools.push(entry);
          } else if (entry.entryType === 'SERVICE') {
            this.listOfServices.push(entry);
          }
        });
      });
  }

  // ngAfterViewInit() {
  //   this.loadTwitterWidget();
  // }

  // loadTwitterWidget() {
  //   this.twitterService
  //     .loadScript()
  //     .pipe(takeUntil(this.ngUnsubscribe))
  //     .subscribe(
  //       () => {
  //         this.twitterService.createTimeline(this.twitterElement, 3);
  //       },
  //       (err) => console.error(err)
  //     );
  // }
}
