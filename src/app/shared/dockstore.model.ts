export class Dockstore {

  static readonly API_URI = 'http://localhost:8080';

  static readonly GITHUB_CLIENT_ID = 'fill this in';
  static readonly GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
  static readonly GITHUB_REDIRECT_URI = 'http://fill this in:4200/auth/tokens/github';
  static readonly GITHUB_SCOPE = 'user,user:email';

  static readonly QUAYIO_AUTH_URL = 'https://quay.io/oauth/authorize';
  static readonly QUAYIO_REDIRECT_URI = 'http://fill this in:4200/auth/quay';
  static readonly QUAYIO_SCOPE = 'repo:read,user:read';
  static readonly QUAYIO_CLIENT_ID = 'fill this in';

  static readonly BITBUCKET_AUTH_URL = 'https://bitbucket.org/site/oauth2/authorize';
  static readonly BITBUCKET_CLIENT_ID = 'fill this in';

  static readonly GITLAB_AUTH_URL = 'https://gitlab.com/oauth/authorize';
  static readonly GITLAB_CLIENT_ID = 'fill this in';
  static readonly GITLAB_REDIRECT_URI = 'http://fill this in:4200/auth/gitlab';

}
