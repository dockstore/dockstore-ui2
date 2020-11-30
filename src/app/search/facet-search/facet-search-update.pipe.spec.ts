import { GetFacetSearchUpdatePipe } from './facet-search-update.pipe';

describe('Pipe: GetFacetSearchUpdate', () => {
    const pipe = new GetFacetSearchUpdatePipe();
    const nonExpandableFacet: Array<any> = ['abc', 'def', 'ghi'];
    const expandableFacet: Array<any> = ['a', 'aa', 'b', 'c', 'd', 'e'];
    it('should return nothing if less than 5 items', () => {
        expect(pipe.transform(nonExpandableFacet, 'a')).toBe(null);
        expect(pipe.transform(expandableFacet, 'a')).toBe(null);
    });
    it('should show number of hidden items', () => {
        expect(pipe.transform(expandableFacet, '')).toBe('1 more');
    });
});
