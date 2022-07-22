import { Component, Input, OnInit } from '@angular/core';
import { EntryType } from 'app/shared/enum/entry-type';
import { EntryUpdateTime, User, UsersService } from 'app/shared/openapi';
import { UserQuery } from 'app/shared/user/user.query';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { WorkflowService } from 'app/shared/state/workflow.service';
import { WorkflowQuery } from 'app/shared/state/workflow.query';
import { MyEntriesQuery } from 'app/shared/state/my-entries.query';
import { SessionQuery } from 'app/shared/session/session.query';
import { SessionService } from 'app/shared/session/session.service';
import { MyWorkflowsService } from 'app/myworkflows/myworkflows.service';
import { RegisterToolService } from 'app/container/register-tool/register-tool.service';
import { Base } from 'app/shared/base';
import { Dockstore } from 'app/shared/dockstore.model';

@Component({
  selector: 'app-entry-boxes',
  templateUrl: './entry-boxes.component.html',
  styleUrls: ['./entry-boxes.component.scss'],
})
export class EntryBoxesComponent extends Base implements OnInit {
  Dockstore = Dockstore;
  @Input() entryType: string;
  entryTypeLowerCase: string;
  filterText: string;
  listOfEntries: Array<EntryUpdateTime> = [];
  user: User;
  helpLink: string;
  allEntriesLink: string;
  public isLoading = true;

  constructor(
    private registerToolService: RegisterToolService,
    protected userQuery: UserQuery,
    protected workflowService: WorkflowService,
    protected workflowQuery: WorkflowQuery,
    protected myWorkflowsService: MyWorkflowsService,
    protected myEntriesQuery: MyEntriesQuery,
    protected sessionQuery: SessionQuery,
    protected sessionService: SessionService,
    private usersService: UsersService
  ) {
    super();
    this.user = this.userQuery.getValue().user;
  }

  ngOnInit(): void {
    this.getMyEntries();
    this.entryTypeLowerCase = this.entryType.toLowerCase();
    if (this.entryType === 'Workflow') {
      this.helpLink = Dockstore.DOCUMENTATION_URL + '/getting-started/dockstore-workflows.html';
      this.allEntriesLink = '/my-workflows/';
    } else if (this.entryType === 'Tool') {
      this.helpLink = Dockstore.DOCUMENTATION_URL + '/getting-started/dockstore-tools.html';
      this.allEntriesLink = '/my-tools/';
    } else if (this.entryType === 'Service') {
      this.helpLink = Dockstore.DOCUMENTATION_URL + '/getting-started/getting-started-with-services.html';
      this.allEntriesLink = '/my-services/';
    }
  }

  getMyEntries() {
    this.usersService
      .getUserEntries(10, this.filterText)
      .pipe(debounceTime(500), takeUntil(this.ngUnsubscribe))
      .subscribe((myEntries: Array<EntryUpdateTime>) => {
        myEntries.forEach((entry: EntryUpdateTime) => {
          if (this.entryType === 'Workflow' && entry.entryType === 'WORKFLOW') {
            this.listOfEntries.push(entry);
          } else if (this.entryType === 'Tool' && (entry.entryType === 'APPTOOL' || entry.entryType === 'TOOL')) {
            this.listOfEntries.push(entry);
          } else if (this.entryType === 'Service' && entry.entryType === 'SERVICE') {
            this.listOfEntries.push(entry);
          }
          this.isLoading = false;
        });
      });
  }

  onTextChange(event: any) {
    this.isLoading = true;
    this.listOfEntries = [];
    this.getMyEntries();
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
