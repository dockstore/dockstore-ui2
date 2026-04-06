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

import { AuthService } from './auth.service';
import { CONFIG_OPTIONS, ConfigService } from './config.service';
import { LocalService } from './local.service';
import { OauthService } from './oauth.service';
import { PopupService } from './popup.service';
import { SharedService } from './shared.service';
import { StorageService } from './storage-service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AuthService,
        ConfigService,
        LocalService,
        OauthService,
        PopupService,
        SharedService,
        StorageService,
        { provide: CONFIG_OPTIONS, useValue: {} },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
});
