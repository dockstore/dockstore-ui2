import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { RefreshAlertModule } from '../../shared/alert/alert.module';
import { CustomMaterialModule } from '../../shared/modules/material.module';
import { StarOrganizationService } from '../../shared/star-organization.service';
import { OrganizationStarringService } from './organization-starring/organization-starring.service';
import { NgxJsonLdModule } from '@ngx-lite/json-ld';
// tslint:disable-next-line: max-line-length
import { UpdateOrganizationOrCollectionDescriptionComponent } from './update-organization-description/update-organization-description.component';
import { OrgSchemaService } from '../../shared/org-schema.service';

@NgModule({
  imports: [CommonModule, FlexLayoutModule, CustomMaterialModule, RefreshAlertModule, ReactiveFormsModule, MarkdownModule, NgxJsonLdModule],
  providers: [OrganizationStarringService, StarOrganizationService, OrgSchemaService],
  declarations: [UpdateOrganizationOrCollectionDescriptionComponent],
  entryComponents: [UpdateOrganizationOrCollectionDescriptionComponent],
  exports: [NgxJsonLdModule]
})
export class UpdateOrganizationDescriptionModule {}
