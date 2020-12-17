import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CustomMaterialModule } from '../../../shared/modules/material.module';
import { AddEntryService } from './add-entry.service';
import { AddEntryStore } from './add-entry.store';

describe('AddEntryService', () => {
  let addEntryService: AddEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddEntryService, AddEntryStore],
      imports: [HttpClientTestingModule, CustomMaterialModule],
    });

    addEntryService = TestBed.inject(AddEntryService);
    TestBed.inject(AddEntryStore);
  });

  it('should be created', () => {
    expect(addEntryService).toBeDefined();
  });
});
