import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreateCollectionService } from './create-collection.service';
import { CreateCollectionStore } from './create-collection.store';

describe('CreateCollectionService', () => {
  let createCollectionService: CreateCollectionService;
  let createCollectionStore: CreateCollectionStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateCollectionService, CreateCollectionStore],
      imports: [ HttpClientTestingModule ]
    });

    createCollectionService = TestBed.get(CreateCollectionService);
    createCollectionStore = TestBed.get(CreateCollectionStore);
  });

  it('should be created', () => {
    expect(createCollectionService).toBeDefined();
  });

});
