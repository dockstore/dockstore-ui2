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

import { sampleTool2, sampleTool3 } from './../test/mocked-objects';
import { sampleTool1 } from '../test/mocked-objects';
import { DockstoreTool } from './swagger/model/dockstoreTool';
import { inject, TestBed } from '@angular/core/testing';

import { ContainerService } from './container.service';

describe('ContainerService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ContainerService],
        });
    });

    it('should be created', inject([ContainerService], (service: ContainerService) => {
        expect(service).toBeTruthy();
    }));
    it('should set observables', inject([ContainerService], (service: ContainerService) => {
        const tool: DockstoreTool = sampleTool1;
        const tool1: DockstoreTool = sampleTool2;

        service.setTool(tool);
        service.setNsContainers('2');
        service.setCopyBtn('1');
        expect(service.tool$.getValue()).not.toBe(tool1);
        expect(service.tool$.getValue()).toEqual(tool);
        service.copyBtn$.subscribe(value => expect(value).toEqual('1'));
        service.nsContainers.subscribe(value => expect(value).toEqual('2'));
    }));

    it('should replace tool', inject([ContainerService], (service: ContainerService) => {
        const tools: DockstoreTool[] = [sampleTool1, sampleTool2, sampleTool3];
        const newSampleTool1: DockstoreTool = {
            id: 1,
            default_cwl_path: 'sampleDefaultCWLPath',
            default_dockerfile_path: 'sampleDefaultDockerfilePath',
            default_wdl_path: 'sampleDefaultWDLPath',
            gitUrl: 'sampleGitUrl',
            mode: DockstoreTool.ModeEnum.MANUALIMAGEPATH,
            name: 'sampleName',
            namespace: 'sampleNamespace',
            private_access: false,
            registry: DockstoreTool.RegistryEnum.QUAYIO,
            toolname: 'sampleToolname',
            defaultCWLTestParameterFile: 'sampleDefaultCWLTestParameterFile',
            defaultWDLTestParameterFile: 'sampleDefaultWDLTestParameterFile'
        };
        service.replaceTool(tools, newSampleTool1);
        expect(service.tools$.getValue()).toEqual([newSampleTool1, sampleTool2, sampleTool3]);
    }));

    it('should add to tools', inject([ContainerService], (service: ContainerService) => {
        const tools: DockstoreTool[] = [sampleTool1, sampleTool2];
        service.setTools(tools);
        service.addToTools(tools, sampleTool3);
        expect(service.tools$.getValue()).toEqual([sampleTool1, sampleTool2, sampleTool3]);
    }));

    it('should get build mode', inject([ContainerService], (service: ContainerService) => {
        expect(service.getBuildMode(DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSAUTOMATEDBUILDS)).toEqual('Fully-Automated');
        expect(service.getBuildMode(DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSWITHMIXED)).toEqual('Partially-Automated');
        expect(service.getBuildMode(DockstoreTool.ModeEnum.MANUALIMAGEPATH)).toEqual('Manual');
    }));

    it('should get build mode tooltip', inject([ContainerService], (service: ContainerService) => {
        expect(service.getBuildModeTooltip(DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSAUTOMATEDBUILDS))
            .toEqual('Fully-Automated: All versions are automated builds');
        expect(service.getBuildModeTooltip(DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSWITHMIXED))
            .toEqual('Partially-Automated: At least one version is an automated build');
        expect(service.getBuildModeTooltip(DockstoreTool.ModeEnum.MANUALIMAGEPATH)).toEqual('Manual: No versions are automated builds');
    }));
});
