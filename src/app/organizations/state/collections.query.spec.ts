import { CollectionsQuery } from './collections.query';
import { CollectionsStore } from './collections.store';

describe('CollectionsQuery', () => {
  let query: CollectionsQuery;

  beforeEach(() => {
    query = new CollectionsQuery(new CollectionsStore());
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });
});
