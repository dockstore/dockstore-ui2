/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { AfterViewChecked, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogModule } from '@angular/material/legacy-dialog';
import { Service } from 'app/shared/openapi/model/service';
import { Notebook } from 'app/shared/openapi/model/notebook';
import { Observable, Subject } from 'rxjs';
import { debounceTime, shareReplay, takeUntil } from 'rxjs/operators';
import { AlertQuery } from '../../shared/alert/state/alert.query';
import { formInputDebounceTime } from '../../shared/constants';
import { DateService } from '../../shared/date.service';
import { SessionQuery } from '../../shared/session/session.query';
import { WorkflowQuery } from '../../shared/state/workflow.query';
import { AppTool, BioWorkflow, Doi, ToolDescriptor, VersionVerifiedPlatform } from '../../shared/openapi';
import { SourceFile } from '../../shared/openapi/model/sourceFile';
import { Workflow } from '../../shared/openapi/model/workflow';
import { WorkflowVersion } from '../../shared/openapi/model/workflowVersion';
import { Tooltip } from '../../shared/tooltip';
import { formErrors, validationDescriptorPatterns, validationMessages } from '../../shared/validationMessages.model';
import { VersionModalService } from './version-modal.service';
import { EntryType } from '../../shared/enum/entry-type';
import { DockstoreService } from 'app/shared/dockstore.service';
import { VerifiedPlatformsPipe } from '../../shared/entry/verified-platforms.pipe';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatIconModule } from '@angular/material/icon';
import { ExtendedModule } from '@ngbracket/ngx-layout/extended';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';
import { AlertComponent } from '../../shared/alert/alert.component';

export interface Dialogdata {
  canRead: boolean;
  canWrite: boolean;
  isOwner: boolean;
  verifiedVersionPlatforms: Array<VersionVerifiedPlatform>;
  verifiedSources: Array<any>;
}

@Component({
  selector: 'app-version-modal',
  templateUrl: './version-modal.component.html',
  styleUrls: ['./version-modal.component.css'],
  standalone: true,
  imports: [
    MatLegacyDialogModule,
    AlertComponent,
    FormsModule,
    NgIf,
    MatLegacyTooltipModule,
    MatLegacyCardModule,
    NgFor,
    NgClass,
    ExtendedModule,
    MatIconModule,
    FlexModule,
    MatLegacyButtonModule,
    AsyncPipe,
    VerifiedPlatformsPipe,
  ],
})
export class VersionModalComponent implements OnInit, AfterViewChecked, OnDestroy {
  isPublic: boolean;
  isModalShown: boolean;
  version: WorkflowVersion;
  workflow: BioWorkflow | Service | AppTool | Notebook;
  originalVersion: WorkflowVersion;
  testParameterFiles: SourceFile[];
  versionEditorForm: NgForm;
  public tooltip = Tooltip;
  public testParameterFilePaths: string[];
  originalTestParameterFilePaths: string[];
  ToolDescriptor = ToolDescriptor;
  DoiInitiatorEnum = Doi.InitiatorEnum;
  public testParameterFilePath = '';
  formErrors = formErrors;
  validationMessages = validationMessages;
  validationPatterns = validationDescriptorPatterns;
  public isRefreshing$: Observable<boolean>;
  public WorkflowType = Workflow;
  descriptorType$: Observable<ToolDescriptor.TypeEnum>;
  canRead: boolean;
  canWrite: boolean;
  isOwner: boolean;
  verifiedVersionPlatforms: Array<VersionVerifiedPlatform>;
  verifiedSources: Array<any>;
  isService$: Observable<boolean>;
  isNotebook$: Observable<boolean>;
  entryTypeText: string;
  @ViewChild('versionEditorForm', { static: true }) currentForm: NgForm;

  private ngUnsubscribe: Subject<{}> = new Subject();

