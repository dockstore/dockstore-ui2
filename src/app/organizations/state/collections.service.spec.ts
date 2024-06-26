import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatLegacyDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacySnackBarModule } from '@angular/material/legacy-snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { UrlResolverService } from '../../shared/url-resolver.service';
import { CollectionsService } from './collections.service';
import { CollectionsStore } from './collections.store';

describe('CollectionsService', () => {
  let collectionsService: CollectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CollectionsService, CollectionsStore, UrlResolverService],
      imports: [HttpClientTestingModule, RouterTestingModule, MatLegacySnackBarModule, MatLegacyDialogModule],
    });

    collectionsService = TestBed.inject(CollectionsService);
    TestBed.inject(CollectionsStore);
  });

  it('should be created', () => {
    expect(collectionsService).toBeDefined();
  });
});
