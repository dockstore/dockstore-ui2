import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { CheckerWorkflowService } from './../../checker-workflow.service';
import { ErrorService } from './../../error.service';
import { Workflow } from './../../swagger/model/workflow';
import { formErrors, validationDescriptorPatterns, validationMessages } from './../../validationMessages.model';
import { DescriptorLanguageService } from './../descriptor-language.service';
import { RegisterCheckerWorkflowService } from './register-checker-workflow.service';

@Component({
  selector: 'app-register-checker-workflow',
  templateUrl: './register-checker-workflow.component.html',
  styleUrls: ['./register-checker-workflow.component.scss']
})
export class RegisterCheckerWorkflowComponent implements OnInit, AfterViewChecked {

  constructor(private registerCheckerWorkflowService: RegisterCheckerWorkflowService,
    private checkerWorkflowService: CheckerWorkflowService, private errorService: ErrorService,
    private descriptorLanguageService: DescriptorLanguageService) { }
  public registerError: HttpErrorResponse;
  public isModalShown$: Observable<boolean>;
  public workflowPath: string;
  public testParameterFilePath: string;
  public syncTestJson: boolean;
  public formErrors = formErrors;
  public validationDescriptorPatterns = validationDescriptorPatterns;
  public validationMessages = validationMessages;
  public refreshMessage$: Observable<string>;
  public mode$: Observable<'add' | 'edit'>;
  public descriptorType: string;
  public descriptorLanguages: Array<string>;
  registerCheckerWorkflowForm: NgForm;
  @ViewChild('registerCheckerWorkflowForm') currentForm: NgForm;

  ngOnInit() {
    this.registerCheckerWorkflowService.errorObj$.subscribe((error: HttpErrorResponse) => {
      this.registerError = error;
    });
    this.mode$ = this.registerCheckerWorkflowService.mode$;
    this.isModalShown$ = this.registerCheckerWorkflowService.isModalShown$;
    this.clearForm();
    this.syncTestJson = false;
    this.refreshMessage$ = this.registerCheckerWorkflowService.refreshMessage$;
    this.descriptorLanguageService.descriptorLanguages$.subscribe((descriptorLanguages: Array<string>) => {
      this.descriptorLanguages = descriptorLanguages;
    });
    this.checkerWorkflowService.checkerWorkflow$.subscribe((workflow: Workflow) => {
      if (workflow) {
        this.workflowPath = workflow.workflow_path;
        this.testParameterFilePath = workflow.defaultTestParameterFilePath;
        this.descriptorType = workflow.descriptorType;
      } else {
        this.clearForm();
      }
    });
  }

  private clearForm(): void {
    this.workflowPath = '';
    this.testParameterFilePath = '';
    this.descriptorType = 'cwl';
  }

  hideModal(): void {
    this.registerCheckerWorkflowService.isModalShown$.next(false);
  }

  registerCheckerWorkflow(): void {
    this.registerCheckerWorkflowService.registerCheckerWorkflow(this.workflowPath, this.testParameterFilePath, this.descriptorType);
  }

  clearError(): void {
    this.registerCheckerWorkflowService.clearError();
  }

  // Validation starts here, should move most of these to a service somehow
  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged(): void {
    if (this.currentForm === this.registerCheckerWorkflowForm) { return; }
    this.registerCheckerWorkflowForm = this.currentForm;
    if (this.registerCheckerWorkflowForm) {
      this.registerCheckerWorkflowForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
    }
  }
  onValueChanged(data?: any): void {
    if (!this.registerCheckerWorkflowForm) { return; }
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
