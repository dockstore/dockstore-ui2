import { GetFacetSearchResultsPipe } from './facet-search.pipe';

describe('Pipe: GetFacetSearchResults', () => {
  const items: Array<any> = ['a', 'aa', 'b', 'c'];
  const results: Array<any> = ['a', 'aa'];
  const pipe = new GetFacetSearchResultsPipe();
  it('should return items that contain the search text', () => {
    expect(pipe).toBeTruthy();
    expect(pipe.transform(items, 'a', 'all_authors.name.keyword')).toEqual(results);
  });
  it('should only apply search in correct facet', () => {
    expect(pipe.transform(items, 'a', 'foo')).toEqual(items);
  });
  it('should not apply search if empty items or search text', () => {
    expect(pipe.transform([], 'a', 'all_authors.name.keyword')).toEqual([]);
    expect(pipe.transform(items, '', 'all_authors.name.keyword')).toEqual(items);
  });
});
