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

import { inject, TestBed } from '@angular/core/testing';
import { faBitbucket, faGithub, faGitlab } from '@fortawesome/free-brands-svg-icons';
import { validTool } from '../test/mocked-objects';
import { faDockstore } from './custom-icons';
import { ExtendedDockstoreTool } from './models/ExtendedDockstoreTool';
import { ProviderService } from './provider.service';
import { DockstoreTool } from './swagger/model/dockstoreTool';

describe('ProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProviderService],
    });
  });

  it('should be created', inject([ProviderService], (service: ProviderService) => {
    expect(service).toBeTruthy();
  }));

  it('should set up provider', inject([ProviderService], (service: ProviderService) => {
    const tool: DockstoreTool = {
      defaultCWLTestParameterFile: '',
      defaultWDLTestParameterFile: '',
      default_cwl_path: '',
      default_dockerfile_path: '',
      default_wdl_path: '',
      gitUrl: 'https://github.com/mr-c/khmer',
      mode: DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSAUTOMATEDBUILDS,
      name: '',
      namespace: '',
      private_access: false,
      registry_string: 'quay.io',
      registry: DockstoreTool.RegistryEnum.QUAYIO,
      toolname: '',
    };
    expect(service.setUpProvider(tool).providerUrl).toBeFalsy();
    const tool2 = tool;
    tool2.gitUrl = 'git@github.com:denis-yuen/dockstore-tool-bamstats.git';
    expect(service.setUpProvider(tool2).providerUrl).toContain('https://github.com/');
    const tool3 = tool;
    tool3.gitUrl = 'git@bitbucket.org:garyluu/dockstore-tool-md5sum.git';
    expect(service.setUpProvider(tool3).providerUrl).toContain('https://bitbucket.org/');
    const tool4 = tool;
    tool4.gitUrl = 'git@gitlab.com:garyluu/dockstore-tool-md5sum.git';
    expect(service.setUpProvider(tool4).providerUrl).toContain('https://gitlab.com/');
    const tool5 = tool;
    tool5.gitUrl = '';
    expect(service.setUpProvider(tool5).providerUrl).toBeFalsy();
    expect(service.setUpProvider(tool5).provider).toBeFalsy();
    const tool6 = tool;
    tool6.gitUrl = 'https://someprivateregistry.com/garyluu/dockstore-tool-md5sum.git';
    expect(service.setUpProvider(tool6).providerUrl).toBeFalsy();
    expect(service.setUpProvider(tool6).provider).toBeFalsy();
    const tool7 = tool;
    tool7.gitUrl = 'git@dockstore.org:garyluu/dockstore-tool-md5sum.git';
    expect(service.setUpProvider(tool7).providerUrl).toContain('https://dockstore.org/');
  }));
  it('should display appropriate icons for providers', inject([ProviderService], (service: ProviderService) => {
    const tool: ExtendedDockstoreTool = validTool;
    expect(service.setUpProvider(tool).providerIcon).toEqual(faGithub);
    tool.gitUrl = 'git@bitbucket.org:garyluu/dockstore-tool-md5sum.git';
    expect(service.setUpProvider(tool).providerIcon).toEqual(faBitbucket);
    tool.gitUrl = 'git@gitlab.com:garyluu/dockstore-tool-md5sum.git';
    expect(service.setUpProvider(tool).providerIcon).toEqual(faGitlab);
    tool.gitUrl = 'git@dockstore.org:garyluu/dockstore-tool-md5sum.git';
    expect(service.setUpProvider(tool).providerIcon).toEqual(faDockstore);
  }));
});
