import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';

import { OrganizationsStateService } from './organizations.service';
import { OrganizationsStore } from './organizations.store';

describe('OrganizationsStateService', () => {
  let organizationsStateService: OrganizationsStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrganizationsStateService, OrganizationsStore],
      imports: [HttpClientTestingModule, MatSnackBarModule],
    });

    organizationsStateService = TestBed.inject(OrganizationsStateService);
  });

  it('should be created', () => {
    expect(organizationsStateService).toBeDefined();
  });
});
