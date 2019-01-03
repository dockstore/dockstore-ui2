import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule, MatSnackBarModule } from '@angular/material';

import { RegisterOrganizationService } from './register-organization.service';

describe('RegisterOrganizationService', () => {
  let registerOrganizationService: RegisterOrganizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegisterOrganizationService],
      imports: [ HttpClientTestingModule, MatSnackBarModule, MatDialogModule ]
    });

    registerOrganizationService = TestBed.get(RegisterOrganizationService);
  });

  it('should be created', () => {
    expect(registerOrganizationService).toBeDefined();
  });

});
