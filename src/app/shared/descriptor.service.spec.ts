import { DescriptorService } from './descriptor.service';
import { TestBed, inject } from '@angular/core/testing';

describe('DescriptorService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DescriptorService],
        });
    });

    it('should be created', inject([DescriptorService], (service: DescriptorService) => {
        expect(service).toBeTruthy();
    }));

    it('should get descriptors', inject([DescriptorService], (service: DescriptorService) => {
        const sampleVersion = {
            'id': 135,
            'reference': 'master',
            'sourceFiles': [
                {
                    'id': 136,
                    'type': 'DOCKSTORE_CWL',
                    'content': '',
                    'path': '/Dockstore.cwl'
                },
                {
                    'id': 138,
                    'type': 'DOCKERFILE',
                    'content': '',
                    'path': '/Dockerfile'
                },
                {
                    'id': 137,
                    'type': 'DOCKSTORE_WDL',
                    'content': '',
                    'path': '/Dockstore.wdl'
                }
            ],
            'hidden': false,
            'valid': true,
            'name': 'latest',
            'dirtyBit': false,
            'verified': false,
            'verifiedSource': null,
            'size': 50430898,
            'automated': true,
            'workingDirectory': '',
            'last_modified': 1491599317000,
            'image_id': '5f01c6b7ae8f6ba7701aa30b6643866c2ff6166a8f2221844840f46d636e1ed3',
            'dockerfile_path': '/Dockerfile',
            'cwl_path': '/Dockstore.cwl',
            'wdl_path': '/Dockstore.wdl'
        };
        expect(service.getDescriptors(null, sampleVersion)).toEqual(['cwl', 'wdl']);
    }));
});
