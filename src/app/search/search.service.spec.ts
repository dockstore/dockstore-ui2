import { SearchService } from './search.service';
import { register } from 'ts-node/dist';
import { TestBed, inject } from '@angular/core/testing';

describe('AsdfService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SearchService]
        });
    });

    it('should be created', inject([SearchService], (service: SearchService) => {
        expect(service).toBeTruthy();
    }));
    it('should get term from aggergation name', inject([SearchService], (service: SearchService) => {
        expect(service.aggregationNameToTerm('agg_terms_type')).toEqual('type');
    }));
    it('should set observables', inject([SearchService], (service: SearchService) => {
        service.setSearchInfo('stuff');
        service.searchInfo$.subscribe(result => {
            expect(result).toEqual('stuff');
        });
        service.setLoading(true);
        service.loading$.subscribe(result => {
            expect(result).toEqual(true);
        });
    }));
});
