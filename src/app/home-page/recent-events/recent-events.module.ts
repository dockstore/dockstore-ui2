import { NgModule } from '@angular/core';
import { RecentEventsComponent } from './recent-events.component';
import { RefreshAlertModule } from '../../shared/alert/alert.module';
import { CommonModule } from '@angular/common';
import { EntryToDisplayNamePipe } from 'app/shared/entry-to-display-name.pipe';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [RecentEventsComponent, EntryToDisplayNamePipe],
  providers: [],
  imports: [RefreshAlertModule, CommonModule, MatCardModule, FlexLayoutModule, MatDividerModule, RouterModule],
  exports: [RecentEventsComponent],
})
export class RecentEventsModule {}
