export class Dockstore {

  static readonly API_URI = 'http://localhost:8080';

  static readonly GITHUB_CLIENT_ID = '';

  static readonly QUAYIO_AUTH_URL = 'https://quay.io/oauth/authorize';
  static readonly QUAYIO_REDIRECT_URI = 'http://localhost:4200/auth/quay.io';
  static readonly QUAYIO_SCOPE = 'repo:read,user:read';
  static readonly QUAYIO_CLIENT_ID = '';

  static readonly BITBUCKET_AUTH_URL = 'https://bitbucket.org/site/oauth2/authorize';
  static readonly BITBUCKET_CLIENT_ID = '';

  static readonly GITLAB_AUTH_URL = 'https://gitlab.com/oauth/authorize';
  static readonly GITLAB_CLIENT_ID = '';
  static readonly GITLAB_REDIRECT_URI = 'http://localhost:4200/auth/gitlab';

}
