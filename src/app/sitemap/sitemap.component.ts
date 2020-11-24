import { Component, OnInit } from '@angular/core';
import { Dockstore } from '../shared/dockstore.model';

@Component({
  selector: 'sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.css'],
})
export class SitemapComponent implements OnInit {
  Dockstore = Dockstore;
  constructor() {}

  ngOnInit() {}
}
