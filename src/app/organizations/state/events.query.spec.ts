import { EventsQuery } from './events.query';
import { EventsStore } from './events.store';

describe('EventsQuery', () => {
  let query: EventsQuery;

  beforeEach(() => {
    query = new EventsQuery(new EventsStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});
