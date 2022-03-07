import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HeaderModule } from '../shared/modules/header.module';
import { StarentryService } from '../shared/starentry.service';
import { StargazersModule } from '../stargazers/stargazers.module';
import { StarringModule } from '../starring/starring.module';
import { StarringService } from '../starring/starring.service';
import { MySidebarModule } from '../shared/modules/my-sidebar.module';

@NgModule({
  imports: [CommonModule, StargazersModule, HeaderModule, StarringModule, MySidebarModule],
  providers: [StarentryService, StarringService],
})
export class StarredEntriesModule {}
