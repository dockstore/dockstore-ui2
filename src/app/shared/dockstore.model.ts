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

import { Provider } from './enum/provider.enum';

// If you add new properties to this class, you need to also update
// dockstore.model.ts.template at https://github.com/dockstore/compose_setup

export class Dockstore {
  // Please fill in HOSTNAME with your address
  static readonly HOSTNAME = 'http://localhost';
  static readonly API_PORT = '8080';
  static readonly UI_PORT = '4200';

  // Discourse URL MUST end with a slash (/)
  static readonly DISCOURSE_URL = 'http://localhost/';

  static readonly LOCAL_URI = Dockstore.HOSTNAME + ':' + Dockstore.UI_PORT;
  static readonly API_URI = Dockstore.HOSTNAME + ':' + Dockstore.API_PORT;
  static readonly DNASTACK_IMPORT_URL = 'https://app.dnastack.com/#/app/workflow/import/dockstore';
  static readonly FIRECLOUD_IMPORT_URL = 'https://portal.firecloud.org/#import/dockstore';
  static readonly DNANEXUS_IMPORT_URL = 'https://platform.dnanexus.com/panx/tools/import-workflow';

  static readonly GITHUB_CLIENT_ID = 'fill_this_in';
  static readonly GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';

  static readonly GITHUB_REDIRECT_URI = Dockstore.LOCAL_URI + '/auth/' + Provider.GITHUB;
  static readonly GITHUB_SCOPE = 'read:org,user:email';

  static readonly QUAYIO_AUTH_URL = 'https://quay.io/oauth/authorize';
  static readonly QUAYIO_REDIRECT_URI = Dockstore.LOCAL_URI + '/auth/' + Provider.QUAY;
  static readonly QUAYIO_SCOPE = 'repo:read,user:read';
  static readonly QUAYIO_CLIENT_ID = 'fill_this_in';

  static readonly BITBUCKET_AUTH_URL = 'https://bitbucket.org/site/oauth2/authorize';
  static readonly BITBUCKET_CLIENT_ID = 'fill_this_in';

  static readonly GITLAB_AUTH_URL = 'https://gitlab.com/oauth/authorize';
  static readonly GITLAB_CLIENT_ID = 'fill_this_in';
  static readonly GITLAB_REDIRECT_URI = Dockstore.LOCAL_URI + '/auth/' + Provider.GITLAB;
  // getting ready for gitlab scopes, this seems to request a token with the correct scope but it doesn't work to retrieve membership
  // static readonly GITLAB_SCOPE = 'read_user openid';
  static readonly GITLAB_SCOPE = 'api';

  static readonly GOOGLE_CLIENT_ID = 'fill_this_in';
  static readonly GOOGLE_SCOPE = 'profile email';

  static readonly CWL_VISUALIZER_URI = 'https://view.commonwl.org';

  static readonly FEATURES = {
    enableCwlViewer: true
  };
}
