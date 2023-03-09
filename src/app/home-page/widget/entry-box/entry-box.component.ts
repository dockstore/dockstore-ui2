/*
 *    Copyright 2022 OICR, UCSC
 *
 *    Licensed under the Apache License, Version 2.0 (the "License")
 *    you may not use this file except in compliance with the License
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import { Component, Input, OnInit } from '@angular/core';
import { EntryType } from 'app/shared/enum/entry-type';
import { EntryType as NewEntryType } from 'app/shared/openapi';
import { EntryUpdateTime, UsersService } from 'app/shared/openapi';
import { debounceTime, finalize, takeUntil } from 'rxjs/operators';
import { MyWorkflowsService } from 'app/myworkflows/myworkflows.service';
import { RegisterToolService } from 'app/container/register-tool/register-tool.service';
import { Base } from 'app/shared/base';
import { Dockstore } from 'app/shared/dockstore.model';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SessionService } from '../../../shared/session/session.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-entry-box',
  templateUrl: './entry-box.component.html',
  styleUrls: ['../../../shared/styles/dashboard-boxes.scss'],
})
export class EntryBoxComponent extends Base implements OnInit {
  Dockstore = Dockstore;
  public newEntryType = NewEntryType;
  @Input() entryType: typeof NewEntryType.TOOL | typeof NewEntryType.SERVICE | typeof NewEntryType.WORKFLOW;
  entryTypeLowerCase: string;
  filterText: string;
  listOfEntries: Array<EntryUpdateTime> = [];
  helpLink: string;
  allEntriesLink: string;
  totalEntries: number = 0;
  public isLoading = true;
  userEntries$: Observable<EntryUpdateTime[]>;
  entryTypeParam: any;

  constructor(
    private registerToolService: RegisterToolService,
    private myWorkflowsService: MyWorkflowsService,
    private usersService: UsersService,
    private alertService: AlertService,
    private sessionService: SessionService
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.entryType) {
      this.entryTypeLowerCase = this.entryType.toLowerCase();
    }

    //Get the links for the specified entryType
    if (this.entryType === NewEntryType.WORKFLOW) {
      this.helpLink = Dockstore.DOCUMENTATION_URL + '/getting-started/dockstore-workflows.html';
      this.allEntriesLink = '/my-workflows/';
      this.entryTypeParam = 'WORKFLOWS';
    } else if (this.entryType === NewEntryType.TOOL) {
      this.helpLink = Dockstore.DOCUMENTATION_URL + '/getting-started/dockstore-tools.html';
      this.allEntriesLink = '/my-tools/';
      this.entryTypeParam = 'TOOLS';
    } else if (this.entryType === NewEntryType.SERVICE) {
      this.helpLink = Dockstore.DOCUMENTATION_URL + '/getting-started/getting-started-with-services.html';
      this.allEntriesLink = '/my-services/';
      this.entryTypeParam = 'SERVICES';
    }
    this.getMyEntries();
  }

  getMyEntries() {
    this.userEntries$ = this.usersService.getUserEntries(null, this.filterText, this.entryTypeParam);
    this.userEntries$
      .pipe(
        finalize(() => (this.isLoading = false)),
        debounceTime(750),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        (myEntries: Array<EntryUpdateTime>) => {
          myEntries.forEach(() => {
            this.listOfEntries = myEntries.slice(0, 7);
            this.totalEntries = myEntries.length;
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
    if (this.entryType === NewEntryType.WORKFLOW) {
      this.sessionService.setEntryType(EntryType.BioWorkflow);
      this.myWorkflowsService.registerEntry(EntryType.BioWorkflow);
    } else if (this.entryType === NewEntryType.TOOL) {
      this.sessionService.setEntryType(EntryType.Tool);
      this.registerToolService.setIsModalShown(true);
    } else if (this.entryType === NewEntryType.SERVICE) {
      this.sessionService.setEntryType(EntryType.Service);
      this.myWorkflowsService.registerEntry(EntryType.Service);
    }
  }
}
