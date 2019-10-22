import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UpdateOrganizationOrCollectionDescriptionService } from './update-organization-description.service';
import { UpdateOrganizationOrCollectionDescriptionStore } from './update-organization-description.store';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('UpdateOrganizationOrcolelctionDescriptionService', () => {
  let updateOrganizationOrCollectionDescriptionService: UpdateOrganizationOrCollectionDescriptionService;
  let updateOrganizationOrCollectionDescriptionStore: UpdateOrganizationOrCollectionDescriptionStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpdateOrganizationOrCollectionDescriptionService, UpdateOrganizationOrCollectionDescriptionStore, FormBuilder],
      imports: [HttpClientTestingModule, RouterTestingModule, MatDialogModule, MatSnackBarModule]
    });

    updateOrganizationOrCollectionDescriptionService = TestBed.get(UpdateOrganizationOrCollectionDescriptionService);
    updateOrganizationOrCollectionDescriptionStore = TestBed.get(UpdateOrganizationOrCollectionDescriptionStore);
  });

  it('should be created', () => {
    expect(updateOrganizationOrCollectionDescriptionService).toBeDefined();
  });
});
