import { UpdateOrganizationDescriptionQuery } from './update-organization-description.query';
import { UpdateOrganizationDescriptionStore } from './update-organization-description.store';

describe('UpdateOrganizationDescriptionQuery', () => {
  let query: UpdateOrganizationDescriptionQuery;

  beforeEach(() => {
    query = new UpdateOrganizationDescriptionQuery(new UpdateOrganizationDescriptionStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

});
