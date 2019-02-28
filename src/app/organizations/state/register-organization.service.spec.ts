import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatSnackBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of as observableOf, throwError } from 'rxjs';

import { OrganizationsService } from '../../shared/swagger';
import { RegisterOrganizationService } from './register-organization.service';
import { FormBuilder } from '@angular/forms';

let organizationsServiceSpy: jasmine.SpyObj<OrganizationsService>;
let matDialogSpy: jasmine.SpyObj<MatDialog>;

describe('RegisterOrganizationService', () => {
  let registerOrganizationService: RegisterOrganizationService;
  const exampleFormState = { name: '', topic: '', link: '', location: '', contactEmail: '', displayName: '' };
  beforeEach(() => {
    const organizationsServiceStub = jasmine.createSpyObj('OrganizationsService', ['createOrganization', 'updateOrganization']);
    const matDialogStub = jasmine.createSpyObj('MatDialog', ['closeAll']);
    TestBed.configureTestingModule({
      providers: [RegisterOrganizationService, FormBuilder,
        { provide: OrganizationsService, useValue: organizationsServiceStub },
        { provide: MatDialog, useValue: matDialogStub }
      ],
      imports: [HttpClientTestingModule, MatSnackBarModule, MatDialogModule, BrowserAnimationsModule, RouterTestingModule]
    });

    registerOrganizationService = TestBed.get(RegisterOrganizationService);
    organizationsServiceSpy = TestBed.get(OrganizationsService);
    matDialogSpy = TestBed.get(MatDialog);
  });

  it('should be created', () => {
    expect(registerOrganizationService).toBeDefined();
  });

  it('should try to add an organization', () => {
    organizationsServiceSpy.createOrganization.and.returnValue(observableOf(null));
    matDialogSpy.closeAll.and.returnValue(null);

    registerOrganizationService.createOrganization(exampleFormState);

    // Expected createOrganization call to be called (and it will succeed)
    expect(organizationsServiceSpy.createOrganization.calls.count()).toBe(1, 'spy method was called once');
    // Upon success, the dialog would close
    expect(matDialogSpy.closeAll.calls.count()).toBe(1, 'spy method was not called once');
  });

  it('should handle error when updating an organization', () => {
    organizationsServiceSpy.updateOrganization.and.returnValue(throwError('test 404 error'));

    registerOrganizationService.updateOrganization(exampleFormState, 1, 'potato');

    // Expected createOrganization call to be called (even though it will fail)
    expect(organizationsServiceSpy.updateOrganization.calls.count()).toBe(1, 'spy method was called once');
    // Upon error, the dialog would not close
    expect(matDialogSpy.closeAll.calls.count()).toBe(0, 'spy method was called');
  });

  it('should try to update an organization', () => {
    organizationsServiceSpy.updateOrganization.and.returnValue(observableOf(null));
    matDialogSpy.closeAll.and.returnValue(null);

    registerOrganizationService.updateOrganization(exampleFormState, 1, 'potato');

    // Expected createOrganization call to be called (and it will succeed)
    expect(organizationsServiceSpy.updateOrganization.calls.count()).toBe(1, 'spy method was called once');
    // Upon success, the dialog would close
    expect(matDialogSpy.closeAll.calls.count()).toBe(1, 'spy method was not called once');
  });

  it('should handle error when adding an organization', () => {
    organizationsServiceSpy.createOrganization.and.returnValue(throwError('test 404 error'));

    registerOrganizationService.createOrganization(exampleFormState);

    // Expected createOrganization call to be called (even though it will fail)
    expect(organizationsServiceSpy.createOrganization.calls.count()).toBe(1, 'spy method was called once');
    // Upon error, the dialog would not close
    expect(matDialogSpy.closeAll.calls.count()).toBe(0, 'spy method was called');
  });

  it('should have the correct URL regex', () => {
    const regexp: RegExp = new RegExp(registerOrganizationService.urlRegex);
    expect(regexp.test('https://www.google.ca')).toBeTruthy();
    expect(regexp.test('http://www.google.ca')).toBeTruthy();
    expect(regexp.test('https://google.ca')).toBeTruthy();
    expect(regexp.test('http://google.ca')).toBeTruthy();
    expect(regexp.test('http://google.com')).toBeTruthy();
    expect(regexp.test('http://google.ca/potato')).toBeTruthy();
    expect(regexp.test('http://numb3r5.ca')).toBeTruthy();
    expect(regexp.test('httpz://google.ca')).toBeFalsy();
    expect(regexp.test('httpsz://google.ca')).toBeFalsy();
    expect(regexp.test('https://google.superLongTLDThatStillWorksForSomeReason')).toBeTruthy();
    expect(regexp.test('HTTP://www.google.ca')).toBeTruthy();
    expect(regexp.test('www.google.ca')).toBeFalsy();
  });

  it('should have the correct organization name regex', () => {
    const regexp = new RegExp(registerOrganizationService.organizationNameRegex);
    expect(regexp.test('1234')).toBeFalsy();
    expect(regexp.test('1asdfasd')).toBeFalsy();
    expect(regexp.test('我喜欢狗')).toBeFalsy();
    expect(regexp.test('testname')).toBeTruthy();
  });
});
