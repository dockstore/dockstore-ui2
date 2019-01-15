import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material';

import { OrganizationsService } from './organizations.service';
import { OrganizationsStore } from './organizations.store';

describe('OrganizationsService', () => {
  let organizationsService: OrganizationsService;
  let organizationsStore: OrganizationsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrganizationsService, OrganizationsStore],
      imports: [ HttpClientTestingModule, MatSnackBarModule ]
    });

    organizationsService = TestBed.get(OrganizationsService);
    organizationsStore = TestBed.get(OrganizationsStore);
  });

  it('should be created', () => {
    expect(organizationsService).toBeDefined();
  });

});
