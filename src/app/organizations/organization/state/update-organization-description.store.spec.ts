import { UpdateOrganizationDescriptionStore } from './update-organization-description.store';

describe('UpdateOrganizationDescriptionStore', () => {
  let store: UpdateOrganizationDescriptionStore;

  beforeEach(() => {
    store = new UpdateOrganizationDescriptionStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

});
