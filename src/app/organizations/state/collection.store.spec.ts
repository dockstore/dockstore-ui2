import { CollectionStore } from './collection.store';

describe('CollectionStore', () => {
  let store: CollectionStore;

  beforeEach(() => {
    store = new CollectionStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});
