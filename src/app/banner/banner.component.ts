import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { Metadata } from './../shared/swagger/model/metadata';
import { versions } from '../footer/versions';
import { HttpErrorResponse } from '@angular/common/http';
import { MetadataService } from '../metadata/metadata.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  showBanner: boolean;
  mismatchedVersion = false;
  versionFromAPI: string;
  versionBuiltWith: string;

  constructor(private metadataService: MetadataService) { }

  ngOnInit() {
    this.showBanner = environment.staging;

    this.metadataService.getMetadata()
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
