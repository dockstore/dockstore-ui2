/**
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { MetadataService } from '../metadata/metadata.service';
import { Base } from '../shared/base';
import { Dockstore } from './../shared/dockstore.model';
import { Metadata } from './../shared/swagger/model/metadata';
import { FooterService } from './footer.service';
import { versions } from './versions';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent extends Base implements OnInit {
  version: string;
  tag: string;
  public prod = true;
  public dsServerURI: any;
  Dockstore = Dockstore;
  year: number;
  content: string;

  /**
   * API Status codes that can indicate the web service is down
   *
   * * 0 This may have only happened without the load balancer, but it was already in the code, so leaving it.
   * * 404 The web service container is down or restarting. While most 404s don't mean the web service is down,
   * going to assume that a 404 on the TRS metadata endpoint means something is wrong
   * * 502 The whole compose_setup backend stack is down.
   * * 504 In a local dev environment, the Angular proxy returns 504 if it can't connect to the web service.
   */
  private readonly WEBSERVICE_DOWN_STATUS_CODES = [0, 404, 502, 504];

  constructor(private metadataService: MetadataService, private footerService: FooterService) {
    super();
  }

  ngOnInit() {
    this.year = new Date().getFullYear();
    this.tag = versions.tag;
    this.dsServerURI = Dockstore.API_URI;
    this.metadataService
      .getMetadata()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (metadata: Metadata) => {
          if (metadata.hasOwnProperty('version')) {
            const metadatum = metadata['version'];
            if (metadatum && (metadatum.includes('SNAPSHOT') || metadatum.includes('development-build'))) {
              this.version = Dockstore.WEBSERVICE_COMMIT_ID;
            } else {
              this.version = metadatum;
            }
            this.content = this.footerService.versionsToMarkdown(
              this.version,
              this.tag,
              Dockstore.COMPOSE_SETUP_VERSION,
              Dockstore.DEPLOY_VERSION
            );
          } else {
            throw new Error('Version undefined');
          }
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          const webserviceDown = this.WEBSERVICE_DOWN_STATUS_CODES.some((code) => code === error.status);
          if (webserviceDown && window.location.pathname !== '/maintenance') {
            window.location.href = '/maintenance';
          }
        }
      );
  }
}
