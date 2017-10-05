import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarredEntriesComponent } from './starredentries.component';
import { StargazersModule } from '../stargazers/stargazers.module';
import { StarentryService } from '../shared/starentry.service';
import { StarringService } from '../starring/starring.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { HeaderModule } from '../shared/modules/header.module';
import { StarringModule } from '../starring/starring.module';

@NgModule({
  imports: [
    CommonModule,
    StargazersModule,
    TooltipModule.forRoot(),
    HeaderModule,
    StarringModule
  ],
  providers: [
    StarentryService,
    StarringService
  ]
})
export class StarredEntriesModule { }
