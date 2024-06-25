import { Component } from '@angular/core';
import { Dockstore } from '../shared/dockstore.model';
import { RouterLink } from '@angular/router';
import { FlexModule } from '@ngbracket/ngx-layout/flex';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.css'],
  standalone: true,
  imports: [FlexModule, RouterLink],
})
export class SitemapComponent {
  Dockstore = Dockstore;
}
