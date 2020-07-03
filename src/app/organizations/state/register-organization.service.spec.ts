import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of as observableOf, throwError } from 'rxjs';

import { FormBuilder } from '@angular/forms';
import { OrganizationsService } from '../../shared/swagger';
import { RegisterOrganizationService } from './register-organization.service';

let organizationsServiceSpy: jasmine.SpyObj<OrganizationsService>;
let matDialogSpy: jasmine.SpyObj<MatDialog>;

describe('RegisterOrganizationService', () => {
  let registerOrganizationService: RegisterOrganizationService;
  const exampleFormState = { name: '', topic: '', link: '', location: '', contactEmail: '', avatarUrl: '', displayName: '' };
  beforeEach(() => {
    const organizationsServiceStub = jasmine.createSpyObj('OrganizationsService', ['createOrganization', 'updateOrganization']);
    const matDialogStub = jasmine.createSpyObj('MatDialog', ['closeAll']);
    TestBed.configureTestingModule({
      providers: [
        RegisterOrganizationService,
        FormBuilder,
        { provide: OrganizationsService, useValue: organizationsServiceStub },
        { provide: MatDialog, useValue: matDialogStub }
      ],
      imports: [HttpClientTestingModule, MatSnackBarModule, MatDialogModule, BrowserAnimationsModule, RouterTestingModule]
    });

    registerOrganizationService = TestBed.inject(RegisterOrganizationService);
    organizationsServiceSpy = TestBed.inject(OrganizationsService);
    matDialogSpy = TestBed.inject(MatDialog);
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

  it('should have correct avatar URL regex', () => {
    const regexp = new RegExp(registerOrganizationService.logoUrlRegex);
    expect(regexp.test('https://www.https://via.placeholder.com/150.jpg')).toBeTruthy();
    expect(regexp.test('https://www.https://via.placeholder.com/150.jPG')).toBeTruthy();
    expect(regexp.test('https://www.https://via.placeholder.com/150.jpeg')).toBeTruthy();
    expect(regexp.test('https://www.https://via.placeholder.com/150.jPEG')).toBeTruthy();
    expect(regexp.test('https://www.https://via.placeholder.com/150.pNg')).toBeTruthy();
    expect(regexp.test('https://www.https://via.placeholder.com/150.png')).toBeTruthy();
    expect(regexp.test('https://www.https://via.placeholder.com/150.gif')).toBeTruthy();
    expect(regexp.test('https://www.https://via.placeholder.com/150.gIf')).toBeTruthy();
    expect(regexp.test('https://www.https://via.placeholder.com/150')).toBeFalsy();
    expect(regexp.test('.png')).toBeFalsy();
    expect(regexp.test('https://www.https://via.placeholder.com/150.png potato')).toBeFalsy();
    expect(regexp.test('adf .jpg')).toBeFalsy();
    expect(regexp.test('https://via.placeholder.com/150.jpg asdf')).toBeFalsy();
  });
});
