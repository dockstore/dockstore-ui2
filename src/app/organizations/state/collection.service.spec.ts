import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CollectionService } from './collection.service';
import { CollectionStore } from './collection.store';
import { RouterTestingModule } from '@angular/router/testing';

describe('CollectionService', () => {
  let collectionService: CollectionService;
  let collectionStore: CollectionStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CollectionService, CollectionStore],
      imports: [ HttpClientTestingModule, RouterTestingModule ]
    });

    collectionService = TestBed.get(CollectionService);
    collectionStore = TestBed.get(CollectionStore);
  });

  it('should be created', () => {
    expect(collectionService).toBeDefined();
  });

});
