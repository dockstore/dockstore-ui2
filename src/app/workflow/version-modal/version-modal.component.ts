import { NgForm } from '@angular/forms';
import { Component, OnInit, Input, ViewChild, AfterViewChecked } from '@angular/core';

import { StateService } from './../../shared/state.service';
import { SourceFile } from './../../shared/swagger/model/SourceFile';
import { DateService } from './../../shared/date.service';
import { VersionModalService } from './version-modal.service';
import { WorkflowVersion } from './../../shared/swagger/model/WorkflowVersion';
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
  public testParameterFilePaths: string[];
  originalTestParameterFilePaths: string[];
  private testParameterFilePath = '';
  formErrors = formErrors;
  validationMessages = validationMessages;
  validationPatterns = validationPatterns;
  refreshing: boolean;
  @ViewChild('versionEditorForm') currentForm: NgForm;

  constructor(private versionModalService: VersionModalService, private dateService: DateService, private stateService: StateService) {
  }

  ngOnInit() {
    this.versionModalService.isModalShown.subscribe(isModalShown => this.isModalShown = isModalShown);
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
    this.stateService.publicPage.subscribe(publicPage => this.isPublic = publicPage);
    this.stateService.refreshing.subscribe(refreshing => this.refreshing = refreshing);
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
}
