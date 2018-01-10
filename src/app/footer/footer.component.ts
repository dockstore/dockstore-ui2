import { HttpErrorResponse } from '@angular/common/http';
/*
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

import { Dockstore } from '../shared/dockstore.model';
import {Metadata, MetadataV2} from '../shared/swagger';
import { Component, OnInit } from '@angular/core';

import { versions } from './versions';
import { GA4GHV2Service } from '../shared/swagger/api/gA4GHV2.service';

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

  constructor(private gA4GHService: GA4GHV2Service) { }

  ngOnInit() {
    this.gA4GHService.metadataGet()
      .subscribe(
        (metadata: MetadataV2) => {
          if (metadata.hasOwnProperty('version')) {
            this.version = metadata['version'];
            this.tag = versions.tag;
          } else {
            throw new Error('Version undefined');
          }
        }, (error: HttpErrorResponse) => {
          console.log(error);
          if (error.status === 0 && window.location.pathname !== '/maintenance') {
            window.location.href = '/maintenance';
          }
        }
      );
  }
}
