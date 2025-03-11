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
import { EntryUpdateTime, UsersService, EntryType as NewEntryType } from 'app/shared/openapi';
import { debounceTime, finalize, takeUntil } from 'rxjs/operators';
import { MyWorkflowsService } from 'app/myworkflows/myworkflows.service';
import { RegisterToolService } from 'app/container/register-tool/register-tool.service';
import { Base } from 'app/shared/base';
import { Dockstore } from 'app/shared/dockstore.model';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { SessionService } from '../../../shared/session/session.service';
import { Router, RouterLink } from '@angular/router';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor, TitleCasePipe, DatePipe } from '@angular/common';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-entry-box',
  templateUrl: './entry-box.component.html',
  styleUrls: ['../../../shared/styles/dashboard-boxes.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    FlexModule,
    NgIf,
    MatButtonModule,
    MatTooltipModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatAutocompleteModule,
    MatIconModule,
    NgFor,
    MatOptionModule,
    RouterLink,
    TitleCasePipe,
    DatePipe,
    MatChipsModule,
  ],
})
export class EntryBoxComponent extends Base implements OnInit {
  Dockstore = Dockstore;
  public newEntryType = NewEntryType;
  @Input() entryType: typeof NewEntryType.TOOL | typeof NewEntryType.SERVICE | typeof NewEntryType.WORKFLOW | typeof NewEntryType.NOTEBOOK;
  public entryTypeLowerCase: string;
  public filterText: string = '';
  public listOfEntries: Array<EntryUpdateTime> = [];
  public listOfResults: Array<EntryUpdateTime> = [];
  public helpLink: string = '';
  public allEntriesLink: string = '';
  public totalEntries: number = 0;
  public totalResults: number = 0;
  public noResults: boolean = false;
  public resultsDisplayed: number = 5;
  public isLoading = true;
  public entryTypeParam: any;
  private readonly arrowKeyCodes: number[] = [37, 38, 39, 40];

  constructor(
    private registerToolService: RegisterToolService,
    private myWorkflowsService: MyWorkflowsService,
    private usersService: UsersService,
    private alertService: AlertService,
    private sessionService: SessionService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.entryType) {
      this.entryTypeLowerCase = this.entryType.toLowerCase();
    }

    // Get the links for the specified entryType
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
    } else if (this.entryType === NewEntryType.NOTEBOOK) {
      this.helpLink = Dockstore.DOCUMENTATION_URL + '/getting-started/getting-started-with-notebooks.html';
      this.allEntriesLink = '/my-notebooks/';
      this.entryTypeParam = 'NOTEBOOKS';
    }

    this.getMyEntries();
  }

  getMyEntries() {
    this.usersService
      .getUserEntries(null, this.filterText, this.entryTypeParam, 'response')
      .pipe(
        finalize(() => (this.isLoading = false)),
        debounceTime(750),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        (myEntries: HttpResponse<EntryUpdateTime[]>) => {
          const url = new URL(myEntries.url);
          if (url.searchParams.get('filter')) {
            this.listOfResults = myEntries.body.slice(0, this.resultsDisplayed);
            this.totalResults = myEntries.body.length;
            // Display no search results message when there are no search results returned and a search filter is present
            this.noResults = myEntries.body.length === 0;
          } else {
            // Update total entries only when no search filter applied (i.e. non-filtered total)
            // Handles cases with no filter param and empty filter param
            this.listOfEntries = myEntries.body.slice(0, 7);
            this.totalEntries = myEntries.body.length;
            // Clear search results if no filter applied
            this.clearSearch();
          }
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
        }
      );
  }

  onTextChange(event: any) {
    // Ignore arrow key events as they are used for nagivation
    if (!this.arrowKeyCodes.includes(event.keyCode)) {
      this.isLoading = true;
      this.getMyEntries();
    }
  }

  navigateToEntry(path: string) {
    this.router.navigateByUrl(this.allEntriesLink + path);
  }

  clearSearch() {
    this.listOfResults = [];
    this.filterText = '';
    this.noResults = false;
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
    } else if (this.entryType === NewEntryType.NOTEBOOK) {
      this.sessionService.setEntryType(EntryType.Notebook);
      this.myWorkflowsService.registerEntry(EntryType.Notebook);
    }
  }
}
