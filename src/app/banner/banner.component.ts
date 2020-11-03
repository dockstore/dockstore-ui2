import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { versions } from '../footer/versions';
import { MetadataService } from '../metadata/metadata.service';
import { Base } from '../shared/base';
import { Metadata } from './../shared/swagger/model/metadata';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent extends Base implements OnInit {
  showBanner: boolean;
  mismatchedVersion = false;
  versionFromAPI: string;
  versionBuiltWith: string;

  constructor(private metadataService: MetadataService) {
    super();
  }

  ngOnInit() {
    this.showBanner = environment.staging;
    this.versionBuiltWith = versions.version;

    this.metadataService
      .getMetadata()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (metadata: Metadata) => {
          if (metadata.hasOwnProperty('version')) {
            this.versionFromAPI = metadata['version'];
            if (this.versionFromAPI !== this.versionBuiltWith) {
              this.mismatchedVersion = true;
            }
          } else {
            throw new Error('Version undefined');
          }
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          this.mismatchedVersion = true;
        }
      );
  }
}
