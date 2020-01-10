import { NotificationsStore } from './notifications.store';

describe('NotificationsStore', () => {
  let store: NotificationsStore;

  beforeEach(() => {
    store = new NotificationsStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });
});
