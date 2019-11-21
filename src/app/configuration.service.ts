import { Injectable } from '@angular/core';
import { Config, MetadataService } from './shared/swagger';
import { Dockstore } from './shared/dockstore.model';
import { ConfigService } from 'ng2-ui-auth';
import { AuthConfig } from './shared/auth.model';
import { IOauth2Options } from 'ng2-ui-auth/lib/config-interfaces';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  constructor(private metadataService: MetadataService, private configService: ConfigService) {}

  load(): Promise<void> {
    return this.metadataService
      .getConfig()
      .toPromise()
      .then(
        (config: Config) => {
          this.updateDockstoreModel(config);

          this.updateAuthProviders();
        },
        e => {
          console.error('Error downloading config.json', e);
          // Less than ideal, but just let the normal error handling in footer.component.ts kick in later.
          Promise.resolve();
        }
      );
  }

  private updateDockstoreModel(config: Config) {
    Dockstore.DISCOURSE_URL = config.discourseUrl;

    Dockstore.DNASTACK_IMPORT_URL = config.dnaStackImportUrl;
    Dockstore.DNANEXUS_IMPORT_URL = config.dnaNexusImportUrl;
    Dockstore.TERRA_IMPORT_URL = config.terraImportUrl;

    Dockstore.GITHUB_CLIENT_ID = config.githubClientId;
    Dockstore.GITHUB_AUTH_URL = config.gitHubAuthUrl;

    Dockstore.GITHUB_REDIRECT_URI = Dockstore.HOSTNAME + config.gitHubRedirectPath;
    Dockstore.GITHUB_SCOPE = config.gitHubScope;

    Dockstore.QUAYIO_AUTH_URL = config.quayIoAuthUrl;
    Dockstore.QUAYIO_REDIRECT_URI = Dockstore.HOSTNAME + config.quayIoRedirectPath;
    Dockstore.QUAYIO_SCOPE = config.quayIoScope;
    Dockstore.QUAYIO_CLIENT_ID = config.quayIoClientId;

    Dockstore.BITBUCKET_AUTH_URL = config.bitBucketAuthUrl;
    Dockstore.BITBUCKET_CLIENT_ID = config.bitBucketClientId;

    Dockstore.GITLAB_AUTH_URL = config.gitlabAuthUrl;
    Dockstore.GITLAB_CLIENT_ID = config.gitlabClientId;
    Dockstore.GITLAB_REDIRECT_URI = Dockstore.HOSTNAME + config.gitlabRedirectPath;
    Dockstore.GITLAB_SCOPE = config.gitlabScope;

    Dockstore.ZENODO_AUTH_URL = config.zenodoAuthUrl;
    Dockstore.ZENODO_CLIENT_ID = config.zenodoClientId;
    Dockstore.ZENODO_REDIRECT_URI = Dockstore.HOSTNAME + config.zenodoRedirectPath;
    Dockstore.ZENODO_SCOPE = config.zenodoScope;

    Dockstore.GOOGLE_CLIENT_ID = config.googleClientId;
    Dockstore.GOOGLE_SCOPE = config.googleScope;
    Dockstore.GOOGLE_TAG_MANAGER_ID = config.tagManagerId;

    Dockstore.CWL_VISUALIZER_URI = config.cwlVisualizerUri;

    Dockstore.GITHUB_APP_INSTALLATION_URL = config.gitHubAppInstallationUrl;

    Dockstore.DOCUMENTATION_URL = config.documentationUrl;
    // Dockstore.FEATURED_CONTENT_URL = config.feat
  }

  /**
   * In app.module.ts, the line `Ng2UiAuthModule.forRoot(AuthConfig)` in the imports section, initializes
   * the auth providers before the code in this file to fetch and set the configuration information has
   * executed. Update the providers here.
   */
  private updateAuthProviders() {
    if (this.isIOauth2Options(AuthConfig.providers.github)) {
      AuthConfig.providers.github.clientId = Dockstore.GITHUB_CLIENT_ID;
    }
    if (this.isIOauth2Options(AuthConfig.providers.google)) {
      AuthConfig.providers.google.clientId = Dockstore.GOOGLE_CLIENT_ID;
    }
    this.configService.updateProviders(AuthConfig.providers);
  }

  private isIOauth2Options(arg: any): arg is IOauth2Options {
    return arg.hasOwnProperty('clientId');
  }
}
