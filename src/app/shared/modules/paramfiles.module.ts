import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightJsModule, HighlightJsService } from '../../shared/angular2-highlight-js/lib/highlight-js.module';
import { SelectModule } from './select.module';

import { ParamfilesComponent } from '../../paramfiles/paramfiles.component';

@NgModule({
  declarations: [
    ParamfilesComponent
  ],
  imports: [
    CommonModule,
    HighlightJsModule,
    SelectModule
  ],
  providers: [
    HighlightJsService
  ],
  exports: [
    ParamfilesComponent
  ]
})
export class ParamfilesModule { }
