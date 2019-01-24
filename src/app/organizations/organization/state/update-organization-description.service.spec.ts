import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UpdateOrganizationDescriptionService } from './update-organization-description.service';
import { UpdateOrganizationDescriptionStore } from './update-organization-description.store';

describe('UpdateOrganizationDescriptionService', () => {
  let updateOrganizationDescriptionService: UpdateOrganizationDescriptionService;
  let updateOrganizationDescriptionStore: UpdateOrganizationDescriptionStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpdateOrganizationDescriptionService, UpdateOrganizationDescriptionStore],
      imports: [ HttpClientTestingModule ]
    });

    updateOrganizationDescriptionService = TestBed.get(UpdateOrganizationDescriptionService);
    updateOrganizationDescriptionStore = TestBed.get(UpdateOrganizationDescriptionStore);
  });

  it('should be created', () => {
    expect(updateOrganizationDescriptionService).toBeDefined();
  });

});
