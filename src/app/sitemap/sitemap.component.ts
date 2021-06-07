import { Component } from '@angular/core';
import { Dockstore } from '../shared/dockstore.model';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.css'],
})
export class SitemapComponent {
  Dockstore = Dockstore;
  constructor() {}
}
