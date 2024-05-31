import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { RouterModule } from '@angular/router';

import { PipeModule } from '../shared/pipe/pipe.module';
import { CurrentCollectionsComponent } from './current-collections/current-collections.component';

@NgModule({
  imports: [CommonModule, FlexLayoutModule, RouterModule, PipeModule, CurrentCollectionsComponent],
  exports: [CurrentCollectionsComponent],
})
export class CurrentCollectionsModule {}
