import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule, MatSnackBarModule } from '@angular/material';

import { CreateCollectionService } from './create-collection.service';
import { CreateCollectionStore } from './create-collection.store';
import { FormBuilder } from '@angular/forms';

describe('CreateCollectionService', () => {
  let createCollectionService: CreateCollectionService;
  let createCollectionStore: CreateCollectionStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateCollectionService, CreateCollectionStore, FormBuilder],
      imports: [ HttpClientTestingModule, MatDialogModule, MatSnackBarModule ]
    });

    createCollectionService = TestBed.get(CreateCollectionService);
    createCollectionStore = TestBed.get(CreateCollectionStore);
  });

  it('should be created', () => {
    expect(createCollectionService).toBeDefined();
  });

});
