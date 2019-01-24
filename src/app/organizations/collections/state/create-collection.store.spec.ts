import { CreateCollectionStore } from './create-collection.store';

describe('CreateCollectionStore', () => {
  let store: CreateCollectionStore;

  beforeEach(() => {
    store = new CreateCollectionStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});
