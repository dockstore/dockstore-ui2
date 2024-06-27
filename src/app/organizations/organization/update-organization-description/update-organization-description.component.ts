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
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogModule } from '@angular/material/legacy-dialog';
import { UpdateOrganizationOrCollectionDescriptionService } from '../state/update-organization-description.service';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MarkdownWrapperComponent } from '../../../shared/markdown-wrapper/markdown-wrapper.component';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatLegacyTabsModule } from '@angular/material/legacy-tabs';
import { AlertComponent } from '../../../shared/alert/alert.component';

@Component({
  templateUrl: './update-organization-description.component.html',
  standalone: true,
  imports: [
    MatLegacyDialogModule,
    AlertComponent,
    MatLegacyTabsModule,
    FormsModule,
    FlexModule,
    ReactiveFormsModule,
    MatLegacyFormFieldModule,
    MatLegacyInputModule,
    MarkdownWrapperComponent,
    MatLegacyButtonModule,
    MatLegacyTooltipModule,
  ],
})
export class UpdateOrganizationOrCollectionDescriptionComponent implements OnInit {
  updateOrganizationOrCollectionDescriptionForm: UntypedFormGroup;

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

  get descriptionValue(): string {
    return this.updateOrganizationOrCollectionDescriptionForm.get('description').value;
  }
}
