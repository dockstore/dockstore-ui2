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
import { AfterViewChecked, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { AlertQuery } from '../../shared/alert/state/alert.query';
import { AlertService } from '../../shared/alert/state/alert.service';
import { formInputDebounceTime } from '../../shared/constants';
import { formErrors, validationDescriptorPatterns, validationMessages } from '../../shared/validationMessages.model';
import { RegisterToolService } from './register-tool.service';

@Component({
  selector: 'app-register-tool',
  templateUrl: './register-tool.component.html',
  styleUrls: ['./register-tool.component.css']
})
export class RegisterToolComponent implements OnInit, AfterViewChecked, OnDestroy {
  public toolRegisterError: boolean;
  public tool: any;
  public formErrors = formErrors;
  public validationPatterns = validationDescriptorPatterns;
  public customDockerRegistryPath: string;
  public showCustomDockerRegistryPath: boolean;
  public isModalShown: boolean;
  public disablePrivateCheckbox = false;
  public isRefreshing$: Observable<boolean>;
  public hostedTool = {
    path: '',
    registry: 'quay.io',
    registryProvider: 'Quay.io',
    entryName: undefined
  };
  public options = [
    {
      label: 'Use CWL, WDL or Nextflow from GitHub, BitBucket, etc.',
      value: 0
    },
    {
      label: 'Create and save CWL, WDL, or Nextflow on Dockstore.org',
      value: 1
    }
  ];
  public selectedOption = this.options[0];
  private ngUnsubscribe: Subject<{}> = new Subject();

  registerToolForm: NgForm;
  @ViewChild('registerToolForm') currentForm: NgForm;
  constructor(private registerToolService: RegisterToolService, private alertQuery: AlertQuery, private alertService: AlertService) { }

  isInvalidCustomRegistry() {
    return this.registerToolService.isInvalidCustomRegistry(this.tool, this.customDockerRegistryPath);
  }

  registryKeys(): Array<string> {
    return this.registerToolService.registryKeys();
  }

  friendlyRegistryKeys(): Array<string> {
    // TODO: Remove this section when GitLab is enabled
    const friendlyRegistryKeys = this.registerToolService.friendlyRegistryKeys();
    return friendlyRegistryKeys.filter(key => key !== 'GitLab');
    // TODO: Uncomment this section when GitLab is enabled
    // return this.registerToolService.friendlyRegistryKeys();
  }

  friendlyRepositoryKeys(): Array<string> {
    // TODO: Remove this section when GitLab is enabled
    const friendlyRepositoryKeys = this.registerToolService.friendlyRepositoryKeys();
    return friendlyRepositoryKeys.filter(key => key !== 'GitLab' && key !== 'Dockstore');
    // TODO: Uncomment this section when GitLab is enabled
    // return this.registerToolService.friendlyRepositoryKeys();
  }

  isInvalidPrivateTool() {
    return this.registerToolService.isInvalidPrivateTool(this.tool);
  }

  registerTool() {
    this.registerToolService.registerTool(this.tool, this.customDockerRegistryPath);
  }

  registerHostedTool() {
    this.registerToolService.registerHostedTool(this.hostedTool);
  }

  getToolRegistry(registry: string, customDockerRegistryPath: string): string {
    return this.registerToolService.getToolRegistry(registry, customDockerRegistryPath);
  }

  checkForSpecialDockerRegistry(): void {
    this.registerToolService.checkForSpecialDockerRegistry(this.tool);
    this.disablePrivateCheckbox = this.registerToolService.disabledPrivateCheckbox;
  }


  hideModal() {
    this.registerToolService.setIsModalShown(false);
    this.alertService.clearEverything();
  }

  showModal() {
    this.registerToolService.setIsModalShown(true);
  }

  ngOnInit() {
    this.registerToolService.toolRegisterError.pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe(toolRegisterError => this.toolRegisterError = toolRegisterError);
    this.registerToolService.tool.pipe(
      takeUntil(this.ngUnsubscribe)).subscribe(tool => this.tool = tool);
    this.registerToolService.customDockerRegistryPath.pipe(
      takeUntil(this.ngUnsubscribe)).subscribe(path => this.customDockerRegistryPath = path);
    this.registerToolService.showCustomDockerRegistryPath.pipe(
      takeUntil(this.ngUnsubscribe)).subscribe(showPath => this.showCustomDockerRegistryPath = showPath);
    this.registerToolService.toolRegisterError.pipe(
      takeUntil(this.ngUnsubscribe)).subscribe(error => this.toolRegisterError = error);
    this.isRefreshing$ = this.alertQuery.showInfo$;
    this.registerToolService.isModalShown.pipe(
      takeUntil(this.ngUnsubscribe)).subscribe(isModalShown => this.isModalShown = isModalShown);
  }

  // Validation starts here, should move most of these to a service somehow
  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    if (this.currentForm === this.registerToolForm) { return; }
    this.registerToolForm = this.currentForm;
    if (this.registerToolForm) {
      this.registerToolForm.valueChanges.pipe(debounceTime(formInputDebounceTime))
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

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
