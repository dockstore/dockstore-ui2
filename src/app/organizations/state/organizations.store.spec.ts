import { OrganizationsStore } from './organizations.store';

describe('OrganizationsStore', () => {
  let store: OrganizationsStore;

  beforeEach(() => {
    store = new OrganizationsStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });
});
