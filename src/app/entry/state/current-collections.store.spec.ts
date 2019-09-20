import { CurrentCollectionsStore } from './current-collections.store';

describe('CurrentCollectionsStore', () => {
  let store: CurrentCollectionsStore;

  beforeEach(() => {
    store = new CurrentCollectionsStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });
});
