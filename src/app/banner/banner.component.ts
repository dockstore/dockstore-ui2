import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { versions } from '../footer/versions';
import { ServiceInfoService } from '../service-info/service-info.service';
import { Base } from '../shared/base';
import { TRSService } from 'app/shared/openapi';

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

  constructor(private serviceInfoService: ServiceInfoService) {
    super();
  }

  ngOnInit() {
    this.showBanner = environment.staging;
    this.versionBuiltWith = versions.version;

    this.serviceInfoService
      .getServiceInfo()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (serviceInfo: TRSService) => {
          if (serviceInfo.version) {
            this.versionFromAPI = serviceInfo.version;
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
