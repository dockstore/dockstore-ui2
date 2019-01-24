import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { OrganizationService } from './organization.service';
import { OrganizationStore } from './organization.store';

describe('OrganizationService', () => {
  let organizationService: OrganizationService;
  let organizationStore: OrganizationStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrganizationService, OrganizationStore],
      imports: [ HttpClientTestingModule, RouterTestingModule ]
    });

    organizationService = TestBed.get(OrganizationService);
    organizationStore = TestBed.get(OrganizationStore);
  });

  it('should be created', () => {
    expect(organizationService).toBeDefined();
  });

});
