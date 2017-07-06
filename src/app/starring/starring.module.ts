import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarringComponent } from './starring.component';
import { StarringService } from './starring.service';
import { StarentryService } from '../shared/starentry.service';
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    StarringComponent
  ],
  exports: [
    StarringComponent
  ],
  providers: [
    StarringService,
    StarentryService
  ]
})
export class StarringModule { }
