import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Dockstore } from '../shared/dockstore.model';
import { DockstoreService } from '../shared/dockstore.service';

@Injectable()
export class ContainersService {

  readonly publishedToolsUrl = Dockstore.API_URI + '/containers/published';

  constructor(private dockstoreService: DockstoreService) { }

  getPublishedTools() {
    return this.dockstoreService.getResponse(this.publishedToolsUrl);
  }

  getProvider(gitUrl: string): string {
    if (gitUrl.includes('github.com')) {
      return 'Github';
    }

    if (gitUrl.includes('bitbucket.org')) {
      return 'Bitbucket';
    }

    if (gitUrl.includes('gitlab.com')) {
      return 'Gitlab';
    }

    return null;
  }

  getProviderUrl(gitUrl: string, provider: string): string {
      if (!gitUrl) return null;

      let gitUrlRegExp = /^.*:(.*)\/(.*).git$/i;
      let matchRes = gitUrlRegExp.exec(gitUrl);

      if (!matchRes) return null;

      let providerUrl = '';

      switch (provider) {
        case 'Github':
          providerUrl = 'https://github.com/';
          break;
        case 'Bitbucket':
          providerUrl = 'https://bitbucket.org/';
          break;
        case 'Gitlab':
          providerUrl = 'https://gitlab.com/';
          break;
        default:
          return null;
      }

      providerUrl += matchRes[1] + '/' + matchRes[2];
      return providerUrl;
  }

  getDockerPullCmd(path: string, tagName: string = ''): string {
    let dockerPullCmd = 'docker pull ';
    let prefix = 'registry.hub.docker.com/';
    if (path.indexOf(prefix) !== -1) path = path.replace(prefix, '');
    if (path.indexOf('_/') !== -1) path = path.replace('_/', '');
    dockerPullCmd += path;
    if (tagName) dockerPullCmd += ':' + tagName;
    return dockerPullCmd;
  }
}
