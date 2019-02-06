import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CustomMaterialModule } from '../../shared/modules/material.module';
import { CollectionsService } from './collections.service';
import { CollectionsStore } from './collections.store';

describe('CollectionsService', () => {
  let collectionsService: CollectionsService;
  let collectionsStore: CollectionsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CollectionsService, CollectionsStore],
      imports: [ HttpClientTestingModule, CustomMaterialModule, RouterTestingModule ]
    });

    collectionsService = TestBed.get(CollectionsService);
    collectionsStore = TestBed.get(CollectionsStore);
  });

  it('should be created', () => {
    expect(collectionsService).toBeDefined();
  });

});
