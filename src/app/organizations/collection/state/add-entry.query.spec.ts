import { AddEntryQuery } from './add-entry.query';
import { AddEntryStore } from './add-entry.store';

describe('AddEntryQuery', () => {
  let query: AddEntryQuery;

  beforeEach(() => {
    query = new AddEntryQuery(new AddEntryStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});
