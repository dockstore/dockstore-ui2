import { Tooltip } from '../../shared/tooltip';
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

import { NgForm } from '@angular/forms';
import { Component, OnInit, Input, ViewChild, AfterViewChecked } from '@angular/core';

import { StateService } from './../../shared/state.service';
import { SourceFile } from './../../shared/swagger/model/sourceFile';
import { DateService } from './../../shared/date.service';
import { VersionModalService } from './version-modal.service';
import { WorkflowVersion } from './../../shared/swagger/model/workflowVersion';
import { formErrors, validationMessages, validationPatterns } from './../../shared/validationMessages.model';

@Component({
  selector: 'app-version-modal',
  templateUrl: './version-modal.component.html',
  styleUrls: ['./version-modal.component.css']
})
export class VersionModalComponent implements OnInit, AfterViewChecked {
  isPublic: boolean;
  isModalShown: boolean;
  version: WorkflowVersion;
  testParameterFiles: SourceFile[];
  versionEditorForm: NgForm;
  public tooltip = Tooltip;
  public testParameterFilePaths: string[];
  originalTestParameterFilePaths: string[];
  public testParameterFilePath = '';
  formErrors = formErrors;
  validationMessages = validationMessages;
  validationPatterns = validationPatterns;
  public refreshMessage: string;
  @ViewChild('versionEditorForm') currentForm: NgForm;

  constructor(private versionModalService: VersionModalService, private dateService: DateService, private stateService: StateService) {
  }

  ngOnInit() {
    this.versionModalService.isModalShown$.subscribe(isModalShown => this.isModalShown = isModalShown);
    this.versionModalService.version.subscribe(version => this.version = version);
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

  public hideModal(): void {
    this.versionModalService.setIsModalShown(false);
  }

  public getDateTimeMessage(timestamp) {
    return this.dateService.getDateTimeMessage(timestamp);
  }

  public saveChanges() {
    // Store the unsaved test files if valid and exist
    if (this.testParameterFilePath.length > 0) {
      this.addTestParameterFile();
    }

    this.versionModalService.saveVersion(this.version, this.originalTestParameterFilePaths, this.testParameterFilePaths);
  }

  // Validation starts here, should move most of these to a service somehow
  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    if (this.currentForm === this.versionEditorForm) { return; }
    this.versionEditorForm = this.currentForm;
    if (this.versionEditorForm) {
      this.versionEditorForm.valueChanges
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
}
