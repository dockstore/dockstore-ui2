import { CurrentCollectionsQuery } from './current-collections.query';
import { CurrentCollectionsStore } from './current-collections.store';

describe('CurrentCollectionsQuery', () => {
  let query: CurrentCollectionsQuery;

  beforeEach(() => {
    query = new CurrentCollectionsQuery(new CurrentCollectionsStore());
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });
});
