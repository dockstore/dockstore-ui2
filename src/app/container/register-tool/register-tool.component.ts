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
import { SessionQuery } from 'app/shared/session/session.query';
import { Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { AlertQuery } from '../../shared/alert/state/alert.query';
import { AlertService } from '../../shared/alert/state/alert.service';
import { formInputDebounceTime } from '../../shared/constants';
import { formErrors, validationDescriptorPatterns, validationMessages } from '../../shared/validationMessages.model';
import { RegisterToolService } from './register-tool.service';
import { Dockstore } from '../../shared/dockstore.model';

interface HostedTool {
  path: string;
  registry: string;
  registryProvider: string;
  entryName?: string;
}

enum OptionChoice {
  GitHubApps,
  Hosted,
  QuayAuto,
  Remote,
}

@Component({
  selector: 'app-register-tool',
  templateUrl: './register-tool.component.html',
  styleUrls: ['./register-tool.component.css'],
})
export class RegisterToolComponent implements OnInit, AfterViewChecked, OnDestroy {
  public toolRegisterError: boolean;
  public tool: any;
  public formErrors = formErrors;
  public validationPatterns = validationDescriptorPatterns;
  public validationMessages = validationMessages;
  public customDockerRegistryPath: string;
  public showCustomDockerRegistryPath: boolean;
  public isModalShown: boolean;
  public disablePrivateCheckbox = false;
  public loading$: Observable<boolean>;
  public isRefreshing$: Observable<boolean>;
  public gitHubAppInstallationLink$: Observable<string>;
  public hostedTool: HostedTool = {
    path: '',
    registry: 'quay.io',
    registryProvider: 'Quay.io',
    entryName: undefined,
  };

  public get OptionChoice() {
    return OptionChoice;
  }

  public options = [
    {
      label: 'Register using GitHub Apps (Recommended)',
      extendedLabel:
        'Install our GitHub App on your repository/organization to automatically sync tools with GitHub. Allows you to register a tool descriptor without linking to a Docker image you own.',
      value: OptionChoice.GitHubApps,
    },
    {
      label: 'Create tool with descriptor(s) on Dockstore.org',
      extendedLabel:
        'Manually add individual tools with descriptor(s) stored on Dockstore.org. Docker images are stored on sites like Quay.io and DockerHub.',
      value: OptionChoice.Hosted,
    },
    {
      label: 'Quickly register Quay.io tools',
      extendedLabel: 'Select repositories from Quay.io to quickly create tools on Dockstore.',
      value: OptionChoice.QuayAuto,
    },
    {
      label: 'Create tool with descriptor(s) on remote sites',
      extendedLabel:
        'Manually add individual tools with descriptor(s) from sites like GitHub, BitBucket, and GitLab. Docker images are stored on sites like Quay.io and DockerHub.',
      value: OptionChoice.Remote,
    },
  ];

  public selectedOption = this.options[0];
  private ngUnsubscribe: Subject<{}> = new Subject();
  Dockstore = Dockstore;

  registerToolForm: NgForm;
  @ViewChild('registerToolForm') currentForm: NgForm;
  constructor(
    private registerToolService: RegisterToolService,
    private alertQuery: AlertQuery,
    private alertService: AlertService,
    private sessionQuery: SessionQuery
  ) {}

  isInvalidCustomRegistry() {
    return this.registerToolService.isInvalidCustomRegistry(this.tool, this.customDockerRegistryPath);
  }

  registryKeys(): Array<string> {
    return this.registerToolService.registryKeys();
  }

  friendlyRegistryKeys(): Array<string> {
    return this.registerToolService.friendlyRegistryKeys();
  }

  friendlyRepositoryKeys(): Array<string> {
    const friendlyRepositoryKeys = this.registerToolService.friendlyRepositoryKeys();
    return friendlyRepositoryKeys.filter((key) => key !== 'Dockstore');
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

  togglePrivateAccess() {
    // Amazon ECR is a public and private registry, but it has custom docker paths for its private registries.
    // If tool is private, allow the docker registry path to be edited.
    // If tool is public, disable the docker registry path input field and set it to the public docker registry path (public.ecr.aws)
    if (this.tool.irProvider === 'Amazon ECR') {
      this.registerToolService.setShowCustomDockerRegistryPath(this.tool.private_access);
      if (this.tool.private_access) {
        this.registerToolService.setCustomDockerRegistryPath(null);
      } else {
        this.registerToolService.setCustomDockerRegistryPath(this.registerToolService.getImageRegistryPath(this.tool.irProvider));
      }
    }
  }

  hideModal() {
    this.registerToolService.setIsModalShown(false);
    this.alertService.clearEverything();
  }

  ngOnInit() {
    this.loading$ = this.sessionQuery.loadingDialog$;
    this.gitHubAppInstallationLink$ = this.sessionQuery.gitHubAppInstallationLink$;
    this.registerToolService.toolRegisterError
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((toolRegisterError) => (this.toolRegisterError = toolRegisterError));
    this.registerToolService.tool.pipe(takeUntil(this.ngUnsubscribe)).subscribe((tool) => (this.tool = tool));
    this.registerToolService.customDockerRegistryPath
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((path) => (this.customDockerRegistryPath = path));
    this.registerToolService.showCustomDockerRegistryPath
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((showPath) => (this.showCustomDockerRegistryPath = showPath));
    this.registerToolService.toolRegisterError.pipe(takeUntil(this.ngUnsubscribe)).subscribe((error) => (this.toolRegisterError = error));
    this.isRefreshing$ = this.alertQuery.showInfo$;
    this.registerToolService.isModalShown
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isModalShown) => (this.isModalShown = isModalShown));
  }

  // Validation starts here, should move most of these to a service somehow
  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    if (this.currentForm === this.registerToolForm) {
      return;
    }
    this.registerToolForm = this.currentForm;
    if (this.registerToolForm) {
      this.registerToolForm.valueChanges
        .pipe(debounceTime(formInputDebounceTime), takeUntil(this.ngUnsubscribe))
        .subscribe((data) => this.onValueChanged(data));
    }
  }

  // Shows one form error at a time
  onValueChanged(data?: any) {
    if (!this.registerToolForm) {
      return;
    }
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
              formErrors[field] = messages[key];
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
