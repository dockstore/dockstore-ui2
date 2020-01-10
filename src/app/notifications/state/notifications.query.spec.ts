import { NotificationsQuery } from './notifications.query';
import { NotificationsStore } from './notifications.store';

describe('NotificationsQuery', () => {
  let query: NotificationsQuery;

  beforeEach(() => {
    query = new NotificationsQuery(new NotificationsStore());
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });
});
