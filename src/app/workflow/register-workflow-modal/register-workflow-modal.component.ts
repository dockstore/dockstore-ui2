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
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { DescriptorLanguageService } from 'app/shared/entry/descriptor-language.service';
import { SessionQuery } from 'app/shared/session/session.query';
import { UserQuery } from 'app/shared/user/user.query';
import { Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { AlertQuery } from '../../shared/alert/state/alert.query';
import { formInputDebounceTime } from '../../shared/constants';
import { Dockstore } from '../../shared/dockstore.model';
import { BioWorkflow, EntryType, Service, ToolDescriptor, Workflow } from '../../shared/openapi';
import { Tooltip } from '../../shared/tooltip';

import {
  exampleDescriptorPatterns,
  formErrors,
  validationDescriptorPatterns,
  validationMessages,
} from '../../shared/validationMessages.model';
import { RegisterWorkflowModalService } from './register-workflow-modal.service';
import { MapFriendlyValuesPipe } from '../../search/map-friendly-values.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { EntryWizardComponent } from '../../shared/entry-wizard/entry-wizard.component';
import { RegisterGithubAppComponent } from '../../shared/register-github-app/register-github-app.component';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf, AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { AlertComponent } from '../../shared/alert/alert.component';
import { MatChipsModule } from '@angular/material/chips';
import { PreviewWarningComponent } from 'app/preview-warning/preview-warning.component';

export interface HostedWorkflowObject {
  name: string;
  descriptorType: ToolDescriptor.TypeEnum;
}

@Component({
  selector: 'app-register-workflow-modal',
  templateUrl: './register-workflow-modal.component.html',
  styleUrls: ['./register-workflow-modal.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    AlertComponent,
    MatStepperModule,
    MatIconModule,
    MatRadioModule,
    FormsModule,
    NgFor,
    NgIf,
    MatButtonModule,
    RegisterGithubAppComponent,
    EntryWizardComponent,
    FlexModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatTooltipModule,
    AsyncPipe,
    MapFriendlyValuesPipe,
    MatChipsModule,
    PreviewWarningComponent,
    NgTemplateOutlet,
  ],
})
export class RegisterWorkflowModalComponent implements OnInit, AfterViewChecked, OnDestroy {
  public EntryType = EntryType;
  public formErrors = formErrors;
  public validationPatterns = validationDescriptorPatterns;
  public validationMessage = validationMessages;
  public examplePatterns = exampleDescriptorPatterns;
  public workflow: Workflow;
  public workflowRegisterError;
  public isModalShown: boolean;
  public isRefreshing$: Observable<boolean>;
  public descriptorValidationPattern;
  public workflowPathError: string | null;
  public descriptorLanguages$: Observable<Array<Workflow.DescriptorTypeEnum>>;
  public Tooltip = Tooltip;
  public workflowPathPlaceholder: string;
  public isUsernameChangeRequired$: Observable<boolean>;
  public hostedWorkflow = {
    repository: '',
    descriptorType: Workflow.DescriptorTypeEnum.CWL,
    entryName: null,
  };
  public username$: Observable<string>;
  private baseOptions = [
    {
      label: 'Quickly register remote workflows',
      extendedLabel: 'Toggle repositories from GitHub, Bitbucket, and GitLab to quickly create workflows on Dockstore.',
      value: 1,
    },
    {
      label: 'Register custom remote workflows',
      extendedLabel: 'Manually add individual workflows at custom file paths from repositories on GitHub, Bitbucket, and GitLab.',
      value: 2,
    },
    {
      label: 'Create workflows on Dockstore.org',
      extendedLabel: 'All workflow files are created and stored directly on Dockstore.',
      value: 3,
    },
  ];
  private githubAppOption = {
    label: 'Register using GitHub Apps (Recommended)',
    extendedLabel: 'Install our GitHub App in an organization or your personal account to automatically sync workflows with GitHub.',
    value: 0,
  };
  public options = [this.githubAppOption, ...this.baseOptions];

  public selectedOption = this.options[0];

  private ngUnsubscribe: Subject<{}> = new Subject();

  Dockstore = Dockstore;

  DescriptorTypeEnum = Workflow.DescriptorTypeEnum;

  registerWorkflowForm: NgForm;
  @ViewChild('registerWorkflowForm') currentForm: NgForm;

  constructor(
    private registerWorkflowModalService: RegisterWorkflowModalService,
    public dialogRef: MatDialogRef<RegisterWorkflowModalComponent>,
    private alertQuery: AlertQuery,
    private descriptorLanguageService: DescriptorLanguageService,
    protected sessionQuery: SessionQuery,
    private userQuery: UserQuery
  ) {}

  friendlyRepositoryKeys(): Array<string> {
    return this.registerWorkflowModalService.friendlyRepositoryKeys().filter((key) => key !== 'Dockstore');
  }

  clearWorkflowRegisterError(): void {
    this.registerWorkflowModalService.clearWorkflowRegisterError();
  }

  ngOnInit() {
    this.username$ = this.userQuery.username$;
    this.isUsernameChangeRequired$ = this.userQuery.isUsernameChangeRequired$;
    this.isRefreshing$ = this.alertQuery.showInfo$;
    this.registerWorkflowModalService.workflow.pipe(takeUntil(this.ngUnsubscribe)).subscribe((workflow: Service | BioWorkflow) => {
      this.workflow = workflow;
      this.workflowPathPlaceholder = this.getWorkflowPathPlaceholder(this.workflow.descriptorType);
    });
    this.registerWorkflowModalService.workflowRegisterError$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((workflowRegisterError) => (this.workflowRegisterError = workflowRegisterError));
    this.registerWorkflowModalService.isModalShown$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isModalShown) => (this.isModalShown = isModalShown));
    this.descriptorLanguages$ = this.descriptorLanguageService.filteredDescriptorLanguages$;
    // Using this to set the initial validation pattern.  TODO: find a better way
    this.descriptorLanguages$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((languages: Array<Workflow.DescriptorTypeEnum>) => {
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

  getWorkflowPathPlaceholder(descriptorType: Workflow.DescriptorTypeEnum): string {
    return this.descriptorLanguageService.workflowDescriptorTypeEnumToExtendedDescriptorLanguageBean(descriptorType)
      .descriptorPathPlaceholder;
  }

  formChanged() {
    if (this.currentForm === this.registerWorkflowForm) {
      return;
    }
    this.registerWorkflowForm = this.currentForm;
    if (this.registerWorkflowForm) {
      this.registerWorkflowForm.valueChanges
        .pipe(debounceTime(formInputDebounceTime), takeUntil(this.ngUnsubscribe))
        .subscribe((data) => this.onValueChanged(data));
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
  changeDescriptorType(descriptorType: Workflow.DescriptorTypeEnum): void {
    this.descriptorValidationPattern =
      this.descriptorLanguageService.workflowDescriptorTypeEnumToExtendedDescriptorLanguageBean(descriptorType).descriptorPathPattern;
    switch (descriptorType) {
      case Workflow.DescriptorTypeEnum.SMK:
        this.workflowPathError = validationMessages.smkPath.pattern;
        break;
      case Workflow.DescriptorTypeEnum.CWL:
        this.workflowPathError = validationMessages.cwlPath.pattern;
        break;
      case Workflow.DescriptorTypeEnum.WDL:
        this.workflowPathError = validationMessages.wdlPath.pattern;
        break;
      case Workflow.DescriptorTypeEnum.NFL:
        this.workflowPathError = validationMessages.nflPath.pattern;
        break;
      case Workflow.DescriptorTypeEnum.Gxformat2:
        this.workflowPathError = validationMessages.galaxyPath.pattern;
        break;
      default:
        console.error('Unknown descriptor type: ' + descriptorType);
        this.workflowPathError = null;
    }
    this.workflowPathPlaceholder = this.getWorkflowPathPlaceholder(this.workflow.descriptorType);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
