import { Dockstore } from '../../../shared/dockstore.model';

export class Links {
  static readonly GITHUB = () => `${Dockstore.GITHUB_AUTH_URL}
                            ?client_id=${Dockstore.GITHUB_CLIENT_ID}
                            &redirect_uri=${Dockstore.GITHUB_REDIRECT_URI}
                            &scope=${Dockstore.GITHUB_SCOPE}`;

  static readonly QUAY = () => {
    return `${Dockstore.QUAYIO_AUTH_URL}
                          ?client_id=${Dockstore.QUAYIO_CLIENT_ID}
                          &redirect_uri=${Dockstore.QUAYIO_REDIRECT_URI}
                          &response_type=token
                          &realm=realm
                          &scope=${Dockstore.QUAYIO_SCOPE}`;
  };

  static readonly BITBUCKET = () => `${Dockstore.BITBUCKET_AUTH_URL}
                               ?client_id=${Dockstore.BITBUCKET_CLIENT_ID}
                               &response_type=code`;

  /** need this strange construction since gitlab scopes are space-separated */
  static readonly GITLAB = () =>
    `${Dockstore.GITLAB_AUTH_URL}
                            ?client_id=${Dockstore.GITLAB_CLIENT_ID}
                            &redirect_uri=${Dockstore.GITLAB_REDIRECT_URI}
                            &response_type=code`.replace(/\s/g, '') + `&scope=${Dockstore.GITLAB_SCOPE}`;

  static readonly ZENODO = () =>
    `${Dockstore.ZENODO_AUTH_URL}
                            ?client_id=${Dockstore.ZENODO_CLIENT_ID}
                            &redirect_uri=${Dockstore.ZENODO_REDIRECT_URI}
                            &response_type=code`.replace(/\s/g, '') + `&scope=${Dockstore.ZENODO_SCOPE}`;
}
