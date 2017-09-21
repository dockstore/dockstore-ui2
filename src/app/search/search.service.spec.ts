import { SearchService } from './search.service';
import { register } from 'ts-node/dist';
import { TestBed, inject } from '@angular/core/testing';

describe('SearchService', () => {
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
    }));
    it('should decide whether to disable tabs or not', inject([SearchService], (service: SearchService) => {
        expect(service.haveNoHits([])).toEqual(true);
        expect(service.haveNoHits([{'asdf': 'asdf'}])).toEqual(false);
    }));
});
