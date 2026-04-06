import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { OrganizationsStateService } from './organizations.service';
import { OrganizationsStore } from './organizations.store';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('OrganizationsStateService', () => {
  let organizationsStateService: OrganizationsStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [OrganizationsStateService, OrganizationsStore, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });

    organizationsStateService = TestBed.inject(OrganizationsStateService);
  });

  it('should be created', () => {
    expect(organizationsStateService).toBeDefined();
  });
});
