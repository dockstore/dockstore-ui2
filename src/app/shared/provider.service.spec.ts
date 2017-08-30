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
