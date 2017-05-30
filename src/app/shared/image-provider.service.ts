import { Injectable } from '@angular/core';

import { Dockstore } from './dockstore.model';

import { HttpService } from './http.service';

@Injectable()
export class ImageProviderService {

  // TODO: link Amazon ECR properly

  private dockerRegistryList: Array<any>;

  constructor(private httpService: HttpService) {
    this.dockerRegistryList = JSON.parse(localStorage.getItem('dockerRegistryList'));

    if (!this.dockerRegistryList) {
      this.getDockerRegistryList()
        .subscribe(registryList => {
          this.dockerRegistryList = registryList;
          localStorage.setItem('dockerRegistryList', JSON.stringify(this.dockerRegistryList));
        });
    }
  }

  private getDockerRegistryList() {
    return this.httpService.getResponse(`${ Dockstore.API_URI }/containers/dockerRegistryList`);
  }

  setUpImageProvider(tool) {
    const registry = this.getImageProvider(tool.registry);
    tool.imgProvider = registry.friendlyName;
    tool.imgProviderUrl = this.getImageProviderUrl(tool.path, registry);
    return tool;
  }

  private getImageProvider(imageProvider: string): any {
    for (const registry of this.dockerRegistryList) {
      if (imageProvider === registry.enum) {
        return registry;
      }
    }
    return null;
  }

  private getImageProviderUrl(path: string, registry) {
    if (path) {
      const imageRegExp = /^(.*)\/(.*)\/(.*)\/?$/i;
      const match = imageRegExp.exec(path);

      if (match) {
        let url = registry.url;
        let suffix = '';
        const containerRegistry = registry.enum;

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

}
