import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarredEntriesComponent } from './starredentries.component';
import { StargazersModule } from '../stargazers/stargazers.module';
import { StarentryService } from '../shared/starentry.service';
import { StarringService } from '../starring/starring.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  imports: [
    CommonModule,
    StargazersModule,
    TooltipModule.forRoot()
  ],
  exports: [
    StarredEntriesComponent
  ],
  providers: [
    StarentryService,
    StarringService
  ]
})
export class StarredEntriesModule { }
