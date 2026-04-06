import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CurrentCollectionsService } from './current-collections.service';
import { CurrentCollectionsStore } from './current-collections.store';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('CurrentCollectionsService', () => {
  let currentCollectionsService: CurrentCollectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        CurrentCollectionsService,
        CurrentCollectionsStore,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    currentCollectionsService = TestBed.inject(CurrentCollectionsService);
    TestBed.inject(CurrentCollectionsStore);
  });

  it('should be created', () => {
    expect(currentCollectionsService).toBeDefined();
  });
});
