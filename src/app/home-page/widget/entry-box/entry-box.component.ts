import { Component, Input, OnInit } from '@angular/core';
import { EntryType } from 'app/shared/enum/entry-type';
import { EntryUpdateTime, User, UsersService } from 'app/shared/openapi';
import { debounceTime, finalize, takeUntil } from 'rxjs/operators';
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
  @Input() entryType:
    | typeof EntryUpdateTime.EntryTypeEnum.TOOL
    | typeof EntryUpdateTime.EntryTypeEnum.SERVICE
    | typeof EntryUpdateTime.EntryTypeEnum.WORKFLOW;
  entryTypeLowerCase: string;
  filterText: string;
  listOfEntries: Array<EntryUpdateTime> = [];
  user: User;
  helpLink: string;
  allEntriesLink: string;
  hasEntries: boolean;
  firstLoad: boolean = true;
  public isLoading = true;

  constructor(
    private registerToolService: RegisterToolService,
    private myWorkflowsService: MyWorkflowsService,
    private usersService: UsersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getMyEntries();

    if (this.entryType) {
      this.entryTypeLowerCase = this.entryType.toLowerCase();
    }

    //Get the links for the specified entryType
    if (this.entryType === EntryUpdateTime.EntryTypeEnum.WORKFLOW) {
      this.helpLink = Dockstore.DOCUMENTATION_URL + '/getting-started/dockstore-workflows.html';
      this.allEntriesLink = '/my-workflows/';
    } else if (this.entryType === EntryUpdateTime.EntryTypeEnum.TOOL) {
      this.helpLink = Dockstore.DOCUMENTATION_URL + '/getting-started/dockstore-tools.html';
      this.allEntriesLink = '/my-tools/';
    } else if (this.entryType === EntryUpdateTime.EntryTypeEnum.SERVICE) {
      this.helpLink = Dockstore.DOCUMENTATION_URL + '/getting-started/getting-started-with-services.html';
      this.allEntriesLink = '/my-services/';
    }
  }

  getMyEntries() {
    this.usersService
      .getUserEntries(null, this.filterText)
      .pipe(
        finalize(() => (this.isLoading = false)),
        debounceTime(750),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((myEntries: Array<EntryUpdateTime>) => {
        this.listOfEntries = [];
        myEntries
          .filter(
            (entry) =>
              entry.entryType === this.entryType ||
              (this.entryType === EntryUpdateTime.EntryTypeEnum.TOOL && entry.entryType === EntryUpdateTime.EntryTypeEnum.APPTOOL)
          )
          .forEach((entry: EntryUpdateTime) => {
            if (this.listOfEntries.length < 7) {
              this.listOfEntries.push(entry);
            }
          });
        if (this.firstLoad) {
          this.hasEntries = this.listOfEntries.length !== 0;
        }
      });
  }

  onTextChange(event: any) {
    this.firstLoad = false;
    this.isLoading = true;
    this.getMyEntries();
  }

  showRegisterEntryModal(): void {
    if (this.entryType === EntryUpdateTime.EntryTypeEnum.WORKFLOW) {
      this.myWorkflowsService.registerEntry(EntryType.BioWorkflow);
    } else if (this.entryType === EntryUpdateTime.EntryTypeEnum.TOOL) {
      this.registerToolService.setIsModalShown(true);
    } else if (this.entryType === EntryUpdateTime.EntryTypeEnum.SERVICE) {
      this.myWorkflowsService.registerEntry(EntryType.Service);
    }
  }
}
