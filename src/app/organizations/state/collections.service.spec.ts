import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { UrlResolverService } from '../../shared/url-resolver.service';
import { CollectionsService } from './collections.service';
import { CollectionsStore } from './collections.store';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('CollectionsService', () => {
  let collectionsService: CollectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatSnackBarModule, MatDialogModule],
      providers: [
        CollectionsService,
        CollectionsStore,
        UrlResolverService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    collectionsService = TestBed.inject(CollectionsService);
    TestBed.inject(CollectionsStore);
  });

  it('should be created', () => {
    expect(collectionsService).toBeDefined();
  });
});
