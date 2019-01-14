import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material';

import { OrganizationsStateService } from './organizations.service';
import { OrganizationsStore } from './organizations.store';

describe('OrganizationsStateService', () => {
  let organizationsStateService: OrganizationsStateService;
  let organizationsStore: OrganizationsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrganizationsStateService, OrganizationsStore],
      imports: [ HttpClientTestingModule, MatSnackBarModule ]
    });

    organizationsStateService = TestBed.get(OrganizationsStateService);
    organizationsStore = TestBed.get(OrganizationsStore);
  });

  it('should be created', () => {
    expect(organizationsStateService).toBeDefined();
  });

});
