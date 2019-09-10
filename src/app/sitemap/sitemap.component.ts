import { Component, OnInit } from '@angular/core';
import { devMode } from 'app/shared/constants';
import { Dockstore } from '../shared/dockstore.model';

@Component({
  selector: 'sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.css']
})
export class SitemapComponent implements OnInit {
  devMode = devMode;
  Dockstore = Dockstore;
  constructor() {}

  ngOnInit() {}
}
