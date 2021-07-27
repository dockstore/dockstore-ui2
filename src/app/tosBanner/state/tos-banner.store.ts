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
import { Store, StoreConfig } from '@datorama/akita';
import { dismissedLatestPrivacyPolicy, dismissedLatestTOS } from '../../shared/constants';
import { User } from '../../shared/openapi/model/user';

export interface TosBannerState {
  dismissedLatestTOS: User.TosversionEnum;
  dismissedLatestPrivacyPolicy: User.PrivacyPolicyVersionEnum;
  displayLoggedInTOSBanner: boolean;
}

export function createInitialState(): TosBannerState {
  return {
    dismissedLatestTOS: JSON.parse(localStorage.getItem(dismissedLatestTOS)),
    dismissedLatestPrivacyPolicy: JSON.parse(localStorage.getItem(dismissedLatestPrivacyPolicy)),
    displayLoggedInTOSBanner: true,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tosBanner' })
export class TosBannerStore extends Store<TosBannerState> {
  constructor() {
    super(createInitialState());
  }
}
