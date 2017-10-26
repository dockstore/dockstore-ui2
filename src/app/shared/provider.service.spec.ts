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
import { ProviderService } from './provider.service';
import { TestBed, inject } from '@angular/core/testing';

describe('ProviderService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ProviderService]
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
            registry: DockstoreTool.RegistryEnum.QUAYIO,
            toolname: ''
        };
        expect(service.setUpProvider(tool).providerUrl).toBeFalsy();
        const tool2 = tool;
        tool2.gitUrl = 'git@github.com:denis-yuen/dockstore-tool-bamstats.git';
        expect(service.setUpProvider(tool2).providerUrl).toContain('https://github.com/');
        const tool3 = tool;
        tool3.gitUrl = 'https://garyluu@bitbucket.org/garyluu/dockstore-tool-md5sum.git';
        expect(service.setUpProvider(tool3).providerUrl).toContain('https://bitbucket.org/');
        const tool4 = tool;
        tool4.gitUrl = 'https://gitlab.com/garyluu/dockstore-tool-md5sum.git';
        expect(service.setUpProvider(tool3).providerUrl).toContain('https://gitlab.com/');
        const tool5 = tool;
        tool5.gitUrl = '';
        expect(service.setUpProvider(tool3).providerUrl).toBeFalsy();
        expect(service.setUpProvider(tool3).provider).toBeFalsy();
        const tool6 = tool;
        tool5.gitUrl = 'https://someprivateregistry.com/garyluu/dockstore-tool-md5sum.git';
        expect(service.setUpProvider(tool3).providerUrl).toBeFalsy();
        expect(service.setUpProvider(tool3).provider).toBeFalsy();
    }));
});
