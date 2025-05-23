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
import { AbstractControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { NgFormsManager } from '@ngneat/forms-manager';
import { Organization } from 'app/shared/openapi';

import { TagEditorMode } from '../../shared/enum/tagEditorMode.enum';
import { FormsState, RegisterOrganizationService } from '../state/register-organization.service';
import { MatButtonModule } from '@angular/material/button';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AlertComponent } from '../../shared/alert/alert.component';
import { NgIf } from '@angular/common';

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
  standalone: true,
  imports: [
    MatDialogModule,
    NgIf,
    AlertComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatInputModule,
    FlexModule,
    MatButtonModule,
  ],
})
export class RegisterOrganizationComponent implements OnInit, OnDestroy {
  registerOrganizationForm: UntypedFormGroup;
  public title: string;
  public TagEditorMode = TagEditorMode;
  public Organization = Organization;
  constructor(
    private registerOrganizationService: RegisterOrganizationService,
    private formsManager: NgFormsManager<FormsState>,
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
