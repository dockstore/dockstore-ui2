/*
 *    Copyright 2019 OICR
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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TosBannerStore } from './tos-banner.store';
import { currentTOSVersion, currentPrivacyPolicyVersion, dismissedLatestTOS, dismissedLatestPrivacyPolicy } from '../../shared/constants';

@Injectable({ providedIn: 'root' })
export class TosBannerService {
  constructor(private tosBannerStore: TosBannerStore, private http: HttpClient) {}

  dismissTOS() {
    localStorage.setItem(dismissedLatestTOS, JSON.stringify(currentTOSVersion));
    localStorage.setItem(dismissedLatestPrivacyPolicy, JSON.stringify(currentPrivacyPolicyVersion));
    this.tosBannerStore.update(state => {
      return {
        ...state,
        dismissedLatestTOS: currentTOSVersion,
        dismissedLatestPrivacyPolicy: currentPrivacyPolicyVersion
      };
    });
  }
}
