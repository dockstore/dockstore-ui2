import { Dockstore } from './../shared/dockstore.model';
import { Metadata } from './../shared/swagger/model/metadata';
import { Component, OnInit } from '@angular/core';

import { versions } from './versions';
import { GA4GHService } from '../../../src/app/shared/swagger/api/gA4GH.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  version: string;
  tag: string;
  public prod = true;
  public UI1_WEBSITE = Dockstore.HOSTNAME + ':' + '9000';

  constructor(private gA4GHService: GA4GHService) { }

  ngOnInit() {
    this.gA4GHService.metadataGet()
      .subscribe(
        (metadata: Metadata) => {
          if (metadata.hasOwnProperty('version')) {
            this.version = metadata['version'];
            this.tag = versions.tag;
          } else {
            throw new Error('Version undefined');
          }
        },
        err => {
          console.log(err);
        }
      );
  }

}
