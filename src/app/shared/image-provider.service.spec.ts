import * as path from 'path';
import { DockstoreTool } from './swagger/model/dockstoreTool';
import { ContainersStubService } from '../test/service-stubs';
import { ContainersService } from './swagger/api/containers.service';
import { ImageProviderService } from './image-provider.service';
import { TestBed, inject } from '@angular/core/testing';

describe('ImageProviderService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ImageProviderService,
                { provide: ContainersService, useClass: ContainersStubService }]
        });
    });

    it('should be created', inject([ImageProviderService], (service: ImageProviderService) => {
        expect(service).toBeTruthy();
        expect(localStorage.getItem('dockerRegistryList')).toBeTruthy();
    }));
    it('should check private only registry', inject([ImageProviderService], (service: ImageProviderService) => {
        const tool: DockstoreTool = {
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
        expect(service.checkPrivateOnlyRegistry(tool)).toBeFalsy();
        const tool2 = tool;
        tool2.registry = DockstoreTool.RegistryEnum.AMAZONECR;
        expect(service.checkPrivateOnlyRegistry(tool)).toBeTruthy();
        tool2.registry = null;
        expect(service.checkPrivateOnlyRegistry(tool)).toBeFalsy();
    }));

    it('should get image provider', inject([ImageProviderService], (service: ImageProviderService) => {
        const tool: DockstoreTool = {
            default_cwl_path: '',
            default_dockerfile_path: '',
            default_wdl_path: '',
            gitUrl: 'https://github.com/mr-c/khmer',
            mode: DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSAUTOMATEDBUILDS,
            name: '',
            namespace: '',
            private_access: false,
            registry: DockstoreTool.RegistryEnum.QUAYIO,
            toolname: '',
            path: 'quay.io/dockstore-testing/dockstore-tool-bamstats'
        };
        expect(service.setUpImageProvider(tool).imgProvider).toEqual('Quay.io');
        const tool2: any = tool;
        tool2.registry = 'asdf';
        expect(service.setUpImageProvider(tool).imgProvider).toBeFalsy();
        tool.registry = DockstoreTool.RegistryEnum.DOCKERHUB;
        expect(service.setUpImageProvider(tool).imgProviderUrl).toEqual(
            'https://hub.docker.com/r/dockstore-testing/dockstore-tool-bamstats');
        tool.registry = DockstoreTool.RegistryEnum.GITLAB;
        expect(service.setUpImageProvider(tool).imgProviderUrl).toEqual(
            'https://gitlab.com/dockstore-testing/dockstore-tool-bamstats/container_registry');
        tool.path = null;
        expect(service.setUpImageProvider(tool).imgProviderUrl).toBeFalsy();
    }));
});
