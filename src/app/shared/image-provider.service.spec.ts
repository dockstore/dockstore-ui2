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

import { DockstoreTool } from './swagger/model/dockstoreTool';
import { ContainersStubService } from '../test/service-stubs';
import { ContainersService } from './swagger/api/containers.service';
import { ImageProviderService } from './image-provider.service';
import { TestBed, inject } from '@angular/core/testing';

describe('ImageProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageProviderService, { provide: ContainersService, useClass: ContainersStubService }]
    });
  });

  it('should be created', inject([ImageProviderService], (service: ImageProviderService) => {
    expect(service).toBeTruthy();
    expect(localStorage.getItem('dockerRegistryList')).toBeTruthy();
  }));
  it('should check private only registry', inject([ImageProviderService], (service: ImageProviderService) => {
    const tool: DockstoreTool = {
      defaultCWLTestParameterFile: '',
      defaultWDLTestParameterFile: '',
      default_cwl_path: '',
      default_dockerfile_path: '',
      default_wdl_path: '',
      gitUrl: 'https://github.com/mr-c/khmer',
      mode: DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSAUTOMATEDBUILDS,
      tool_path: 'quay.io/dockstore-testing/dockstore-tool-bamstats',
      name: '',
      namespace: '',
      private_access: false,
      registry_string: 'quay.io',
      registry: DockstoreTool.RegistryEnum.QUAYIO,
      toolname: ''
    };
    expect(service.checkPrivateOnlyRegistry(tool)).toBeFalsy();
    const tool2 = tool;
    tool2.registry_string = 'amazon.dkr.ecr.test.amazonaws.com';
    tool2.registry = DockstoreTool.RegistryEnum.AMAZONECR;
    expect(service.checkPrivateOnlyRegistry(tool2)).toBeTruthy();
    tool2.registry_string = null;
    tool2.registry = null;
    expect(service.checkPrivateOnlyRegistry(tool)).toBeFalsy();
  }));

  it('should get image provider', inject([ImageProviderService], (service: ImageProviderService) => {
    const tool: DockstoreTool = {
      defaultCWLTestParameterFile: '',
      defaultWDLTestParameterFile: '',
      default_cwl_path: '',
      default_dockerfile_path: '',
      default_wdl_path: '',
      gitUrl: 'https://github.com/mr-c/khmer',
      mode: DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSAUTOMATEDBUILDS,
      tool_path: 'quay.io/potato/beef/stew',
      path: 'quay.io/dockstore-testing/dockstore-tool-bamstats',
      name: '',
      namespace: '',
      private_access: false,
      registry_string: 'quay.io',
      registry: DockstoreTool.RegistryEnum.QUAYIO,
      toolname: null
    };
    expect(service.setUpImageProvider(tool).imgProvider).toEqual('Quay.io');
    const tool2: any = tool;
    tool2.registry_string = 'asdf';
    tool2.registry = null;
    expect(service.setUpImageProvider(tool).imgProvider).toBeFalsy();
    tool.registry_string = 'registry.hub.docker.com';
    tool.registry = DockstoreTool.RegistryEnum.DOCKERHUB;
    expect(service.setUpImageProvider(tool).imgProviderUrl).toEqual('https://hub.docker.com/r/dockstore-testing/dockstore-tool-bamstats');
    tool.registry_string = 'gitlab.com';
    tool.registry = DockstoreTool.RegistryEnum.GITLAB;
    expect(service.setUpImageProvider(tool).imgProviderUrl).toEqual(
      'https://gitlab.com/dockstore-testing/dockstore-tool-bamstats/container_registry'
    );
  }));
});
