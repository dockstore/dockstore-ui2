import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UpsertOrganizationMemberComponent } from './upsert-organization-member/upsert-organization-member.component';
import { MatDialogModule, MatTooltipModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule } from '@angular/material';
import { RefreshAlertModule } from '../shared/alert/alert.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatSelectModule,
    ReactiveFormsModule,
    RefreshAlertModule
   ],
  declarations: [ UpsertOrganizationMemberComponent ],
  entryComponents: [ UpsertOrganizationMemberComponent ]
})
export class UpsertOrganizationMemberModule { }
