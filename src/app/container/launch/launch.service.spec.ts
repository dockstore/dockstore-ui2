import { TestBed, inject } from '@angular/core/testing';

import { LaunchService } from './launch.service';

describe('LaunchService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LaunchService]
        });
    });

    it('should be created', inject([LaunchService], (service: LaunchService) => {
        expect(service).toBeTruthy();
    }));
    it('should getParamsString', inject([LaunchService], (service: LaunchService) => {
        expect(service.getParamsString('quay.io/a/b', 'latest', 'wdl'))
            .toContain('$ dockstore tool convert entry2json --descriptor wdl --entry quay.io/a/b:latest > Dockstore.json');
    }));
    it('should getCliString', inject([LaunchService], (service: LaunchService) => {
        expect(service.getCliString('a/b', 'latest', 'cwl'))
            .toContain('dockstore tool launch --entry a/b:latest --json Dockstore.json');
        expect(service.getCliString('quay.io/a/b', 'c', 'wdl'))
            .toContain('dockstore tool launch --entry quay.io/a/b:c --json Dockstore.json --descriptor wdl');
    }));

    it('should getCWLString', inject([LaunchService], (service: LaunchService) => {
        expect(service.getCwlString('quay.io/a/b', 'c', ''))
            .toContain('cwltool --non-strict');
        expect(service.getCwlString('quay.io/a/b', 'c', ''))
            .toContain('api/ga4gh/v1/tools/quay.io%2Fa%2Fb/versions/c/plain-CWL/descriptor Dockstore.json');
        expect(service.getCwlString('quay.io/a/b', 'c', 'd'))
            .toContain('api/ga4gh/v1/tools/quay.io%2Fa%2Fb%2Fd/versions/c/plain-CWL/descriptor Dockstore.json');
    }));
    it('should getConsonanceString', inject([LaunchService], (service: LaunchService) => {
        expect(service.getConsonanceString('a/b', 'latest')).toContain(
            'consonance run --tool-dockstore-id a/b:latest --run-descriptor Dockstore.json --flavour <AWS instance-type>');
    }));
});
