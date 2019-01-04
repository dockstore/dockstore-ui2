import { OrganizationsQuery } from './organizations.query';
import { OrganizationsStore } from './organizations.store';

describe('OrganizationsQuery', () => {
  let query: OrganizationsQuery;

  beforeEach(() => {
    query = new OrganizationsQuery(new OrganizationsStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});
