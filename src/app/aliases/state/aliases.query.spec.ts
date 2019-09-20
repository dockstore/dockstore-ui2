import { AliasesQuery } from './aliases.query';
import { AliasesStore } from './aliases.store';

describe('AliasesQuery', () => {
  let query: AliasesQuery;

  beforeEach(() => {
    query = new AliasesQuery(new AliasesStore());
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });
});
