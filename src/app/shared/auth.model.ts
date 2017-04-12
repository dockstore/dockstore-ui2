import { Injectable } from '@angular/core';
import { CustomConfig } from 'ng2-ui-auth';

import { Dockstore } from '../shared/dockstore.model';

export class AuthConfig extends CustomConfig {
  defaultHeaders = {'Content-Type': 'application/json'};
  providers = {
    github: {
      url: Dockstore.API_URI + '/auth/tokens/github',
      clientId: Dockstore.GITHUB_CLIENT_ID
    }
  };
}
