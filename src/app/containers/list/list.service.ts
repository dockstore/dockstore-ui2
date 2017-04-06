import { Injectable } from '@angular/core';

import { Dockstore } from '../../shared/dockstore.model';
import { DockstoreService } from '../../shared/dockstore.service';

@Injectable()
export class ListContainersService {

  readonly publishedToolsUrl = Dockstore.API_URI + '/containers/published';

  constructor(private dockstoreService: DockstoreService) { }

  getPublishedTools() {
    return this.dockstoreService.getResponse(this.publishedToolsUrl);
  }

  private getGitProvider(gitUrl: string): string {
    return this.dockstoreService.getProvider(gitUrl);
  }

  private getGitProviderUrl(gitUrl: string, provider: string): string {
    return this.dockstoreService.getProviderUrl(gitUrl, provider);
  }

  private getDockerRegistryList() {
    const registryListUrl = Dockstore.API_URI + '/containers/dockerRegistryList';
    return this.dockstoreService.getResponse(registryListUrl);
  }

  private getImageProvider(imageProvider: string): any {
    let dockerRegistryList;

    return this.getDockerRegistryList().map(
      (registryList) => {
        dockerRegistryList = registryList;
        for (const registry of dockerRegistryList) {
          if (imageProvider === registry.enum) {
            return registry;
          }
        }
        return null;
      }
    );
  }

  private getImageProviderName(registry) {
    return registry.friendlyName;
  }

  private getImageProviderUrl(path: string, registry) {
    if (path) {
      const imageRegExp = /^(.*)\/(.*)\/(.*)\/?$/i;
      const match = imageRegExp.exec(path);

      if (match) {
        let url = registry.url;
        let suffix = '';
        let containerRegistry = registry.enum;

        if (containerRegistry === 'DOCKER_HUB') {
          url += ((match[2] !== '_') ? 'r/' : '');
        } else if (containerRegistry === 'GITLAB') {
          suffix = '/container_registry';
        }

        url += match[2] + '/' + match[3] + suffix;
        return url;
      }
    }

    return null;
  }

  setProviders(tool) {
    const gitUrl = tool.gitUrl;

    tool.provider = this.getGitProvider(gitUrl);
    tool.providerUrl = this.getGitProviderUrl(gitUrl, tool.provider);

    this.getImageProvider(tool.registry)
      .subscribe(
        (registry) => {
          tool.imgProvider = this.getImageProviderName(registry);
          tool.imgProviderUrl = this.getImageProviderUrl(tool.path, registry);
        }
      );

    return tool;
  }

  getDockerPullCmd(path: string, tagName: string = ''): string {
    let dockerPullCmd = 'docker pull ';
    const prefix = 'registry.hub.docker.com/';
    if (path.indexOf(prefix) !== -1) {
      path = path.replace(prefix, '');
    }
    if (path.indexOf('_/') !== -1) {
      path = path.replace('_/', '');
    }
    dockerPullCmd += path;
    if (tagName) {
      dockerPullCmd += ':' + tagName;
    }
    return dockerPullCmd;
  }
}
