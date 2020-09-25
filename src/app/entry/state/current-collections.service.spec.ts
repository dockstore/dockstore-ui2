import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CurrentCollectionsService } from './current-collections.service';
import { CurrentCollectionsStore } from './current-collections.store';

describe('CurrentCollectionsService', () => {
  let currentCollectionsService: CurrentCollectionsService;
  let currentCollectionsStore: CurrentCollectionsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrentCollectionsService, CurrentCollectionsStore],
      imports: [HttpClientTestingModule],
    });

    currentCollectionsService = TestBed.inject(CurrentCollectionsService);
    currentCollectionsStore = TestBed.inject(CurrentCollectionsStore);
  });

  it('should be created', () => {
    expect(currentCollectionsService).toBeDefined();
  });
});
