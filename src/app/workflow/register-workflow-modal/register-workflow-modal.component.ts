import { Workflow } from './../../shared/swagger/model/workflow';
import { NgForm } from '@angular/forms';
import { formErrors, validationPatterns, validationMessages } from './../../shared/validationMessages.model';
import { RegisterWorkflowModalService } from './register-workflow-modal.service';
import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-register-workflow-modal',
  templateUrl: './register-workflow-modal.component.html',
  styleUrls: ['./register-workflow-modal.component.css']
})
export class RegisterWorkflowModalComponent implements OnInit, AfterViewChecked {
  private formErrors = formErrors;
  private validationPatterns = validationPatterns;
  private workflow: Workflow;
  private cwlTestParameterFilePath: string;
  private workflowRegisterError;

  registerWorkflowForm: NgForm;
  @ViewChild('registerWorkflowForm') currentForm: NgForm;

  @ViewChild('registerWorkflowModal') public registerWorkflowModal: ModalDirective;

  constructor(private registerWorkflowModalService: RegisterWorkflowModalService) {
    this.registerWorkflowModalService.workflow.subscribe(workflow => this.workflow = workflow);
    this.registerWorkflowModalService.workflowRegisterError.subscribe(
      workflowRegisterError => this.workflowRegisterError = workflowRegisterError);
   }

  friendlyRepositoryKeys(): Array<string> {
    return this.registerWorkflowModalService.friendlyRepositoryKeys;
  }

  getDescriptorTypes(): Array<string> {
    return this.registerWorkflowModalService.descriptorTypes;
  }

  clearWorkflowRegisterError(): void {
    this.registerWorkflowModalService.clearWorkflowRegisterError();
  }

  ngOnInit() {
  }

  // Validation starts here, should move most of these to a service somehow
  ngAfterViewChecked() {
    this.formChanged();
  }

  registerWorkflow() {
    this.registerWorkflowModalService.registerWorkflow(this.registerWorkflowModal, this.cwlTestParameterFilePath);
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

}
