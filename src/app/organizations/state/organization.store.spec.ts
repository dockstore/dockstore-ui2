import { OrganizationStore } from './organization.store';

describe('OrganizationStore', () => {
  let store: OrganizationStore;

  beforeEach(() => {
    store = new OrganizationStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });
});
