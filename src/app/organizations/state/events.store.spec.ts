import { EventsStore } from './events.store';

describe('EventsStore', () => {
  let store: EventsStore;

  beforeEach(() => {
    store = new EventsStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });
});
