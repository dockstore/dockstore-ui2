import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AddEntryService } from './add-entry.service';
import { AddEntryStore } from './add-entry.store';
import { CustomMaterialModule } from '../../../shared/modules/material.module';

describe('AddEntryService', () => {
  let addEntryService: AddEntryService;
  let addEntryStore: AddEntryStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddEntryService, AddEntryStore],
      imports: [ HttpClientTestingModule, CustomMaterialModule ]
    });

    addEntryService = TestBed.get(AddEntryService);
    addEntryStore = TestBed.get(AddEntryStore);
  });

  it('should be created', () => {
    expect(addEntryService).toBeDefined();
  });

});
