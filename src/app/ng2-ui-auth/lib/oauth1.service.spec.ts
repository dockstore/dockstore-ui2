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

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { CONFIG_OPTIONS, ConfigService } from './config.service';

import { Oauth1Service } from './oauth1.service';
import { PopupService } from './popup.service';

describe('Oauth1Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Oauth1Service, PopupService, ConfigService, { provide: CONFIG_OPTIONS, useValue: {} }],
    });
  });

  it('should be created', inject([Oauth1Service], (service: Oauth1Service) => {
    expect(service).toBeTruthy();
  }));
});
