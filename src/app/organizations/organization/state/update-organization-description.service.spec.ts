import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { UpdateOrganizationOrCollectionDescriptionService } from './update-organization-description.service';
import { UpdateOrganizationOrCollectionDescriptionStore } from './update-organization-description.store';

describe('UpdateOrganizationOrcolelctionDescriptionService', () => {
  let updateOrganizationOrCollectionDescriptionService: UpdateOrganizationOrCollectionDescriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpdateOrganizationOrCollectionDescriptionService, UpdateOrganizationOrCollectionDescriptionStore, FormBuilder],
      imports: [HttpClientTestingModule, RouterTestingModule, MatDialogModule, MatSnackBarModule],
    });

    updateOrganizationOrCollectionDescriptionService = TestBed.inject(UpdateOrganizationOrCollectionDescriptionService);
    TestBed.inject(UpdateOrganizationOrCollectionDescriptionStore);
  });

  it('should be created', () => {
    expect(updateOrganizationOrCollectionDescriptionService).toBeDefined();
  });
});
