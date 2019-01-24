import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CollectionsService } from './collections.service';
import { CollectionsStore } from './collections.store';

describe('CollectionsService', () => {
  let collectionsService: CollectionsService;
  let collectionsStore: CollectionsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CollectionsService, CollectionsStore],
      imports: [ HttpClientTestingModule ]
    });

    collectionsService = TestBed.get(CollectionsService);
    collectionsStore = TestBed.get(CollectionsStore);
  });

  it('should be created', () => {
    expect(collectionsService).toBeDefined();
  });

});
