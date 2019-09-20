import { CurrentCollectionsQuery } from '../../../entry/state/current-collections.query';
import { CurrentCollectionsStore } from '../../../entry/state/current-collections.store';
import { AddEntryQuery } from './add-entry.query';
import { AddEntryStore } from './add-entry.store';

describe('AddEntryQuery', () => {
  let query: AddEntryQuery;

  beforeEach(() => {
    query = new AddEntryQuery(new AddEntryStore(), new CurrentCollectionsQuery(new CurrentCollectionsStore()));
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });
});
