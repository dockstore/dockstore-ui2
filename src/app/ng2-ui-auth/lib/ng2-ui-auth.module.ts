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

import { NgModule, ModuleWithProviders } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { IPartialConfigOptions } from './config-interfaces';
import { CONFIG_OPTIONS, ConfigService } from './config.service';
import { StorageService } from './storage-service';
import { BrowserStorageService } from './browser-storage.service';
import { SharedService } from './shared.service';
import { JwtInterceptor } from './interceptor.service';
import { OauthService } from './oauth.service';
import { HttpClient } from '@angular/common/http';
import { PopupService } from './popup.service';
import { LocalService } from './local.service';
import { AuthService } from './auth.service';

@NgModule({ declarations: [], exports: [], imports: [], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class Ng2UiAuthModule {
  static forRoot(configOptions?: IPartialConfigOptions, defaultJwtInterceptor = true): ModuleWithProviders<Ng2UiAuthModule> {
    return {
      ngModule: Ng2UiAuthModule,
      providers: [
        ...(configOptions ? [{ provide: CONFIG_OPTIONS, useValue: configOptions }] : []),
        { provide: ConfigService, useClass: ConfigService, deps: [CONFIG_OPTIONS] },
        { provide: StorageService, useClass: BrowserStorageService, deps: [ConfigService] },
        { provide: SharedService, useClass: SharedService, deps: [StorageService, ConfigService] },
        { provide: LocalService, useClass: LocalService, deps: [HttpClient, SharedService, ConfigService] },
        { provide: PopupService, useClass: PopupService, deps: [ConfigService] },
        { provide: OauthService, useClass: OauthService, deps: [HttpClient, SharedService, ConfigService, PopupService] },
        { provide: AuthService, useClass: AuthService, deps: [SharedService, LocalService, OauthService] },
        ...(defaultJwtInterceptor
          ? [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true, deps: [SharedService, ConfigService] }]
          : []),
      ],
    };
  }
}
