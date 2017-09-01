import { DateService } from './date.service';
import { DockstoreTool } from './swagger/model/dockstoreTool';
import { ContainersStubService } from '../test/service-stubs';
import { ContainersService } from './swagger/api/containers.service';
import { ImageProviderService } from './image-provider.service';
import { TestBed, inject } from '@angular/core/testing';

describe('DateService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DateService]
        });
    });

    it('should be created', inject([DateService], (service: DateService) => {
        expect(service).toBeTruthy();
    }));
    it('should be getDateTimeMessage', inject([DateService], (service: DateService) => {
        expect(service.getDateTimeMessage(1504214211322)).toEqual('Aug. 31 2017 at 17:16:51');
    }));
    it('should be getAgoMessage', inject([DateService], (service: DateService) => {
        expect(service.getAgoMessage(null)).toEqual('n/a');
        expect(service.getAgoMessage(1498675698000)).toContain(' days ago');
    }));
    it('should be getVerifiedLink', inject([DateService], (service: DateService) => {
        expect(service.getVerifiedLink()).toEqual('/docs/faq#what-is-a-verified-tool-or-workflow-');
    }));
});
