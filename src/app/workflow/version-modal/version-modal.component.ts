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
import { AfterViewChecked, Component, Input, OnDestroy, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { formInputDebounceTime } from '../../shared/constants';
import { DateService } from '../../shared/date.service';
import { StateService } from '../../shared/state.service';
import { SourceFile } from '../../shared/swagger/model/sourceFile';
import { Workflow } from '../../shared/swagger/model/workflow';
import { WorkflowVersion } from '../../shared/swagger/model/workflowVersion';
import { Tooltip } from '../../shared/tooltip';
import { formErrors, validationDescriptorPatterns, validationMessages } from '../../shared/validationMessages.model';
import { WorkflowService } from '../../shared/workflow.service';
import { VersionModalService } from './version-modal.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

export interface Dialogdata {
  canRead: boolean;
  canWrite: boolean;
  isOwner: boolean;
}

@Component({
  templateUrl: './version-modal.component.html',
  styleUrls: ['./version-modal.component.css']
})
export class VersionModalComponent implements OnInit, AfterViewChecked, OnDestroy {
  isPublic: boolean;
  version: WorkflowVersion;
  workflow: Workflow;
  testParameterFiles: SourceFile[];
  versionEditorForm: NgForm;
  public tooltip = Tooltip;
  public testParameterFilePaths: string[];
  originalTestParameterFilePaths: string[];
  public testParameterFilePath = '';
  formErrors = formErrors;
  validationMessages = validationMessages;
  validationPatterns = validationDescriptorPatterns;
  public refreshMessage: string;
  public WorkflowType = Workflow;
  workflowSubscription: Subscription;
  @ViewChild('versionEditorForm') currentForm: NgForm;

  constructor(private versionModalService: VersionModalService, private dateService: DateService,
    private stateService: StateService, private workflowService: WorkflowService, private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Dialogdata) {
  }

  ngOnInit() {
    this.versionModalService.version.subscribe(version => this.version = version);
    this.workflowSubscription = this.workflowService.workflow$.subscribe(workflow => this.workflow = workflow);
    this.versionModalService.testParameterFiles.subscribe(testParameterFiles => {
      this.testParameterFilePaths = [];
      this.originalTestParameterFilePaths = [];
      this.testParameterFiles = testParameterFiles;
      for (const testParameterFile of testParameterFiles) {
        this.testParameterFilePaths.push(testParameterFile.path);
        this.originalTestParameterFilePaths.push(testParameterFile.path);
      }
    });
    this.stateService.publicPage$.subscribe(publicPage => this.isPublic = publicPage);
    this.stateService.refreshMessage$.subscribe(refreshMessage => this.refreshMessage = refreshMessage);
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

  public saveChanges() {
    // Store the unsaved test files if valid and exist
    if (this.testParameterFilePath.length > 0) {
      this.addTestParameterFile();
    }

    this.versionModalService.saveVersion(this.version, this.originalTestParameterFilePaths,
      this.testParameterFilePaths, this.workflow.mode);
  }

  // Validation starts here, should move most of these to a service somehow
  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    if (this.currentForm === this.versionEditorForm) { return; }
    this.versionEditorForm = this.currentForm;
    if (this.versionEditorForm) {
      this.versionEditorForm.valueChanges.pipe(debounceTime(formInputDebounceTime))
        .subscribe(data => this.onValueChanged(data));
    }
  }
  onValueChanged(data?: any) {
    if (!this.versionEditorForm) { return; }
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
    this.workflowSubscription.unsubscribe();
  }
}
