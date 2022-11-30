import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { RefreshAlertModule } from '../../shared/alert/alert.module';
import { JsonLdModule } from '../../shared/modules/json-ld.module';
import { MarkdownWrapperModule } from '../../shared/modules/markdown-wrapper.module';
import { CustomMaterialModule } from '../../shared/modules/material.module';
import { OrgSchemaService } from '../../shared/org-schema.service';
import { StarOrganizationService } from '../../shared/star-organization.service';
import { OrganizationStarringService } from './organization-starring/organization-starring.service';
// eslint-disable-next-line max-len
import { UpdateOrganizationOrCollectionDescriptionComponent } from './update-organization-description/update-organization-description.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    CustomMaterialModule,
    JsonLdModule,
    RefreshAlertModule,
    ReactiveFormsModule,
    MarkdownModule,
    MarkdownWrapperModule,
  ],
  providers: [OrganizationStarringService, StarOrganizationService, OrgSchemaService],
  declarations: [UpdateOrganizationOrCollectionDescriptionComponent],
  exports: [JsonLdModule],
})
export class UpdateOrganizationDescriptionModule {}
