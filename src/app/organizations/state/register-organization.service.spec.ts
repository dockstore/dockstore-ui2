import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatSnackBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of as observableOf, throwError } from 'rxjs';

import { OrganisationsService } from '../../shared/swagger';
import { RegisterOrganizationService } from './register-organization.service';

let organisationsServiceSpy: jasmine.SpyObj<OrganisationsService>;
let matDialogSpy: jasmine.SpyObj<MatDialog>;

describe('RegisterOrganizationService', () => {
  let registerOrganizationService: RegisterOrganizationService;
  const exampleFormState = { name: '', description: '', link: '', location: '', contactEmail: '' };
  beforeEach(() => {
    const organisationsServiceStub = jasmine.createSpyObj('OrganizationsService', ['createOrganisation']);
    const matDialogStub = jasmine.createSpyObj('MatDialog', ['closeAll']);
    TestBed.configureTestingModule({
      providers: [RegisterOrganizationService,
        { provide: OrganisationsService, useValue: organisationsServiceStub },
        { provide: MatDialog, useValue: matDialogStub }
      ],
      imports: [HttpClientTestingModule, MatSnackBarModule, MatDialogModule, BrowserAnimationsModule]
    });

    registerOrganizationService = TestBed.get(RegisterOrganizationService);
    organisationsServiceSpy = TestBed.get(OrganisationsService);
    matDialogSpy = TestBed.get(MatDialog);
  });

  it('should be created', () => {
    expect(registerOrganizationService).toBeDefined();
  });

  it('should try to add an organization', () => {
    organisationsServiceSpy.createOrganisation.and.returnValue(observableOf(null));
    matDialogSpy.closeAll.and.returnValue(null);

    registerOrganizationService.addOrganization(exampleFormState);

    // Expected createOrganisation call to be called (and it will succeed)
    expect(organisationsServiceSpy.createOrganisation.calls.count()).toBe(1, 'spy method was called once');
    // Upon success, the dialog would close
    expect(matDialogSpy.closeAll.calls.count()).toBe(1, 'spy method was not called once');
  });

  it('should handle error when adding an organization', () => {
    organisationsServiceSpy.createOrganisation.and.returnValue(throwError('test 404 error'));

    registerOrganizationService.addOrganization(exampleFormState);

    // Expected createOrganisation call to be called (even though it will fail)
    expect(organisationsServiceSpy.createOrganisation.calls.count()).toBe(1, 'spy method was called once');
    // Upon error, the dialog would not close
    expect(matDialogSpy.closeAll.calls.count()).toBe(0, 'spy method was called');
  });
});
