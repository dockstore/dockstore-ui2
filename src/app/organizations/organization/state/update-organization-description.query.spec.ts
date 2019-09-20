import { UpdateOrganizationOrCollectionDescriptionQuery } from './update-organization-description.query';
import { UpdateOrganizationOrCollectionDescriptionStore } from './update-organization-description.store';

describe('UpdateOrganizationOrCollectionDescriptionQuery', () => {
  let query: UpdateOrganizationOrCollectionDescriptionQuery;

  beforeEach(() => {
    query = new UpdateOrganizationOrCollectionDescriptionQuery(new UpdateOrganizationOrCollectionDescriptionStore());
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });
});
