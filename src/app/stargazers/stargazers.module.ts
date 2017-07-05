import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StargazersComponent } from './stargazers.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StarentryService } from '../shared/starentry.service';
import { StarringService } from '../starring/starring.service';
import { UserService } from '../loginComponents/user.service';
@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule
  ],
  declarations: [
    StargazersComponent
  ],
  exports: [
    StargazersComponent
  ],
  providers: [
    StarringService,
    UserService,
    StarentryService
  ]
})
export class StargazersModule { }
