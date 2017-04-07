import { NgModule } from '@angular/core';
import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js';
import { SelectModule } from './select.module';

import { DescriptorsComponent } from '../descriptors/descriptors.component';

@NgModule({
  declarations: [
    DescriptorsComponent
  ],
  imports: [
    HighlightJsModule,
    SelectModule
  ],
  providers: [
    HighlightJsService
  ],
  exports: [
    DescriptorsComponent
  ]
})
export class DescriptorsModule { }
