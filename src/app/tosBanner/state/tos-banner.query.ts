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
import { Query } from '@datorama/akita';
import { Observable } from 'rxjs';
import { User } from '../../shared/openapi/model/user';
import { TosBannerState, TosBannerStore } from './tos-banner.store';

@Injectable({ providedIn: 'root' })
export class TosBannerQuery extends Query<TosBannerState> {
  dismissedLatestTOS$: Observable<User.TosversionEnum> = this.select((state) => state.dismissedLatestTOS);
  dismissedLatestPrivacyPolicy$: Observable<User.PrivacyPolicyVersionEnum> = this.select((state) => state.dismissedLatestPrivacyPolicy);
  displayLoggedInTOSBanner$: Observable<boolean> = this.select((state) => state.displayLoggedInTOSBanner);

  constructor(protected store: TosBannerStore) {
    super(store);
  }
}
