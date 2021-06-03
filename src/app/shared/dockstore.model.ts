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
  static readonly HOSTNAME = window.location.protocol + '//' + window.location.host;
  static readonly HOSTNAME_NO_PROTOCOL = window.location.hostname;
  static readonly API_URI = Dockstore.HOSTNAME + '/api';
  static readonly GALAXY_IMPORT_PATH_PORTION =
    '/workflows/trs_import?trs_server=' + Dockstore.HOSTNAME_NO_PROTOCOL + '&trs_id=%23workflow/';
  static readonly DNASTACK_IMPORT_PATH_PORTION = '/import?trs_server=' + Dockstore.HOSTNAME_NO_PROTOCOL + '&trs_id=';

  // All the following properties will get updated by configuration.service.ts. You do not
  // need to update them here. Set them in your dockstore.yml for the web service.

  // Discourse URL should not end with a slash (/) but will work fine with one
  static DISCOURSE_URL = 'http://localhost';

  static DNASTACK_IMPORT_URL = 'https://app.dnastack.com/#/app/workflow/import/dockstore';
  static DNANEXUS_IMPORT_URL = 'https://platform.dnanexus.com/panx/tools/import-workflow';
  static TERRA_IMPORT_URL = 'https://app.terra.bio/#import-tool/dockstore';
  static CGC_IMPORT_URL = 'https://cgc.sbgenomics.com/integration/trs/import';
  static ANVIL_IMPORT_URL = 'https://anvil.terra.bio/#import-tool/dockstore';
  static BD_CATALYST_SEVEN_BRIDGES_IMPORT_URL = 'https://sb.biodatacatalyst.nhlbi.nih.gov/integration/trs/import';
  static BD_CATALYST_TERRA_IMPORT_URL = 'https://terra.biodatacatalyst.nhlbi.nih.gov/#import-tool/dockstore';
  static CAVATICA_IMPORT_URL = 'https://cavatica.sbgenomics.com/integration/trs/import';
  static NEXTFLOW_TOWER_IMPORT_URL = 'https://tower.nf/launch';

  static GITHUB_CLIENT_ID = 'will be filled in by configuration.service';
  static GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';

  static GITHUB_REDIRECT_URI = Dockstore.HOSTNAME + '/auth/' + Provider.GITHUB;
  static GITHUB_SCOPE = 'read:org,user:email';

  static QUAYIO_AUTH_URL = 'https://quay.io/oauth/authorize';
  static QUAYIO_REDIRECT_URI = Dockstore.HOSTNAME + '/auth/' + Provider.QUAY;
  static QUAYIO_SCOPE = 'repo:read,user:read';
  static QUAYIO_CLIENT_ID = 'will be filled in by configuration.service';

  static BITBUCKET_AUTH_URL = 'https://bitbucket.org/site/oauth2/authorize';
  static BITBUCKET_CLIENT_ID = 'will be filled in by configuration.service';

  static GITLAB_AUTH_URL = 'https://gitlab.com/oauth/authorize';
  static GITLAB_CLIENT_ID = 'will be filled in by configuration.service';
  static GITLAB_REDIRECT_URI = Dockstore.HOSTNAME + '/auth/' + Provider.GITLAB;
  // getting ready for gitlab scopes, this seems to request a token with the correct scope but it doesn't work to retrieve membership
  // static GITLAB_SCOPE = 'read_user openid';
  static GITLAB_SCOPE = 'api';

  static ZENODO_AUTH_URL = 'https://zenodo.org/oauth/authorize';
  static ZENODO_CLIENT_ID = 'will be filled in by configuration.service';
  static ZENODO_REDIRECT_URI = Dockstore.HOSTNAME + '/auth/' + Provider.ZENODO;
  static ZENODO_SCOPE = 'deposit:write deposit:actions';

  static ORCID_AUTH_URL = 'https://orcid.org/oauth/authorize';
  static ORCID_CLIENT_ID = 'will be filled in by configuration.service';
  static ORCID_SCOPE = '/authenticate';
  static ORCID_REDIRECT_URI = Dockstore.HOSTNAME + '/auth/' + Provider.ORCID;

  static GOOGLE_CLIENT_ID = 'will be filled in by configuration.service';
  static GOOGLE_SCOPE = 'profile email';
  static GOOGLE_TAG_MANAGER_ID = 'filled in by configuration service';

  static CWL_VISUALIZER_URI = 'https://view.commonwl.org';

  static GITHUB_APP_INSTALLATION_URL = 'will be filled in by configuration.service';

  static DOCKSTORE_REPO = 'https://github.com/dockstore/dockstore';
  static DOCUMENTATION_URL = 'https://docs.dockstore.org';
  static FEATURED_CONTENT_URL = 'will be filled in by configuration.service';
  static FEATURED_NEWS_URL = 'will be filled in by configuration.service';

  static DEPLOY_VERSION = '';
  static COMPOSE_SETUP_VERSION = '';
  static WEBSERVICE_COMMIT_ID = '';

  static FEATURES = {
    enableCwlViewer: true,
    enableLaunchWithGalaxy: true,
    enableMultiCloudLaunchWithDNAstack: true,
    enableOrcidExport: true,
  };
}
