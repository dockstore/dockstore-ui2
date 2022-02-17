import { GravatarService } from '../../gravatar/gravatar.service';
import { OrganizationQuery } from './organization.query';
import { OrganizationStore } from './organization.store';

describe('OrganizationQuery', () => {
  let query: OrganizationQuery;

  beforeEach(() => {
    query = new OrganizationQuery(new OrganizationStore(), new GravatarService());
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });
});
