import { UpdateOrganizationOrCollectionDescriptionStore } from './update-organization-description.store';

describe('UpdateOrganizationOrCollectionDescriptionStore', () => {
  let store: UpdateOrganizationOrCollectionDescriptionStore;

  beforeEach(() => {
    store = new UpdateOrganizationOrCollectionDescriptionStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });
});
