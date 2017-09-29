export class Dockstore {
  // Please fill in HOSTNAME with your address
  static readonly HOSTNAME = 'http://localhost';
  static readonly API_PORT = '8080';
  static readonly UI_PORT = '4200';

  static readonly LOCAL_URI = Dockstore.HOSTNAME + ':' + Dockstore.UI_PORT;
  static readonly API_URI = Dockstore.HOSTNAME + ':' + Dockstore.API_PORT;
  static readonly DNASTACK_IMPORT_URL= 'https://app.dnastack.com/#/app/workflow/import/dockstore';

  static readonly GITHUB_CLIENT_ID = 'fill this in';
  static readonly GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';

  static readonly GITHUB_REDIRECT_URI = Dockstore.LOCAL_URI + '/auth/github.com';
  static readonly GITHUB_SCOPE = 'read:org,user,user:email';

  static readonly QUAYIO_AUTH_URL = 'https://quay.io/oauth/authorize';
  static readonly QUAYIO_REDIRECT_URI = Dockstore.LOCAL_URI + '/auth/quay';
  static readonly QUAYIO_SCOPE = 'repo:read,user:read';
  static readonly QUAYIO_CLIENT_ID = 'fill this in';

  static readonly BITBUCKET_AUTH_URL = 'https://bitbucket.org/site/oauth2/authorize';
  static readonly BITBUCKET_CLIENT_ID = 'fill this in';

  static readonly GITLAB_AUTH_URL = 'https://gitlab.com/oauth/authorize';
  static readonly GITLAB_CLIENT_ID = 'fill this in';
  static readonly GITLAB_REDIRECT_URI = Dockstore.LOCAL_URI + '/auth/gitlab';

}
