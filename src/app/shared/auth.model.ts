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
import { IPartialConfigOptions } from 'ng2-ui-auth/lib/config-interfaces';

export const AuthConfig: IPartialConfigOptions = {
  providers: {
    github: {
      url: Dockstore.API_URI + '/auth/tokens/github',
      clientId: Dockstore.GITHUB_CLIENT_ID,
      scope: [Dockstore.GITHUB_SCOPE]
    },
    google: {
      url: Dockstore.API_URI + '/auth/tokens/google',
      clientId: Dockstore.GOOGLE_CLIENT_ID,
      scope: [Dockstore.GOOGLE_SCOPE],
      additionalUrlParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  }
};
