/*
 *    Copyright 2019 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of as observableOf, throwError } from 'rxjs';
import { OrganizationsService } from '../../../shared/swagger';
import { CollectionsService } from '../../state/collections.service';
import { OrganizationQuery } from '../../state/organization.query';
import { CreateCollectionService } from './create-collection.service';
import { CreateCollectionStore } from './create-collection.store';

let organizationsServiceSpy: jasmine.SpyObj<OrganizationsService>;
let organizationQuerySpy: jasmine.SpyObj<OrganizationQuery>;
let matDialogSpy: jasmine.SpyObj<MatDialog>;

describe('CreateCollectionService', () => {
  let createCollectionService: CreateCollectionService;
  const exampleFormState = { name: '', description: '', displayName: '', topic: '' };

  beforeEach(() => {
    const organizationsServiceStub = jasmine.createSpyObj('OrganizationsService', ['createCollection', 'updateCollection']);
    const organizationQueryStub = jasmine.createSpyObj('OrganizationQuery', ['getValue']);
    const collectionsServiceStub = jasmine.createSpyObj('CollectionsService', ['updateCollections']);
    const matDialogStub = jasmine.createSpyObj('MatDialog', ['closeAll']);
    TestBed.configureTestingModule({
      providers: [
        CreateCollectionService,
        CreateCollectionStore,
        FormBuilder,
        { provide: MatDialog, useValue: matDialogStub },
        { provide: CollectionsService, useValue: collectionsServiceStub },
        { provide: OrganizationsService, useValue: organizationsServiceStub },
        { provide: OrganizationQuery, useValue: organizationQueryStub },
      ],
      imports: [BrowserAnimationsModule, HttpClientTestingModule, MatDialogModule, MatSnackBarModule],
    });

    createCollectionService = TestBed.inject(CreateCollectionService);
    organizationsServiceSpy = TestBed.inject(OrganizationsService) as jasmine.SpyObj<OrganizationsService>;
    organizationQuerySpy = TestBed.inject(OrganizationQuery) as jasmine.SpyObj<OrganizationQuery>;
    matDialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    TestBed.inject(CreateCollectionStore);
  });

  it('should be created', () => {
    expect(createCollectionService).toBeDefined();
  });

  it('should try to add a collection', () => {
    organizationQuerySpy.getValue.and.returnValue(<any>{ organization: { id: 1 } });
    organizationsServiceSpy.createCollection.and.returnValue(observableOf(null));
    matDialogSpy.closeAll.and.returnValue(null);

    createCollectionService.createCollection(exampleFormState);

    // Expected createCollection call to be called (and it will succeed)
    expect(organizationsServiceSpy.createCollection.calls.count()).toBe(1, 'spy method was called once');
    // Upon success, the dialog would close
    expect(matDialogSpy.closeAll.calls.count()).toBe(1, 'spy method was not called once');
  });

  it('should handle error when adding a collection', () => {
    organizationQuerySpy.getValue.and.returnValue(<any>{ organization: { id: 1 } });
    organizationsServiceSpy.createCollection.and.returnValue(throwError('test 404 error'));

    createCollectionService.createCollection(exampleFormState);

    // Expected createCollection call to be called (even though it will fail)
    expect(organizationsServiceSpy.createCollection.calls.count()).toBe(1, 'spy method was called once');
    // Upon error, the dialog would not close
    expect(matDialogSpy.closeAll.calls.count()).toBe(0, 'spy method was called');
  });

  it('should try to update a collection', () => {
    organizationQuerySpy.getValue.and.returnValue(<any>{ organization: { id: 1 } });
    organizationsServiceSpy.updateCollection.and.returnValue(observableOf(null));
    matDialogSpy.closeAll.and.returnValue(null);

    createCollectionService.updateCollection(exampleFormState, 1, 'description');

    // Expected createCollection call to be called (and it will succeed)
    expect(organizationsServiceSpy.updateCollection.calls.count()).toBe(1, 'spy method was called once');
    // Upon success, the dialog would close
    expect(matDialogSpy.closeAll.calls.count()).toBe(1, 'spy method was not called once');
  });

  it('should handle error when updating a collection', () => {
    organizationQuerySpy.getValue.and.returnValue(<any>{ organization: { id: 1 } });
    organizationsServiceSpy.updateCollection.and.returnValue(throwError('test 404 error'));

    createCollectionService.updateCollection(exampleFormState, 1, 'description');

    // Expected createCollection call to be called (even though it will fail)
    expect(organizationsServiceSpy.updateCollection.calls.count()).toBe(1, 'spy method was called once');
    // Upon error, the dialog would not close
    expect(matDialogSpy.closeAll.calls.count()).toBe(0, 'spy method was called');
  });
});
