import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { UpdateOrganizationOrCollectionDescriptionService } from './update-organization-description.service';
import { UpdateOrganizationOrCollectionDescriptionStore } from './update-organization-description.store';
import { UrlResolverService } from '../../../shared/url-resolver.service';

describe('UpdateOrganizationOrcolelctionDescriptionService', () => {
  let updateOrganizationOrCollectionDescriptionService: UpdateOrganizationOrCollectionDescriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UpdateOrganizationOrCollectionDescriptionService,
        UpdateOrganizationOrCollectionDescriptionStore,
        UntypedFormBuilder,
        UrlResolverService,
      ],
      imports: [HttpClientTestingModule, RouterTestingModule, MatDialogModule, MatSnackBarModule],
    });

    updateOrganizationOrCollectionDescriptionService = TestBed.inject(UpdateOrganizationOrCollectionDescriptionService);
    TestBed.inject(UpdateOrganizationOrCollectionDescriptionStore);
  });

  it('should be created', () => {
    expect(updateOrganizationOrCollectionDescriptionService).toBeDefined();
  });
});
