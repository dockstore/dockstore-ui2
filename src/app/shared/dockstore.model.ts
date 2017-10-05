import { environment } from './../../environments/environment';
// Do not change
export class Dockstore {
  static readonly UI1_URI = environment.HOSTNAME + ':' + environment.UI1_PORT;
  static readonly LOCAL_URI = environment.HOSTNAME + ':' + environment.UI_PORT;
  static readonly API_URI = environment.HOSTNAME + ':' + environment.API_PORT;

  static readonly DNASTACK_IMPORT_URL = 'https://app.dnastack.com/#/app/workflow/import/dockstore';

  static readonly GITHUB_CLIENT_ID = environment.GITHUB_CLIENT_ID;
  static readonly GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
  static readonly GITHUB_REDIRECT_URI = Dockstore.LOCAL_URI + '/auth/github';
  static readonly GITHUB_SCOPE = 'read:org,user,user:email';

  static readonly QUAYIO_AUTH_URL = 'https://quay.io/oauth/authorize';
  static readonly QUAYIO_REDIRECT_URI = Dockstore.LOCAL_URI + '/auth/quay';

  static readonly QUAYIO_SCOPE = 'repo:read,user:read';
  static readonly QUAYIO_CLIENT_ID = environment.QUAYIO_CLIENT_ID;

  static readonly BITBUCKET_AUTH_URL = 'https://bitbucket.org/site/oauth2/authorize';
  static readonly BITBUCKET_CLIENT_ID = environment.BITBUCKET_CLIENT_ID;

  static readonly GITLAB_AUTH_URL = 'https://gitlab.com/oauth/authorize';
  static readonly GITLAB_CLIENT_ID = environment.GITLAB_CLIENT_ID;
  static readonly GITLAB_REDIRECT_URI = Dockstore.LOCAL_URI + '/auth/gitlab';
}
