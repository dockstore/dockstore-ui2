import { Component, OnInit } from '@angular/core';
import { betaMode } from 'app/shared/constants';

@Component({
  selector: 'sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.css']
})
export class SitemapComponent implements OnInit {
  betaMode = betaMode;
  constructor() {}

  ngOnInit() {}
}
