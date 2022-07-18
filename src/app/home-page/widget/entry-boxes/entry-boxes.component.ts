import { Component, Input, OnInit } from '@angular/core';
import { EntryType } from 'app/shared/enum/entry-type';
import { EntryUpdateTime, User } from 'app/shared/openapi';
import { BioWorkflow } from 'app/shared/swagger/model/bioWorkflow';
import { DockstoreTool, Workflow } from 'app/shared/swagger';
import { UserQuery } from 'app/shared/user/user.query';
import { Observable } from 'rxjs';
import { WorkflowService } from 'app/shared/state/workflow.service';
import { WorkflowQuery } from 'app/shared/state/workflow.query';
import { MyEntriesQuery } from 'app/shared/state/my-entries.query';
import { SessionQuery } from 'app/shared/session/session.query';
import { SessionService } from 'app/shared/session/session.service';
import { MyWorkflowsService } from 'app/myworkflows/myworkflows.service';
import { MytoolsService } from 'app/mytools/mytools.service';
import { RegisterToolService } from 'app/container/register-tool/register-tool.service';
import { OrgWorkflowObject } from 'app/myworkflows/my-workflow/my-workflow.component';
import { OrgToolObject } from 'app/mytools/my-tool/my-tool.component';

interface GroupEntriesBySource {
  groupEntryInfo: OrgWorkflowObject<Workflow>[];
  sourceControlTitle: string;
}

interface GroupEntriesByRegistry {
  groupEntryInfo: OrgToolObject<DockstoreTool>[];
  registryTitle: string;
}

@Component({
  selector: 'app-entry-boxes',
  templateUrl: './entry-boxes.component.html',
  styleUrls: ['./entry-boxes.component.scss'],
})
export class EntryBoxesComponent implements OnInit {
  @Input() entryType: string;
  @Input() listOfWorkflows: Array<EntryUpdateTime>;
  @Input() listOfTools: Array<EntryUpdateTime>;
  EntryType: EntryType;
  entryType$: Observable<EntryType>;
  user: User;
  user$: Observable<User>;
  workflow: BioWorkflow;
  workflows: Array<Workflow>;
  noUser$: Observable<boolean>;
  readonly pageName: '/dashboard';
  public sourceControlToWorkflows: Map<string, GroupEntriesBySource> = new Map<string, GroupEntriesBySource>();
  public registryToTools: Map<string, GroupEntriesByRegistry> = new Map<string, GroupEntriesByRegistry>();

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
  ) {
    this.user = this.userQuery.getValue().user;
    this.user$ = this.userQuery.user$;
    this.noUser$ = this.userQuery.noUser$;
  }

  ngOnInit(): void {
    console.log(this.listOfWorkflows);
    this.user = this.userQuery.getValue().user;
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
