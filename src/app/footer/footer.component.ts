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

import { ServiceInfoService } from '../service-info/service-info.service';
import { Base } from '../shared/base';
import { Sponsor } from '../sponsors/sponsor.model';
import { Dockstore } from './../shared/dockstore.model';
import { TRSService } from 'app/shared/openapi';
import { FooterService } from './footer.service';
import { versions } from './versions';
import { GitTagPipe } from './git-tag.pipe';
import { NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { SnackbarDirective } from '../shared/snackbar.directive';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { FlexModule } from '@ngbracket/ngx-layout/flex';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [FlexModule, RouterLink, MatButtonModule, SnackbarDirective, ClipboardModule, MatIconModule, NgFor, GitTagPipe],
})
export class FooterComponent extends Base implements OnInit {
  domain: string;
  version: string;
  tag: string;
  public prod = true;
  public dsServerURI: any;
  Dockstore = Dockstore;
  year: number;
  content: string;
  public sponsors: Sponsor[] = [
    new Sponsor('collaboratory.svg', new URL('https://doi.org/10.1158/1538-7445.AM2017-378')),
    new Sponsor('oicr.svg', new URL('https://oicr.on.ca/')),
    new Sponsor('broad1.svg', new URL('https://www.broadinstitute.org/')),
    new Sponsor('ga.svg', new URL('https://genomicsandhealth.org/')),
    new Sponsor('ucsc.svg', new URL('https://ucscgenomics.soe.ucsc.edu/')),
  ];

  /**
   * API Status codes that can indicate the web service is down
   *
   * * 0 This may have only happened without the load balancer, but it was already in the code, so leaving it.
   * * 404 The web service container is down or restarting. While most 404s don't mean the web service is down,
   * going to assume that a 404 on the TRS service-info endpoint means something is wrong
   * * 502 The whole compose_setup backend stack is down.
   * * 504 In a local dev environment, the Angular proxy returns 504 if it can't connect to the web service.
   */
  private readonly WEBSERVICE_DOWN_STATUS_CODES = [0, 404, 502, 504];

  constructor(private serviceInfoService: ServiceInfoService, private footerService: FooterService) {
    super();
  }

  ngOnInit() {
    this.domain = Dockstore.HOSTNAME;
    this.year = new Date().getFullYear();
    this.tag = versions.tag;
    this.dsServerURI = Dockstore.API_URI;
    this.serviceInfoService
      .getServiceInfo()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (serviceInfo: TRSService) => {
          if (serviceInfo.version) {
            const version = serviceInfo.version;
            if (version && (version.includes('SNAPSHOT') || version.includes('development-build'))) {
              this.version = Dockstore.WEBSERVICE_COMMIT_ID;
            } else {
              this.version = version;
            }
            this.content = this.footerService.versionsToMarkdown(
              this.domain,
              this.version,
              this.tag,
              Dockstore.DEPLOY_VERSION,
              Dockstore.CWL_PARSING_LAMBDA_VERSION,
              Dockstore.WDL_PARSING_LAMBDA_VERSION,
              Dockstore.NEXTFLOW_PARSING_LAMBDA_VERSION,
              Dockstore.GALAXY_PARSING_PLUGIN_VERSION,
              Dockstore.CHECK_URL_LAMBDA_VERSION,
              Dockstore.SUPPORT_VERSION
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
