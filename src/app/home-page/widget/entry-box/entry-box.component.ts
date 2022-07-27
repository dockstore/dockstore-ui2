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
  selector: 'app-entry-box',
  templateUrl: './entry-box.component.html',
  styleUrls: ['./entry-box.component.scss'],
})
export class EntryBoxComponent extends Base implements OnInit {
  Dockstore = Dockstore;
  @Input() entryType: EntryUpdateTime.EntryTypeEnum;
  entryTypeLowerCase: string;
  entryTypeCapitalize: string;
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
    if (this.entryType) {
      this.entryTypeLowerCase = this.entryType.toLowerCase();
      this.entryTypeCapitalize = this.entryTypeLowerCase[0].toUpperCase() + this.entryTypeLowerCase.substring(1);
    }

    if (this.entryType === 'WORKFLOW') {
      this.helpLink = Dockstore.DOCUMENTATION_URL + '/getting-started/dockstore-workflows.html';
      this.allEntriesLink = '/my-workflows/';
    } else if (this.entryType === 'TOOL') {
      this.helpLink = Dockstore.DOCUMENTATION_URL + '/getting-started/dockstore-tools.html';
      this.allEntriesLink = '/my-tools/';
    } else if (this.entryType === 'SERVICE') {
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
          if (this.entryType === 'WORKFLOW' && entry.entryType === 'WORKFLOW') {
            this.listOfEntries.push(entry);
          } else if (this.entryType === 'TOOL' && (entry.entryType === 'APPTOOL' || entry.entryType === 'TOOL')) {
            this.listOfEntries.push(entry);
          } else if (this.entryType === 'SERVICE' && entry.entryType === 'SERVICE') {
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
    if (this.entryType === 'WORKFLOW') {
      this.myWorkflowsService.registerEntry(EntryType.BioWorkflow);
    } else if (this.entryType === 'TOOL') {
      this.registerToolService.setIsModalShown(true);
    } else if (this.entryType === 'SERVICE') {
      this.myWorkflowsService.registerEntry(EntryType.Service);
    }
  }
}
