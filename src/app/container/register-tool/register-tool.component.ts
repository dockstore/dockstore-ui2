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

import { StateService } from './../../shared/state.service';
import { NgForm } from '@angular/forms';
import { RegisterToolService } from './register-tool.service';
import { Component, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { validationMessages, formErrors, validationPatterns } from '../../shared/validationMessages.model';
import { Repository } from './../../shared/enum/Repository.enum';

@Component({
  selector: 'app-register-tool',
  templateUrl: './register-tool.component.html',
  styleUrls: ['./register-tool.component.css']
})
export class RegisterToolComponent implements OnInit, AfterViewChecked {
  public toolRegisterError: boolean;
  public tool: any;
  public formErrors = formErrors;
  public validationPatterns = validationPatterns;
  public customDockerRegistryPath: string;
  public showCustomDockerRegistryPath: boolean;
  public refreshing: boolean;
  public isModalShown: boolean;

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

  clearToolRegisterError() {
    this.registerToolService.setToolRegisterError(null);
  }

  hideModal() {
    this.registerToolService.setIsModalShown(false);
    this.clearToolRegisterError();
  }

  showModal() {
    this.registerToolService.setIsModalShown(true);
  }

  ngOnInit() {
    this.registerToolService.toolRegisterError.subscribe(toolRegisterError => this.toolRegisterError = toolRegisterError);
    this.registerToolService.tool.subscribe(tool => this.tool = tool);
    this.registerToolService.customDockerRegistryPath.subscribe(path => this.customDockerRegistryPath = path);
    this.registerToolService.showCustomDockerRegistryPath.subscribe(showPath => this.showCustomDockerRegistryPath = showPath);
    this.registerToolService.toolRegisterError.subscribe(error => this.toolRegisterError = error);
    this.stateService.refreshing.subscribe(status => this.refreshing = status);
    this.registerToolService.isModalShown.subscribe(isModalShown => this.isModalShown = isModalShown);
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
