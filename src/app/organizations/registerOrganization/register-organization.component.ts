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
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { AkitaNgFormsManager } from '@datorama/akita-ng-forms-manager';

import { RegisterOrganizationService } from '../state/register-organization.service';

// This is recorded into the Akita state
export interface FormsState {
  registerOrganization: {
    name: string;
    description: string;
    link: string;
    location: string;
    contactEmail: string;
  };
}

@Component({
  selector: 'register-organization',
  templateUrl: './register-organization.component.html',
  styleUrls: ['./register-organization.component.scss']
})
export class RegisterOrganizationComponent implements OnInit, OnDestroy {
  registerOrganizationForm: FormGroup;
  constructor(
    public dialogref: MatDialogRef<RegisterOrganizationComponent>,
    private registerOrganizationService: RegisterOrganizationService,
    private formsManager: AkitaNgFormsManager<FormsState>,
    private builder: FormBuilder
  ) { }

  ngOnInit() {
    this.registerOrganizationForm = this.builder.group({
      name: [null, [Validators.required, Validators.maxLength(39), Validators.minLength(3)]],
      description: [null, Validators.required],
      link: [null],
      location: [null],
      contactEmail: [null, [Validators.required, Validators.email]],
    });
    this.formsManager.upsert('registerOrganization', this.registerOrganizationForm);
  }

  addOrganization(): void {
    this.registerOrganizationService.addOrganization(this.registerOrganizationForm.value);
  }

  get name(): AbstractControl {
    return this.registerOrganizationForm.get('name');
  }

  get description(): AbstractControl {
    return this.registerOrganizationForm.get('description');
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

  ngOnDestroy(): void {
    this.formsManager.unsubscribe();
  }
}
