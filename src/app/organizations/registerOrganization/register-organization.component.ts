/*
 *    Copyright 2019 OICR
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
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AkitaNgFormsManager } from '@datorama/akita-ng-forms-manager';
import { Organization } from 'app/shared/swagger';

import { TagEditorMode } from '../../shared/enum/tagEditorMode.enum';
import { FormsState, RegisterOrganizationService } from '../state/register-organization.service';

/**
 * This is actually create and update organization dialog
 *
 * @export
 * @class RegisterOrganizationComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-register-organization',
  templateUrl: './register-organization.component.html',
  styleUrls: ['./register-organization.component.scss'],
})
export class RegisterOrganizationComponent implements OnInit, OnDestroy {
  registerOrganizationForm: FormGroup;
  public title: string;
  public TagEditorMode = TagEditorMode;
  public Organization = Organization;
  constructor(
    private registerOrganizationService: RegisterOrganizationService,
    private formsManager: AkitaNgFormsManager<FormsState>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.registerOrganizationForm = this.registerOrganizationService.createForm(this.formsManager, this.data);
    this.title = this.registerOrganizationService.getTitle(this.data);
  }

  createOrUpdateOrganization(): void {
    this.registerOrganizationService.createOrUpdateOrganization(this.data, this.registerOrganizationForm);
  }

  get name(): AbstractControl {
    return this.registerOrganizationForm.get('name');
  }

  get displayName(): AbstractControl {
    return this.registerOrganizationForm.get('displayName');
  }

  get topic(): AbstractControl {
    return this.registerOrganizationForm.get('topic');
  }

  get link(): AbstractControl {
    return this.registerOrganizationForm.get('link');
  }

  get location(): AbstractControl {
    return this.registerOrganizationForm.get('location');
  }

  get contactEmail(): AbstractControl {
    return this.registerOrganizationForm.get('contactEmail');
  }

  get avatarUrl(): AbstractControl {
    return this.registerOrganizationForm.get('avatarUrl');
  }

  ngOnDestroy(): void {
    this.formsManager.unsubscribe();
  }
}
