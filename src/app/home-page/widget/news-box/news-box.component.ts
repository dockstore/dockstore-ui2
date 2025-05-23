import { Component } from '@angular/core';
import { NewsAndUpdatesComponent } from '../featured-content/news-and-updates.component';
import { MatDividerModule } from '@angular/material/divider';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-news-box',
  templateUrl: './news-box.component.html',
  styleUrls: ['../../../shared/styles/dashboard-boxes.scss'],
  standalone: true,
  imports: [MatCardModule, FlexModule, MatDividerModule, NewsAndUpdatesComponent, MatChipsModule],
})
export class NewsBoxComponent {}
