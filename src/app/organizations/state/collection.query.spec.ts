import { CollectionQuery } from './collection.query';
import { CollectionStore } from './collection.store';

describe('CollectionQuery', () => {
  let query: CollectionQuery;

  beforeEach(() => {
    query = new CollectionQuery(new CollectionStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});
