import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HeaderModule } from '../shared/modules/header.module';
import { StarentryService } from '../shared/starentry.service';
import { StargazersModule } from '../stargazers/stargazers.module';
import { StarringModule } from '../starring/starring.module';
import { StarringService } from '../starring/starring.service';

@NgModule({
  imports: [CommonModule, StargazersModule, HeaderModule, StarringModule],
  providers: [StarentryService, StarringService]
})
export class StarredEntriesModule {}
