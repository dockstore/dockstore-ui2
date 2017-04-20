import { Dockstore } from '../../../shared/dockstore.model';

export class Links {

  static readonly QUAY = `${ Dockstore.QUAYIO_AUTH_URL }
                          ?client_id=${ Dockstore.QUAYIO_CLIENT_ID }
                          &redirect_uri=${ Dockstore.QUAYIO_REDIRECT_URI }
                          &response_type=token
                          &realm=realm
                          &scope=${ Dockstore.QUAYIO_SCOPE }`;

  static readonly BITBUCKET = `${ Dockstore.BITBUCKET_AUTH_URL }
                               ?client_id=${ Dockstore.BITBUCKET_CLIENT_ID }
                               &response_type=code`;

  static readonly GITLAB = `${ Dockstore.GITLAB_AUTH_URL }
                            ?client_id=${ Dockstore.GITLAB_CLIENT_ID }
                            &redirect_uri=${ Dockstore.GITLAB_REDIRECT_URI }
                            &response_type=code`;

}
