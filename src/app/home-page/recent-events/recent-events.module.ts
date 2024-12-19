import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RecentEventsComponent } from './recent-events.component';

import { CommonModule } from '@angular/common';
import { EntryToDisplayNamePipe } from 'app/shared/entry-to-display-name.pipe';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { PipeModule } from '../../shared/pipe/pipe.module';

@NgModule({
  providers: [],
  imports: [
    MatIconModule,
    CommonModule,
    MatCardModule,
    FlexLayoutModule,
    MatDividerModule,
    RouterModule,
    PipeModule,
    RecentEventsComponent,
    EntryToDisplayNamePipe,
  ],
  exports: [RecentEventsComponent],
})
export class RecentEventsModule {}
