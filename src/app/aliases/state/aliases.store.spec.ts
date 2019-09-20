import { AliasesStore } from './aliases.store';

describe('AliasesStore', () => {
  let store: AliasesStore;

  beforeEach(() => {
    store = new AliasesStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });
});
