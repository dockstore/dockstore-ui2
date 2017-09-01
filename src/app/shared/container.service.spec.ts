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
        const tool: DockstoreTool = {
            default_cwl_path: 'sampleDefaultCWLPath',
            default_dockerfile_path: 'sampleDefaultDockerfilePath',
            default_wdl_path: 'sampleDefaultWDLPath',
            gitUrl: 'sampleGitUrl',
            mode: DockstoreTool.ModeEnum.MANUALIMAGEPATH,
            name: 'sampleName',
            namespace: 'sampleNamespace',
            private_access: false,
            registry: DockstoreTool.RegistryEnum.QUAYIO,
            toolname: 'sampleToolname'
        };
        const tool1: DockstoreTool = {
            default_cwl_path: 'sampleDefaultCWLPath',
            default_dockerfile_path: 'sampleDefaultDockerfilePath',
            default_wdl_path: 'sampleDefaultWDLPath',
            gitUrl: 'sampleGitUrl',
            mode: DockstoreTool.ModeEnum.MANUALIMAGEPATH,
            name: 'sampleName',
            namespace: 'sampleNamespace',
            private_access: false,
            registry: DockstoreTool.RegistryEnum.QUAYIO,
            toolname: 'sampleToolname'
        };
        service.setTool(tool);
        expect(service.tool$.getValue()).not.toBe(tool1);
        expect(service.tool$.getValue()).toEqual(tool);
    }));
});
