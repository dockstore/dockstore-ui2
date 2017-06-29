import { StateService } from './../../shared/state.service';
import { NgForm } from '@angular/forms';
import { RegisterToolService } from './register-tool.service';
import { Component, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { validationMessages, formErrors, validationPatterns } from '../../shared/validationMessages.model';
import { Repository } from './../../shared/enum/Repository.enum';

@Component({
  selector: 'app-register-tool',
  templateUrl: './register-tool.component.html',
  styleUrls: ['./register-tool.component.css'],
  providers: [RegisterToolService]
})
export class RegisterToolComponent implements OnInit, AfterViewChecked {
  private toolRegisterError: boolean;
  private tool: any;
  private formErrors = formErrors;
  private validationPatterns = validationPatterns;
  private customDockerRegistryPath: string;
  private showCustomDockerRegistryPath: boolean;
  private refreshingContainer: boolean;

  registerToolForm: NgForm;
  @ViewChild('registerToolForm') currentForm: NgForm;

  constructor(private registerToolService: RegisterToolService, private stateService: StateService) { }

  isInvalidCustomRegistry() {
    return this.registerToolService.isInvalidCustomRegistry(this.tool, this.customDockerRegistryPath);
  }

  repositoryKeys(): Array<string> {
    return this.registerToolService.repositoryKeys();
  }

  registryKeys(): Array<string> {
    return this.registerToolService.registryKeys();
  }

  friendlyRegistryKeys(): Array<string> {
    return this.registerToolService.friendlyRegistryKeys();
  }

  friendlyRepositoryKeys(): Array<string> {
    return this.registerToolService.friendlyRepositoryKeys();
  }

  isInvalidPrivateTool() {
    return this.registerToolService.isInvalidPrivateTool(this.tool);
  }

  registerTool() {
    this.registerToolService.registerTool(this.tool, this.customDockerRegistryPath);
  }

  getUnfriendlyRepositoryName(repository: Repository): string {
    return this.registerToolService.getFriendlyRepositoryName(repository);
  }

  checkForSpecialDockerRegistry() {
    return this.registerToolService.checkForSpecialDockerRegistry(this.tool);
  }

  setToolRegisterError() {
    return this.registerToolService.setToolRegisterError(null);
  }

  ngOnInit() {
    this.registerToolService.toolRegisterError.subscribe(toolRegisterError => this.toolRegisterError = toolRegisterError);
    this.registerToolService.tool.subscribe(tool => this.tool = tool);
    this.registerToolService.customDockerRegistryPath.subscribe(path => this.customDockerRegistryPath = path);
    this.registerToolService.showCustomDockerRegistryPath.subscribe(showPath => this.showCustomDockerRegistryPath = showPath);
    this.registerToolService.toolRegisterError.subscribe(error => this.toolRegisterError = error);
    this.stateService.refreshing.subscribe(status => this.refreshingContainer = status);
  }

  // Validation starts here, should move most of these to a service somehow
  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    if (this.currentForm === this.registerToolForm) { return; }
    this.registerToolForm = this.currentForm;
    if (this.registerToolForm) {
      this.registerToolForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
    }
  }
  onValueChanged(data?: any) {
    if (!this.registerToolForm) { return; }
    const form = this.registerToolForm.form;
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
