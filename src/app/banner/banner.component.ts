import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { GA4GHService } from '../../../src/app/shared/swagger/api/gA4GH.service';
import { Metadata } from './../shared/swagger/model/metadata';
import { versions } from '../footer/versions';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  showBanner: boolean;
  mismatchedVersion: boolean = false;
  versionFromAPI: string;
  versionBuiltWith: string;

  constructor(private gA4GHService: GA4GHService) { }

  ngOnInit() {
    this.showBanner = environment.staging;

    this.gA4GHService.metadataGet()
      .subscribe(
        (metadata: Metadata) => {
          if (metadata.hasOwnProperty('version')) {
            this.versionFromAPI = metadata['version'];
            this.versionBuiltWith = versions.version;
            if (this.versionFromAPI !== this.versionBuiltWith) {
              this.mismatchedVersion = true;
            }
          } else {
            throw new Error('Version undefined');
          }
        }, (error: HttpErrorResponse) => {
          console.log(error);
          this.mismatchedVersion = true;
        }
      );
  }

}
