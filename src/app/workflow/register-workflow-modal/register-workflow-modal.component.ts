/*
 *    Copyright 2018 OICR
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
import { AfterViewChecked, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MatRadioChange } from '@angular/material';
import { DescriptorLanguageService } from 'app/shared/entry/descriptor-language.service';
import { Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { AlertQuery } from '../../shared/alert/state/alert.query';
import { formInputDebounceTime } from '../../shared/constants';
import { BioWorkflow, Service, ToolDescriptor, Workflow } from '../../shared/swagger';
import { Tooltip } from '../../shared/tooltip';
import {
  exampleDescriptorPatterns,
  formErrors,
  validationDescriptorPatterns,
  validationMessages
} from '../../shared/validationMessages.model';
import { RegisterWorkflowModalService } from './register-workflow-modal.service';
import DescriptorTypeEnum = Workflow.DescriptorTypeEnum;

export interface HostedWorkflowObject {
  name: string;
  descriptorType: ToolDescriptor.TypeEnum;
}

@Component({
  selector: 'app-register-workflow-modal',
  templateUrl: './register-workflow-modal.component.html',
  styleUrls: ['./register-workflow-modal.component.scss']
})
export class RegisterWorkflowModalComponent implements OnInit, AfterViewChecked, OnDestroy {
  public formErrors = formErrors;
  public validationPatterns = validationDescriptorPatterns;
  public validationMessage = validationMessages;
  public examplePatterns = exampleDescriptorPatterns;
  public workflow: Workflow;
  public workflowRegisterError;
  public isModalShown: boolean;
  public isRefreshing$: Observable<boolean>;
  public descriptorValidationPattern;
  public descriptorLanguages$: Observable<Array<Workflow.DescriptorTypeEnum>>;
  public Tooltip = Tooltip;
  public hostedWorkflow = {
    repository: '',
    descriptorType: DescriptorTypeEnum.CWL,
    entryName: null
  };
  public options = [
    {
      label: 'Use CWL, WDL or Nextflow from GitHub, Bitbucket, etc.',
      value: 0
    },
    {
      label: 'Create and save CWL, WDL, or Nextflow on Dockstore.org',
      value: 1
    }
  ];
  public selectedOption = this.options[0];

  private ngUnsubscribe: Subject<{}> = new Subject();

  registerWorkflowForm: NgForm;
  @ViewChild('registerWorkflowForm') currentForm: NgForm;

  constructor(
    private registerWorkflowModalService: RegisterWorkflowModalService,
    public dialogRef: MatDialogRef<RegisterWorkflowModalComponent>,
    private alertQuery: AlertQuery,
    private descriptorLanguageService: DescriptorLanguageService
  ) {}

  friendlyRepositoryKeys(): Array<string> {
    return this.registerWorkflowModalService.friendlyRepositoryKeys().filter(key => key !== 'Dockstore');
  }

  clearWorkflowRegisterError(): void {
    this.registerWorkflowModalService.clearWorkflowRegisterError();
  }

  ngOnInit() {
    this.isRefreshing$ = this.alertQuery.showInfo$;
    this.registerWorkflowModalService.workflow
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((workflow: Service | BioWorkflow) => (this.workflow = workflow));
    this.registerWorkflowModalService.workflowRegisterError$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(workflowRegisterError => (this.workflowRegisterError = workflowRegisterError));
    this.registerWorkflowModalService.isModalShown$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(isModalShown => (this.isModalShown = isModalShown));
    this.descriptorLanguages$ = this.descriptorLanguageService.filteredDescriptorLanguages$;
    // Using this to set the initial validation pattern.  TODO: find a better way
    this.descriptorLanguages$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((languages: Array<DescriptorTypeEnum>) => {
      if (languages && languages.length > 0) {
        // Set the initial descriptor type selected
        this.workflow.descriptorType = languages[0];
        // Set the initial descriptor type pattern for the workflow path validation (mimics the user selecting the first radio button)
        this.changeDescriptorType(languages[0]);
      }
    });
    this.selectInitialSourceControlRepository();
  }

  /**
   * Playing favourites with GitHub by selecting it first
   *
   * @memberof RegisterWorkflowModalComponent
   */
  selectInitialSourceControlRepository() {
    if (this.friendlyRepositoryKeys().includes('GitHub')) {
      this.workflow.repository = 'GitHub';
    } else {
      this.workflow.repository = this.friendlyRepositoryKeys()[0];
    }
  }

  registerWorkflow() {
    this.registerWorkflowModalService.registerWorkflow(this.dialogRef);
  }

  registerHostedWorkflow() {
    this.registerWorkflowModalService.registerHostedWorkflow(this.hostedWorkflow, this.dialogRef);
  }

  hideModal() {
    this.dialogRef.close();
  }

  // Validation starts here, should move most of these to a HostedWorkflowService somehow
  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    if (this.currentForm === this.registerWorkflowForm) {
      return;
    }
    this.registerWorkflowForm = this.currentForm;
    if (this.registerWorkflowForm) {
      this.registerWorkflowForm.valueChanges
        .pipe(
          debounceTime(formInputDebounceTime),
          takeUntil(this.ngUnsubscribe)
        )
        .subscribe(data => this.onValueChanged(data));
    }
  }

  /**
   * Shows one form error at a time
   *
   * @param {*} [data]
   * @returns {void}
   * @memberof RegisterWorkflowModalComponent
   */
  onValueChanged(data?: any): void {
    if (!this.registerWorkflowForm) {
      return;
    }
    const form = this.registerWorkflowForm.form;
    for (const field in formErrors) {
      if (formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        formErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              formErrors[field] = messages[key];
            }
          }
        }
      }
    }
  }
  // Validation ends here

  /**
   * This is triggered when a descriptor type radio button is triggered
   *
   * @param {MatRadioChange} event
   * @memberof RegisterWorkflowModalComponent
   */
  radioButtonChange(event: MatRadioChange): void {
    this.changeDescriptorType(event.value);
  }

  /**
   * For when the descriptor type changes.
   * Change the descriptor pattern required for validation when this happens.
   * TODO: Also change the form error message and reset the others
   *
   * @param {ToolDescriptor.TypeEnum} descriptorType  The current selected descriptor type
   * @memberof RegisterWorkflowModalComponent
   */
  changeDescriptorType(descriptorType: DescriptorTypeEnum): void {
    switch (descriptorType) {
      case DescriptorTypeEnum.CWL: {
        this.descriptorValidationPattern = validationDescriptorPatterns.cwlPath;
        break;
      }
      case DescriptorTypeEnum.WDL: {
        this.descriptorValidationPattern = validationDescriptorPatterns.wdlPath;
        break;
      }
      case DescriptorTypeEnum.NFL: {
        this.descriptorValidationPattern = validationDescriptorPatterns.nflPath;
        break;
      }
      case DescriptorTypeEnum.Service: {
        this.descriptorValidationPattern = validationDescriptorPatterns.testParameterFilePath;
        break;
      }
      default: {
        console.log('Unrecognized descriptor type: ' + descriptorType);
        this.descriptorValidationPattern = '.*';
      }
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
