import { Component } from '@angular/core';
import { NewsAndUpdatesComponent } from '../featured-content/news-and-updates.component';
import { MatDividerModule } from '@angular/material/divider';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatLegacyCardModule } from '@angular/material/legacy-card';

@Component({
  selector: 'app-news-box',
  templateUrl: './news-box.component.html',
  styleUrls: ['../../../shared/styles/dashboard-boxes.scss'],
  standalone: true,
  imports: [MatLegacyCardModule, FlexModule, MatDividerModule, NewsAndUpdatesComponent],
})
export class NewsBoxComponent {}
