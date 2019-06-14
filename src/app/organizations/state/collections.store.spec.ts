import { CollectionsStore } from './collections.store';

describe('CollectionsStore', () => {
  let store: CollectionsStore;

  beforeEach(() => {
    store = new CollectionsStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });
});
