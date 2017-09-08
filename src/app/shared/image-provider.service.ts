import { Injectable } from '@angular/core';

import { ContainersService } from './swagger';

@Injectable()
export class ImageProviderService {

  // TODO: link Amazon ECR properly

  private dockerRegistryList: Array<any>;

  constructor(private containersService: ContainersService) {
    this.dockerRegistryList = JSON.parse(localStorage.getItem('dockerRegistryList'));
    if (!this.dockerRegistryList) {
      this.getDockerRegistryList();
    }
  }

  setUpImageProvider(tool) {
    const registry = this.getImageProvider(tool.registry);
    const friendlyRegistryName = registry ? registry.friendlyName : null;
    tool.imgProvider = friendlyRegistryName;
    if (registry) {
      tool.imgProviderUrl = this.getImageProviderUrl(tool.path, registry);
    }
    return tool;
  }

  private getImageProvider(imageProvider: string): any {
    if (this.dockerRegistryList) {
      return this.dockerRegistryList.find(dockerRegistry => dockerRegistry.enum === imageProvider);
    } else {
      console.log('This should not be necessary');
      this.containersService.getDockerRegistries().subscribe(registryList => {
        return registryList.find(dockerRegistry => dockerRegistry.enum === imageProvider);
      });
    }
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

  private getDockerRegistryList() {
    this.containersService.getDockerRegistries()
    .subscribe(registryList => {
      this.dockerRegistryList = registryList;
      console.log('finally gotten');
      localStorage.setItem('dockerRegistryList', JSON.stringify(this.dockerRegistryList));
    });
  }

  checkPrivateOnlyRegistry(tool: any) {
    // TODO: Figure out why we need to grab the docker registry list again when the constructor already does it
    if (!this.dockerRegistryList) {
      console.log('This should not be necessary');
      this.containersService.getDockerRegistries().subscribe(registryList => {
        const dockerReg = registryList.find(x => x.enum === tool.registry);
        if (dockerReg) {
          return dockerReg.privateOnly === 'true';
        } else {
          return false;
        }
      });
    } else {
    const dockerReg = this.dockerRegistryList.find(x => x.enum === tool.registry);
    if (dockerReg) {
      return dockerReg.privateOnly === 'true';
    } else {
      return false;
    }
  }
  }
}
