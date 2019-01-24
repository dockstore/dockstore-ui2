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
import { Component, OnInit, Inject } from '@angular/core';
import { UpdateOrganizationDescriptionService } from '../state/update-organization-description.service';
import { UpdateOrganizationDescriptionQuery } from '../state/update-organization-description.query';
import { MAT_DIALOG_DATA } from '@angular/material';
import { AkitaNgFormsManager } from '@datorama/akita-ng-forms-manager';
import { FormGroup, AbstractControl } from '@angular/forms';

@Component({
  templateUrl: './update-organization-description.component.html',
  styleUrls: ['./update-organization-description.component.scss']
})
export class UpdateOrganizationDescriptionComponent implements OnInit {
  updateOrganizationDescriptionForm: FormGroup;

  constructor(private updateOrganizationDescriptionQuery: UpdateOrganizationDescriptionQuery,
              private updateOrganizationDescriptionService: UpdateOrganizationDescriptionService, @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.updateOrganizationDescriptionForm = this.updateOrganizationDescriptionService.createForm(this.data);
  }

  updateOrganizationDescription() {
    this.updateOrganizationDescriptionService.updateOrganizationDescription(this.updateOrganizationDescriptionForm);
  }

  get descriptionValue(): AbstractControl {
    return this.updateOrganizationDescriptionForm.get('description').value;
  }
}
