import { Provider } from './enum/provider.enum';

// If you add new properties to this class, you need to also update
// dockstore.model.ts.template at https://github.com/dockstore/compose_setup

export class Dockstore {
  // Please fill in HOSTNAME with your address
  static readonly HOSTNAME = 'http://10.11.8.80';
  static readonly API_PORT = '8080';
  static readonly UI_PORT = '4200';

  // Discourse URL MUST end with a slash (/)
  static readonly DISCOURSE_URL = 'http://localhost/';

  static readonly LOCAL_URI = Dockstore.HOSTNAME + ':' + Dockstore.UI_PORT;
  static readonly API_URI = Dockstore.HOSTNAME + ':' + Dockstore.API_PORT;
  static readonly DNASTACK_IMPORT_URL= 'https://app.dnastack.com/#/app/workflow/import/dockstore';
  static readonly FIRECLOUD_IMPORT_URL= 'https://portal.firecloud.org/#import/dockstore';

  static readonly GITHUB_CLIENT_ID = 'b2877aac203be39fc6b0';
  static readonly GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
  static readonly GITHUB_REDIRECT_URI = Dockstore.LOCAL_URI + '/auth/' + Provider.GITHUB;
  static readonly GITHUB_SCOPE = 'read:org,user:email';

  static readonly QUAYIO_AUTH_URL = 'https://quay.io/oauth/authorize';
  static readonly QUAYIO_REDIRECT_URI = Dockstore.LOCAL_URI + '/auth/' + Provider.QUAY;
  static readonly QUAYIO_SCOPE = 'repo:read,user:read';
  static readonly QUAYIO_CLIENT_ID = '80KHN1Y3LEOWWL80MQSK';

  static readonly BITBUCKET_AUTH_URL = 'https://bitbucket.org/site/oauth2/authorize';
  static readonly BITBUCKET_CLIENT_ID = 'fill this in';

  static readonly GITLAB_AUTH_URL = 'https://gitlab.com/oauth/authorize';
  static readonly GITLAB_CLIENT_ID = 'fe7f5e23ca3ed43b8ec2e26f11e9d3cadb7fbd43f39cc851ba6ed850803d9fe9';
  static readonly GITLAB_REDIRECT_URI = Dockstore.LOCAL_URI + '/auth/' + Provider.GITLAB;

  static readonly CWL_VISUALIZER_URI = 'https://view.commonwl.org';

  static readonly FEATURES = {
    enableCwlViewer: false,
    enableLaunchWithFireCloud: false
  };
}
