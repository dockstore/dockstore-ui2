import { CreateCollectionQuery } from './create-collection.query';
import { CreateCollectionStore } from './create-collection.store';

describe('CreateCollectionQuery', () => {
  let query: CreateCollectionQuery;

  beforeEach(() => {
    query = new CreateCollectionQuery(new CreateCollectionStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});
