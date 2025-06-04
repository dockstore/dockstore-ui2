/*
 *
 *  Copyright 2024 OICR and UCSC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 */

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { CONFIG_OPTIONS, ConfigService } from './config.service';

import { OauthService } from './oauth.service';
import { PopupService } from './popup.service';
import { SharedService } from './shared.service';
import { StorageService } from './storage-service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('OauthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        OauthService,
        SharedService,
        PopupService,
        StorageService,
        { provide: CONFIG_OPTIONS, useValue: {} },
        ConfigService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  it('should be created', inject([OauthService], (service: OauthService) => {
    expect(service).toBeTruthy();
  }));
});
