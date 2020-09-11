/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import { Injectable } from '@angular/core';

import { faDocker, faGitlab, IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { faAmazonECR, faQuay, faWhale } from './custom-icons';
import { ExtendedDockstoreTool } from './models/ExtendedDockstoreTool';
import { ContainersService, DockstoreTool, MetadataService } from './swagger';
import RegistryEnum = DockstoreTool.RegistryEnum;

@Injectable()
export class ImageProviderService {
  // TODO: link Amazon ECR properly

  private dockerRegistryList: Array<any>;

  constructor(private containersService: ContainersService, private metadataService: MetadataService) {
    this.setdockerRegistryList(JSON.parse(localStorage.getItem('dockerRegistryList')));
    if (!this.dockerRegistryList) {
      this.getDockerRegistryList();
    }
  }

  public setdockerRegistryList(dockerRegistryList: Array<any>) {
    this.dockerRegistryList = dockerRegistryList;
  }

  /**
   * Returns an ExtendedDockstoreTool with the image provider url populated
   *
   * @param {ExtendedDockstoreTool} tool The original ExtendedDockstoreTool without the image provider url
   * @returns {ExtendedDockstoreTool} ExtendedDockstoreTool with the image provider url
   * @memberof ImageProviderService
   */
  setUpImageProvider(tool: ExtendedDockstoreTool): ExtendedDockstoreTool {
    const registry = this.getImageProvider(tool.registry);
    const friendlyRegistryName = registry ? registry.friendlyName : null;
    tool.imgProvider = friendlyRegistryName;
    if (registry) {
      tool.imgProviderUrl = this.getImageProviderUrl(tool.path, registry);
      tool.imgProviderIcon = this.getImageProviderIcon(tool.registry);
    }
    return tool;
  }

  private getImageProviderIcon(registry: RegistryEnum | null): IconDefinition | null {
    if (!registry) {
      return null;
    }
    switch (registry) {
      case RegistryEnum.QUAYIO:
        return faQuay;
      case RegistryEnum.DOCKERHUB:
        return faDocker;
      case RegistryEnum.GITLAB:
        return faGitlab;
      case RegistryEnum.AMAZONECR:
        return faAmazonECR;
      case RegistryEnum.SEVENBRIDGES: // TODO: Get SevenBridges Icon
      default:
        return faWhale;
    }
  }
  private getImageProvider(imageProvider: string): any {
    if (this.dockerRegistryList) {
      return this.dockerRegistryList.find((dockerRegistry) => dockerRegistry.enum === imageProvider);
    } else {
      console.log('This should not be necessary');
      this.metadataService.getDockerRegistries().subscribe((registryList) => {
        return registryList.find((dockerRegistry) => dockerRegistry._enum === imageProvider);
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
          url += match[2] !== '_' ? 'r/' : '';
        } else if (containerRegistry === 'GITLAB') {
          suffix = '/container_registry';
        }

        if (containerRegistry === 'AMAZON_ECR' || containerRegistry === 'SEVEN_BRIDGES') {
          url = match[1] + '/';
        }

        url += match[2] + '/' + match[3] + suffix;
        return url;
      }
    }

    return null;
  }

  private getDockerRegistryList() {
    this.metadataService.getDockerRegistries().subscribe((registryList) => {
      this.setdockerRegistryList(registryList);
      localStorage.setItem('dockerRegistryList', JSON.stringify(this.dockerRegistryList));
    });
  }

  checkPrivateOnlyRegistry(tool: any) {
    // TODO: Figure out why we need to grab the docker registry list again when the constructor already does it
    if (!this.dockerRegistryList) {
      console.log('This should not be necessary');
      this.metadataService.getDockerRegistries().subscribe((registryList) => {
        const dockerReg = registryList.find((x) => x._enum === tool.registry);
        if (dockerReg) {
          return dockerReg.privateOnly === 'true';
        } else {
          return false;
        }
      });
    } else {
      const dockerReg = this.dockerRegistryList.find((x) => x.enum === tool.registry);
      if (dockerReg) {
        return dockerReg.privateOnly === 'true';
      } else {
        return false;
      }
    }
  }
}
