import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';

import { HeaderModule } from '../shared/modules/header.module';
import { StarentryService } from '../shared/starentry.service';
import { StargazersModule } from '../stargazers/stargazers.module';
import { StarringModule } from '../starring/starring.module';
import { StarringService } from '../starring/starring.service';

// relocate these files
import { OrganizationStargazersModule} from '../organizations/organization/organization-stargazers/organization-stargazers.module';
import { OrganizationStarringModule} from '../organizations/organization/organization-starring/organization-starring.module';
import { StarOrganizationService} from '../shared/star-organization.service';
import { OrganizationStarringService} from '../organizations/organization/organization-starring/organization-starring.service';
import { getTooltipConfig } from './../shared/tooltip';

@NgModule({
  imports: [
    CommonModule,
    StargazersModule,
    TooltipModule.forRoot(),
    HeaderModule,
    StarringModule,
    OrganizationStarringModule,
    OrganizationStargazersModule
  ],
  providers: [
    {provide: TooltipConfig, useFactory: getTooltipConfig},
    StarentryService,
    StarringService,
    StarOrganizationService,
    OrganizationStarringService
  ]
})
export class StarredEntriesModule { }
