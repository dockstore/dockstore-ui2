import { RequestsQuery } from './requests.query';
import { RequestsStore } from './requests.store';

describe('RequestsQuery', () => {
  let query: RequestsQuery;

  beforeEach(() => {
    query = new RequestsQuery(new RequestsStore());
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });
});
