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
import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

import { StateService } from '../../shared/state.service';
import { Workflow } from '../../shared/swagger';
import {
  exampleDescriptorPatterns,
  formErrors,
  validationDescriptorPatterns,
  validationMessages,
} from '../../shared/validationMessages.model';
import { RegisterWorkflowModalService } from './register-workflow-modal.service';

@Component({
  selector: 'app-register-workflow-modal',
  templateUrl: './register-workflow-modal.component.html',
  styleUrls: ['./register-workflow-modal.component.css']
})
export class RegisterWorkflowModalComponent implements OnInit, AfterViewChecked {
  public formErrors = formErrors;
  public validationPatterns = validationDescriptorPatterns;
  public examplePatterns = exampleDescriptorPatterns;
  public workflow: Workflow;
  public workflowRegisterError;
  public isModalShown: boolean;
  public refreshMessage: string;
  public descriptorValidationPattern;
  public descriptorLanguages$: Observable<Array<string>>;
  public hostedWorkflow = {
    name: '',
    descriptorType: 'cwl'
  };
  public options = [
    {
      label: 'Use CWL, WDL or NextFlow from GitHub, BitBucket, etc.',
      value: 0
    },
    {
      label: 'Create and save CWL or WDL on Dockstore.org',
      value: 1
    }
  ];
  public selectedOption = this.options[0];

  registerWorkflowForm: NgForm;
  @ViewChild('registerWorkflowForm') currentForm: NgForm;

  constructor(private registerWorkflowModalService: RegisterWorkflowModalService, private stateService: StateService) {
  }

  friendlyRepositoryKeys(): Array<string> {
    return this.registerWorkflowModalService.friendlyRepositoryKeys();
  }

  clearWorkflowRegisterError(): void {
    this.registerWorkflowModalService.clearWorkflowRegisterError();
  }

  ngOnInit() {
    this.registerWorkflowModalService.workflow.subscribe(workflow => this.workflow = workflow);
    this.registerWorkflowModalService.workflowRegisterError$.subscribe(
      workflowRegisterError => this.workflowRegisterError = workflowRegisterError);
    this.registerWorkflowModalService.isModalShown$.subscribe(isModalShown => this.isModalShown = isModalShown);
    this.stateService.refreshMessage$.subscribe(refreshMessage => this.refreshMessage = refreshMessage);
    this.descriptorLanguages$ = this.registerWorkflowModalService.descriptorLanguages$;
    // Using this to set the initial validation pattern.  TODO: find a better way
    this.descriptorLanguages$.subscribe((languages: Array<string>) => {
      if (languages && languages.length > 0) {
        this.changeDescriptorType(languages[0].toLowerCase());
      }
    });
  }

  registerWorkflow() {
    this.registerWorkflowModalService.registerWorkflow();
  }

  registerHostedWorkflow() {
    this.registerWorkflowModalService.registerHostedWorkflow(this.hostedWorkflow);
  }

  showModal() {
    this.registerWorkflowModalService.setIsModalShown(true);
  }

  hideModal() {
    this.registerWorkflowModalService.setIsModalShown(false);
  }


  // Validation starts here, should move most of these to a service somehow
  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    if (this.currentForm === this.registerWorkflowForm) { return; }
    this.registerWorkflowForm = this.currentForm;
    if (this.registerWorkflowForm) {
      this.registerWorkflowForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
    }
  }
  onValueChanged(data?: any) {
    if (!this.registerWorkflowForm) { return; }
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
              formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
  // Validation ends here

  /**
   * This is triggered when the descriptor type changes in the dropdown menu.
   * Change the descriptor pattern required for validation when this happens.
   * TODO: Also change the form error message and reset the others
   *
   * @param {string} descriptorType  The current selected descriptor type
   * @memberof RegisterWorkflowModalComponent
   */
  changeDescriptorType(descriptorType: string): void {
    this.workflow.descriptorType = descriptorType;
    switch (descriptorType) {
      case 'cwl': {
        this.descriptorValidationPattern = validationDescriptorPatterns.cwlPath;
        break;
      }
      case 'wdl': {
        this.descriptorValidationPattern = validationDescriptorPatterns.wdlPath;
        break;
      }
      case 'nextflow': {
        this.descriptorValidationPattern = validationDescriptorPatterns.nflPath;
        break;
      }
      default: {
        console.log('Unrecognized descriptor type: ' + descriptorType);
        this.descriptorValidationPattern = '.*';
      }
    }
  }
}
