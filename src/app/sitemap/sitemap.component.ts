import { Component, OnInit } from '@angular/core';
import { devMode } from 'app/shared/constants';

@Component({
  selector: 'sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.css']
})
export class SitemapComponent implements OnInit {
  devMode = devMode;
  constructor() {}

  ngOnInit() {}
}
