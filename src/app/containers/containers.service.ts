import { Injectable } from '@angular/core';

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
    return this.dockstoreService.getProvider(gitUrl);
  }

  getProviderUrl(gitUrl: string, provider: string): string {
    return this.dockstoreService.getProviderUrl(gitUrl, provider);
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
