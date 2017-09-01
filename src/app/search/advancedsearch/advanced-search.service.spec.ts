import { AdvancedSearchObject } from '../../shared/models/AdvancedSearchObject';
import { AdvancedSearchService } from './advanced-search.service';
import { TestBed, inject } from '@angular/core/testing';

describe('AdvancedSearchService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AdvancedSearchService]
        });
    });

    it('should be created', inject([AdvancedSearchService], (service: AdvancedSearchService) => {
        expect(service).toBeTruthy();
    }));
    it('should be set observables', inject([AdvancedSearchService], (service: AdvancedSearchService) => {
        const object1: AdvancedSearchObject = {
            ANDSplitFilter: '',
            ANDNoSplitFilter: '',
            ORFilter: '',
            NOTFilter: '',
            searchMode: 'files',
            toAdvanceSearch: false
          };
        const object2: AdvancedSearchObject = {
            ANDSplitFilter: '',
            ANDNoSplitFilter: '',
            ORFilter: '',
            NOTFilter: '',
            searchMode: 'files',
            toAdvanceSearch: true
          };
        expect(service.showModal$.getValue()).toBeFalsy();
        expect(service.advancedSearch$.getValue()).toEqual(object1);
        service.setAdvancedSearch(object2);
        service.setShowModal(true);
        expect(service.advancedSearch$.getValue()).toEqual(object2);
        expect(service.showModal$.getValue()).toBeTruthy();
        service.clear();
        expect(service.advancedSearch$.getValue()).toEqual(object1);
        // service.advancedSearch$.subscribe(object => expect(object).toEqual(object1));
    }));
});