  constructor(
    private versionModalService: VersionModalService,
    private dateService: DateService,
    private dockstoreService: DockstoreService,
    private sessionQuery: SessionQuery,
    private workflowQuery: WorkflowQuery,
    private alertQuery: AlertQuery,
    @Inject(MAT_DIALOG_DATA) public data: Dialogdata
  ) {}

  ngOnInit() {
    this.isService$ = this.sessionQuery.isService$.pipe(shareReplay());
    this.isNotebook$ = this.sessionQuery.isNotebook$.pipe(shareReplay());
    this.sessionQuery.entryType$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((type: EntryType) => {
      switch (type) {
        case EntryType.Service:
          this.entryTypeText = 'Service';
          break;
        case EntryType.AppTool:
          this.entryTypeText = 'Tool';
          break;
        case EntryType.Tool:
          this.entryTypeText = 'Tool';
          break;
        case EntryType.BioWorkflow:
          this.entryTypeText = 'Workflow';
          break;
        case EntryType.Notebook:
          this.entryTypeText = 'Notebook';
          break;
      }
    });
    this.canRead = this.data.canRead;
    this.canWrite = this.data.canWrite;
    this.isOwner = this.data.isOwner;
    this.verifiedVersionPlatforms = this.data.verifiedVersionPlatforms;
    this.verifiedSources = this.data.verifiedSources;
    this.descriptorType$ = this.workflowQuery.descriptorType$;
    this.isRefreshing$ = this.alertQuery.showInfo$;
    this.versionModalService.version.pipe(takeUntil(this.ngUnsubscribe)).subscribe((version) => {
      this.version = Object.assign({}, version);
      this.originalVersion = version;
    });
    this.workflowQuery.workflow$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((workflow) => (this.workflow = workflow));
    this.versionModalService.testParameterFiles.pipe(takeUntil(this.ngUnsubscribe)).subscribe((testParameterFiles) => {
      this.testParameterFilePaths = [];
      this.originalTestParameterFilePaths = [];
      this.testParameterFiles = testParameterFiles;
      for (const testParameterFile of testParameterFiles) {
        this.testParameterFilePaths.push(testParameterFile.path);
        this.originalTestParameterFilePaths.push(testParameterFile.path);
      }
    });
    this.sessionQuery.isPublic$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((publicPage) => (this.isPublic = publicPage));
  }

  removeTestParameterFile(index: number) {
    this.testParameterFilePaths.splice(index, 1);
  }

  addTestParameterFile() {
    this.testParameterFilePaths.push(this.testParameterFilePath);
    this.testParameterFilePath = '';
  }

  public getDateTimeMessage(timestamp) {
    return this.dateService.getDateTimeMessage(timestamp);
  }

  getVerifiedSource(name: string): string {
    return this.dockstoreService.getVerifiedSource(name, this.verifiedSources);
  }

  public saveChanges() {
    // Store the unsaved test files if valid and exist
    if (this.testParameterFilePath.length > 0) {
      this.addTestParameterFile();
    }

    this.versionModalService.saveVersion(
      this.workflow,
      this.originalVersion,
      this.version,
      this.originalTestParameterFilePaths,
      this.testParameterFilePaths,
      this.workflow.mode
    );
  }

  // Validation starts here, should move most of these to a service somehow
  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    if (this.currentForm === this.versionEditorForm) {
      return;
    }
    this.versionEditorForm = this.currentForm;
    if (this.versionEditorForm) {
      this.versionEditorForm.valueChanges
        .pipe(debounceTime(formInputDebounceTime), takeUntil(this.ngUnsubscribe))
        .subscribe((data) => this.onValueChanged(data));
    }
  }
  onValueChanged(data?: any) {
    if (!this.versionEditorForm) {
      return;
    }
    const form = this.versionEditorForm.form;
    for (const field in formErrors) {
      if (formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        formErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
  // Validation ends here

  // Checks if the currently edited test parameter file already exists
  hasDuplicateTestJson() {
    if (this.testParameterFilePaths.includes(this.testParameterFilePath)) {
      return true;
    } else {
      return false;
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
