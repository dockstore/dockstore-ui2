/*
 *    Copyright 2018 OICR
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
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { ExtendedDescriptorLanguageBean } from 'app/entry/extendedDescriptorLanguage';
import { Observable } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { AlertQuery } from '../../alert/state/alert.query';
import { Base } from '../../base';
import { formInputDebounceTime } from '../../constants';
import { DescriptorTypeCompatService } from '../../descriptor-type-compat.service';
import { CheckerWorkflowQuery } from '../../state/checker-workflow.query';
import { ToolDescriptor } from '../../openapi';
import { DockstoreTool } from '../../openapi/model/dockstoreTool';
import { Entry } from '../../openapi/model/entry';
import { Workflow } from '../../openapi/model/workflow';
import { formErrors, validationDescriptorPatterns, validationMessages } from '../../validationMessages.model';
import { DescriptorLanguageService } from '../descriptor-language.service';
import { RegisterCheckerWorkflowService } from './register-checker-workflow.service';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AlertComponent } from '../../alert/alert.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexModule } from '@ngbracket/ngx-layout';

@Component({
  templateUrl: './register-checker-workflow.component.html',
  standalone: true,
  imports: [
    MatDialogModule,
    AlertComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    NgIf,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    MatButtonModule,
    AsyncPipe,
    FlexModule,
  ],
})
export class RegisterCheckerWorkflowComponent extends Base implements OnInit, AfterViewChecked {
  constructor(
    private registerCheckerWorkflowService: RegisterCheckerWorkflowService,
    private alertQuery: AlertQuery,
    private descriptorLanguageService: DescriptorLanguageService,
    private checkerWorkflowQuery: CheckerWorkflowQuery,
    private descriptorTypeCompatService: DescriptorTypeCompatService
  ) {
    super();
  }
  public registerError: HttpErrorResponse;
  public workflowPath = '';
  public testParameterFilePath = '';
  public syncTestJson: boolean;
  public formErrors = formErrors;
  public validationDescriptorPatterns = validationDescriptorPatterns;
  public validationMessages = validationMessages;
  public isRefreshing$: Observable<boolean>;
  public mode$: Observable<'add' | 'edit'>;
  public descriptorType: ToolDescriptor.TypeEnum;
  public descriptorLanguages: Array<string>;
  public descriptorPathPlaceholder: string;
  public descriptorPattern = validationDescriptorPatterns.workflowDescriptorPath;
  private entry: Entry;
  registerCheckerWorkflowForm: NgForm;
  isWorkflow = false;
  @ViewChild('registerCheckerWorkflowForm', { static: true }) currentForm: NgForm;

  ngOnInit() {
    this.checkerWorkflowQuery.entry$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((entry: Entry) => {
      this.entry = entry;
      if (entry) {
        this.isWorkflow = this.checkerWorkflowQuery.isEntryAWorkflow(entry);
        this.testParameterFilePath = this.getTestParameterFileDefault(entry, this.descriptorType);
        if (this.isWorkflow) {
          const workflowDescriptorTypeEnum = (<Workflow>this.entry).descriptorType;
          // Set checker workflow descriptor type to the same as the current workflow
          this.descriptorType = this.descriptorTypeCompatService.stringToDescriptorType(workflowDescriptorTypeEnum);
          this.updateDescriptorPattern(this.descriptorType);
        } else {
          // Set checker workflow descriptor type to CWL for now. TODO: Solve this once webservice changes are known.
          this.descriptorType = ToolDescriptor.TypeEnum.CWL;
          this.updateDescriptorPattern(this.descriptorType);
        }
      } else {
        this.testParameterFilePath = null;
        this.isWorkflow = null;
        this.descriptorType = null;
      }
    });
    this.mode$ = this.registerCheckerWorkflowService.mode$;
    this.syncTestJson = false;
    this.descriptorLanguageService.filteredDescriptorLanguages$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((descriptorLanguages: Array<Workflow.DescriptorTypeEnum>) => {
        this.descriptorLanguages = descriptorLanguages.filter(
          (language: Workflow.DescriptorTypeEnum) => language !== ToolDescriptor.TypeEnum.NFL
        );
      });
    this.isRefreshing$ = this.alertQuery.showInfo$;
  }

  updateDescriptorPattern(descriptorType: ToolDescriptor.TypeEnum): void {
    this.descriptorPathPlaceholder = this.descriptorLanguageService.toolDescriptorTypeEnumToPlaceholderDescriptor(descriptorType);
    this.descriptorPattern = this.descriptorLanguageService.getDescriptorPattern(descriptorType);
  }

  /**
   * Gets the test parameter file from the current entry
   *
   * @private
   * @param {Entry} entry The current entry
   * @param {string} descriptorType The descriptor type currently selected in the form
   * @returns {string} The default test parameter file to populate the form
   * @memberof RegisterCheckerWorkflowComponent
   */
  private getTestParameterFileDefault(entry: Entry, descriptorType: ToolDescriptor.TypeEnum): string {
    if (this.isWorkflow) {
      return (<Workflow>entry).defaultTestParameterFilePath;
    } else {
      switch (descriptorType) {
        case ToolDescriptor.TypeEnum.CWL: {
          return (<DockstoreTool>entry).defaultCWLTestParameterFile;
        }
        case ToolDescriptor.TypeEnum.WDL: {
          return (<DockstoreTool>entry).defaultWDLTestParameterFile;
        }
        default: {
          return '';
        }
      }
    }
  }

  registerCheckerWorkflow(): void {
    const extendedDescriptorLanguageBean: ExtendedDescriptorLanguageBean =
      this.descriptorLanguageService.toolDescriptorTypeEnumToExtendedDescriptorLanguageBean(this.descriptorType);
    if (extendedDescriptorLanguageBean) {
      this.registerCheckerWorkflowService.registerCheckerWorkflow(
        this.workflowPath,
        this.testParameterFilePath,
        extendedDescriptorLanguageBean.descriptorLanguageEnum
      );
    }
  }

  /**
   * Handles the event where the descriptor type in the form has changed
   * @param descriptorType The descriptor type current selected in the form
   */
  public onDescriptorTypeChange(descriptorType: ToolDescriptor.TypeEnum): void {
    this.testParameterFilePath = this.getTestParameterFileDefault(this.entry, descriptorType);
    this.updateDescriptorPattern(descriptorType);
  }

  // Validation starts here, should move most of these to a service somehow
  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged(): void {
    if (this.currentForm === this.registerCheckerWorkflowForm) {
      return;
    }
    this.registerCheckerWorkflowForm = this.currentForm;
    if (this.registerCheckerWorkflowForm) {
      this.registerCheckerWorkflowForm.valueChanges
        .pipe(debounceTime(formInputDebounceTime), takeUntil(this.ngUnsubscribe))
        .subscribe((data) => this.onValueChanged(data));
    }
  }
  onValueChanged(data?: any): void {
    if (!this.registerCheckerWorkflowForm) {
      return;
    }
    const form = this.registerCheckerWorkflowForm.form;
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
