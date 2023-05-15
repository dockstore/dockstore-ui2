import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { RefreshAlertModule } from '../shared/alert/alert.module';
import { HeaderModule } from '../shared/modules/header.module';
import { MarkdownWrapperModule } from '../shared/modules/markdown-wrapper.module';
import { CustomMaterialModule } from '../shared/modules/material.module';
import { PipeModule } from '../shared/pipe/pipe.module';
import { CollectionsModule } from './collections.module';
import { EventsModule } from './events.module';
import { ImgFallbackModule } from '../shared/modules/img-fallback.module';
import { OrganizationMembersModule } from './organization-members.module';
import { OrganizationStargazersModule } from './organization/organization-stargazers/organization-stargazers.module';
import { OrganizationStarringModule } from './organization/organization-starring/organization-starring.module';
import { OrganizationComponent } from './organization/organization.component';
import { UpdateOrganizationDescriptionModule } from './organization/update-organization-description.module';
import { PreviewWarningModule } from '../shared/modules/preview-warning.module';

@NgModule({
  imports: [
    CollectionsModule,
    CommonModule,
    FlexLayoutModule,
    HeaderModule,
    CustomMaterialModule,
    OrganizationMembersModule,
    UpdateOrganizationDescriptionModule,
    EventsModule,
    RouterModule,
    RefreshAlertModule,
    OrganizationStarringModule,
    OrganizationStargazersModule,
    MarkdownModule,
    PipeModule,
    MarkdownWrapperModule,
    ImgFallbackModule,
    PreviewWarningModule,
  ],
  declarations: [OrganizationComponent],
  exports: [OrganizationComponent],
})
export class OrganizationModule {}
