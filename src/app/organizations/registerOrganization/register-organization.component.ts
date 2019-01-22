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
import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AkitaNgFormsManager } from '@datorama/akita-ng-forms-manager';

import { RegisterOrganizationService } from '../state/register-organization.service';
import { TagEditorMode } from '../../shared/enum/tagEditorMode.enum';

// This is recorded into the Akita state
export interface FormsState {
  registerOrganization: {
    name: string;
    topic: string;
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
  public title: string;
  public TagEditorMode = TagEditorMode;
  constructor(
    public dialogref: MatDialogRef<RegisterOrganizationComponent>,
    private registerOrganizationService: RegisterOrganizationService,
    private formsManager: AkitaNgFormsManager<FormsState>,
    private builder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.formsManager.remove('registerOrganization');
    let name = null;
    let topic = null;
    let link = null;
    let location = null;
    let contactEmail = null;
    if (this.data.mode === TagEditorMode.Add) {
      this.title = 'Add Organization';
    } else {
      this.title = 'Edit Organization';
      name = this.data.organization.name;
      topic = this.data.organization.topic;
      link = this.data.organization.link;
      location = this.data.organization.location;
      contactEmail = this.data.organization.email;
    }
    this.registerOrganizationForm = this.builder.group({
      name: [name, [
        Validators.required,
        Validators.maxLength(39),
        Validators.minLength(3),
        Validators.pattern(this.registerOrganizationService.organizationNameRegex)
      ]],
      topic: [topic, Validators.required],
      link: [link, Validators.pattern(this.registerOrganizationService.urlRegex)],
      location: [location],
      contactEmail: [contactEmail, [Validators.email]],
    });
    this.formsManager.upsert('registerOrganization', this.registerOrganizationForm);
  }

  addOrganization(): void {
    if (this.data.mode === TagEditorMode.Add) {
      this.registerOrganizationService.addOrganization(this.registerOrganizationForm.value);
    } else {
      this.registerOrganizationService.editOrganization(this.registerOrganizationForm.value, this.data.organization.id);
    }
  }

  get name(): AbstractControl {
    return this.registerOrganizationForm.get('name');
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

  ngOnDestroy(): void {
    this.formsManager.unsubscribe();
  }
}
