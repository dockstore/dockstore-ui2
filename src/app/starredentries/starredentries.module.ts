import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';

import { HeaderModule } from '../shared/modules/header.module';
import { StarentryService } from '../shared/starentry.service';
import { StargazersModule } from '../stargazers/stargazers.module';
import { StarringModule } from '../starring/starring.module';
import { StarringService } from '../starring/starring.service';
import { getTooltipConfig } from './../shared/tooltip';

@NgModule({
  imports: [CommonModule, StargazersModule, TooltipModule.forRoot(), HeaderModule, StarringModule],
  providers: [{ provide: TooltipConfig, useFactory: getTooltipConfig }, StarentryService, StarringService]
})
export class StarredEntriesModule {}
