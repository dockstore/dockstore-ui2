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

import { TestBed, inject } from '@angular/core/testing';

import { ToolLaunchService } from './tool-launch.service';

describe('LaunchService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ToolLaunchService]
        });
    });

    it('should be created', inject([ToolLaunchService], (service: ToolLaunchService) => {
        expect(service).toBeTruthy();
    }));
    it('should getParamsString', inject([ToolLaunchService], (service: ToolLaunchService) => {
        expect(service.getParamsString('quay.io/a/b', 'latest', 'wdl'))
            .toContain('$ dockstore tool convert entry2json --descriptor wdl --entry quay.io/a/b:latest > Dockstore.json');
    }));
    it('should getCliString', inject([ToolLaunchService], (service: ToolLaunchService) => {
        expect(service.getCliString('a/b', 'latest', 'cwl'))
            .toContain('dockstore tool launch --entry a/b:latest --json Dockstore.json');
        expect(service.getCliString('quay.io/a/b', 'c', 'wdl'))
            .toContain('dockstore tool launch --entry quay.io/a/b:c --json Dockstore.json --descriptor wdl');
    }));

    it('should getCWLString', inject([ToolLaunchService], (service: ToolLaunchService) => {
        expect(service.getCwlString('quay.io/a/b', 'c'))
            .toContain('cwl-runner');
        expect(service.getCwlString('quay.io/a/b', 'c'))
            .not.toContain('non-strict');
        expect(service.getCwlString('quay.io/a/b', 'c'))
            .toContain('api/ga4gh/v1/tools/quay.io%2Fa%2Fb/versions/c/plain-CWL/descriptor Dockstore.json');
        expect(service.getCwlString('quay.io/a/b/d', 'c'))
            .toContain('api/ga4gh/v1/tools/quay.io%2Fa%2Fb%2Fd/versions/c/plain-CWL/descriptor Dockstore.json');
    }));
    it('should getConsonanceString', inject([ToolLaunchService], (service: ToolLaunchService) => {
        expect(service.getDockstoreSupportedCwlLaunchString('quay.io/briandoconnor/dockstore-tool-bamstats', '1.25-11')).toContain(
            'cwltool quay.io/briandoconnor/dockstore-tool-bamstats:1.25-11 Dockstore.json');
    }));
    it('should getAlternateStrings', inject([ToolLaunchService], (service: ToolLaunchService) => {
        expect(service.getDockstoreSupportedCwlMakeTemplateString('quay.io/briandoconnor/dockstore-tool-bamstats', '1.25-11')).toContain(
            'cwltool --make-template quay.io/briandoconnor/dockstore-tool-bamstats:1.25-11 > input.yaml');
    }));
});
