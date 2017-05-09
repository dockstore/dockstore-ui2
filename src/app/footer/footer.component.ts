import { Component, OnInit } from '@angular/core';

import { VersionsService } from './versions.service';

import { versions } from './versions';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  providers: [VersionsService]
})
export class FooterComponent implements OnInit {
  version: string;
  tag: string

  constructor(private versionsService: VersionsService) { }

  ngOnInit() {
    this.versionsService.getVersion()
      .subscribe(
        metadata => {
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
