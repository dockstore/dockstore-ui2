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
import { UpdateOrganizationOrCollectionDescriptionService } from '../state/update-organization-description.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, AbstractControl } from '@angular/forms';

@Component({
  templateUrl: './update-organization-description.component.html',
  styleUrls: ['./update-organization-description.component.scss']
})
export class UpdateOrganizationOrCollectionDescriptionComponent implements OnInit {
  updateOrganizationOrCollectionDescriptionForm: FormGroup;

  constructor(
    private updateOrganizationOrDescriptionDescriptionService: UpdateOrganizationOrCollectionDescriptionService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.updateOrganizationOrCollectionDescriptionForm = this.updateOrganizationOrDescriptionDescriptionService.createForm(this.data);
  }

  updateOrganizationDescription() {
    if (this.data.type === 'collection') {
      this.updateOrganizationOrDescriptionDescriptionService.updateCollectionDescription(
        this.updateOrganizationOrCollectionDescriptionForm,
        this.data.collectionId
      );
    } else if (this.data.type === 'organization') {
      this.updateOrganizationOrDescriptionDescriptionService.updateOrganizationDescription(
        this.updateOrganizationOrCollectionDescriptionForm
      );
    }
  }

  get descriptionValue(): AbstractControl {
    return this.updateOrganizationOrCollectionDescriptionForm.get('description').value;
  }
}
