import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../environments/environment';
import { Metadata } from './../shared/swagger/model/metadata';
import { versions } from '../footer/versions';
import { HttpErrorResponse } from '@angular/common/http';
import { MetadataService } from '../metadata/metadata.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit, OnDestroy {
  showBanner: boolean;
  mismatchedVersion = false;
  versionFromAPI: string;
  versionBuiltWith: string;
  mdService: Subscription;

  constructor(private metadataService: MetadataService) { }

  ngOnInit() {
    this.showBanner = environment.staging;
    this.versionBuiltWith = versions.version;

    this.mdService = this.metadataService.getMetadata()
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
        }, (error: HttpErrorResponse) => {
          console.log(error);
          this.mismatchedVersion = true;
        }
      );
  }

  ngOnDestroy() {
    this.mdService.unsubscribe();
  }

}
