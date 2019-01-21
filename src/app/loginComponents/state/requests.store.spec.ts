import { RequestsStore } from './requests.store';

describe('RequestsStore', () => {
  let store: RequestsStore;

  beforeEach(() => {
    store = new RequestsStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});
