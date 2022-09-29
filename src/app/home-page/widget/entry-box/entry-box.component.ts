import { Component, Input, OnInit } from '@angular/core';
import { EntryType } from 'app/shared/enum/entry-type';
import { EntryUpdateTime, UsersService } from 'app/shared/openapi';
import { debounceTime, finalize, takeUntil } from 'rxjs/operators';
import { MyWorkflowsService } from 'app/myworkflows/myworkflows.service';
import { RegisterToolService } from 'app/container/register-tool/register-tool.service';
import { Base } from 'app/shared/base';
import { Dockstore } from 'app/shared/dockstore.model';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SessionService } from '../../../shared/session/session.service';
import { ActivatedRoute } from '@angular/router';

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
  helpLink: string;
  allEntriesLink: string;
  totalEntries: number = 0;
  public isLoading = true;

  constructor(
    private registerToolService: RegisterToolService,
    private myWorkflowsService: MyWorkflowsService,
    private usersService: UsersService,
    private alertService: AlertService,
    private sessionService: SessionService,
    private route: ActivatedRoute
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
      .subscribe(
        (myEntries: Array<EntryUpdateTime>) => {
          this.listOfEntries = [];
          this.totalEntries = 0;
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
              this.totalEntries += 1;
            });
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
        }
      );
  }

  onTextChange(event: any) {
    this.isLoading = true;
    this.getMyEntries();
  }

  showRegisterEntryModal(): void {
    if (this.entryType === EntryUpdateTime.EntryTypeEnum.WORKFLOW) {
      this.sessionService.setEntryType(EntryType.BioWorkflow);
      this.myWorkflowsService.registerEntry(EntryType.BioWorkflow);
    } else if (this.entryType === EntryUpdateTime.EntryTypeEnum.TOOL) {
      this.sessionService.setEntryType(EntryType.Tool);
      this.registerToolService.setIsModalShown(true);
    } else if (this.entryType === EntryUpdateTime.EntryTypeEnum.SERVICE) {
      this.sessionService.setEntryType(EntryType.Service);
      this.myWorkflowsService.registerEntry(EntryType.Service);
    }
  }
}
