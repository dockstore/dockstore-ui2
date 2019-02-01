import { AddEntryStore } from './add-entry.store';

describe('AddEntryStore', () => {
  let store: AddEntryStore;

  beforeEach(() => {
    store = new AddEntryStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});
