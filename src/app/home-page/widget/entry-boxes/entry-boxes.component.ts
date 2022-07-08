import { Component, Input, OnInit } from '@angular/core';
import { EntryType } from 'app/shared/enum/entry-type';
import { User } from 'app/shared/openapi';
import { BioWorkflow } from 'app/shared/swagger/model/bioWorkflow';
import { DockstoreTool, Workflow } from 'app/shared/swagger';
import { Configuration } from 'app/shared/swagger/configuration';
import { UserQuery } from 'app/shared/user/user.query';
import { combineLatest, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WorkflowService } from 'app/shared/state/workflow.service';
import { WorkflowQuery } from 'app/shared/state/workflow.query';
import { MyEntriesQuery } from 'app/shared/state/my-entries.query';
import { SessionQuery } from 'app/shared/session/session.query';
import { SessionService } from 'app/shared/session/session.service';
import { MyWorkflowsService } from 'app/myworkflows/myworkflows.service';
import { MyEntry } from 'app/shared/my-entry';
import { supportsScrollBehavior } from '@angular/cdk/platform';
import { AccountsService } from 'app/loginComponents/accounts/external/accounts.service';
import { AuthService } from 'ng2-ui-auth';
import { TokenQuery } from 'app/shared/state/token.query';
import { UrlResolverService } from 'app/shared/url-resolver.service';
import { ActivatedRoute } from '@angular/router';
import { MyEntriesStateService } from 'app/shared/state/my-entries.service';
import { MytoolsService } from 'app/mytools/mytools.service';
import { E } from '@angular/cdk/keycodes';
import { RegisterToolService } from 'app/container/register-tool/register-tool.service';

@Component({
  selector: 'app-entry-boxes',
  templateUrl: './entry-boxes.component.html',
  styleUrls: ['./entry-boxes.component.scss'],
})
export class EntryBoxesComponent implements OnInit {
  @Input() entryType: string;
  EntryType: EntryType;
  entryType$: Observable<EntryType>;
  user: User;
  user$: Observable<User>;
  workflow: BioWorkflow;
  workflows: Array<Workflow>;
  noUser$: Observable<boolean>;
  readonly pageName: '/dashboard';
  constructor(
    private mytoolsService: MytoolsService,
    private registerToolService: RegisterToolService,
    protected userQuery: UserQuery,
    protected workflowService: WorkflowService,
    protected workflowQuery: WorkflowQuery,
    protected myWorkflowsService: MyWorkflowsService,
    protected myEntriesQuery: MyEntriesQuery,
    protected sessionQuery: SessionQuery,
    protected sessionService: SessionService
  ) // protected accountsService: AccountsService,
  // protected authService: AuthService,
  // protected configuration: Configuration,
  // protected tokenQuery: TokenQuery,
  // protected urlResolverService: UrlResolverService,
  // protected activatedRoute: ActivatedRoute,
  // protected myEntriesStateService: MyEntriesStateService,
  {
    //   super(
    //     accountsService,
    //     authService,
    //     configuration,
    //     tokenQuery,
    //     urlResolverService,
    //     sessionQuery,
    //     sessionService,
    //     activatedRoute,
    //     myEntriesQuery,
    //     userQuery,
    //     myEntriesStateService
    //   );
    this.user = this.userQuery.getValue().user;
    this.user$ = this.userQuery.user$;
    this.noUser$ = this.userQuery.noUser$;
    //   if (this.entryType === 'Workflow') {
    //     this.EntryType = EntryType.BioWorkflow;
    //   } else if (this.entryType === 'Tool') {
    //     this.EntryType = EntryType.Tool;
    //   } else if (this.entryType === 'Service') {
    //     this.EntryType = EntryType.Service;
    //   } // add error else
  }

  ngOnInit(): void {
    this.getMyEntries();
  }

  protected getMyEntries() {
    if (this.user && this.entryType) {
      this.myWorkflowsService.getMyEntries(this.user.id, EntryType.BioWorkflow);
      this.mytoolsService.getMyEntries(this.user.id, EntryType.Tool);
      this.myWorkflowsService.getMyEntries(this.user.id, EntryType.Service);
    }
  }

  showRegisterEntryModal(): void {
    if (this.entryType === 'Workflow') {
      this.myWorkflowsService.registerEntry(EntryType.BioWorkflow);
    } else if (this.entryType === 'Tool') {
      this.registerToolService.setIsModalShown(true);
      console.log('Register tool');
    } else if (this.entryType === 'Service') {
      console.log('Register service');
      this.myWorkflowsService.registerEntry(EntryType.Service);
    }
  }
}
