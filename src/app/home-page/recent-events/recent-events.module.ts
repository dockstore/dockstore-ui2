import { NgModule } from '@angular/core';
import { RecentEventsComponent } from './recent-events.component';
import { RefreshAlertModule } from '../../shared/alert/alert.module';
import { CommonModule } from '@angular/common';
import { EntryToDisplayNamePipe } from 'app/shared/entry-to-display-name.pipe';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { PipeModule } from '../../shared/pipe/pipe.module';
import { ImgFallbackModule } from '../../shared/modules/img-fallback.module';

@NgModule({
  declarations: [RecentEventsComponent, EntryToDisplayNamePipe],
  providers: [],
  imports: [
    RefreshAlertModule,
    MatIconModule,
    CommonModule,
    MatCardModule,
    FlexLayoutModule,
    MatDividerModule,
    RouterModule,
    PipeModule,
    ImgFallbackModule,
  ],
  exports: [RecentEventsComponent],
})
export class RecentEventsModule {}
