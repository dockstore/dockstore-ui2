import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AddEntryService } from './add-entry.service';
import { AddEntryStore } from './add-entry.store';

describe('AddEntryService', () => {
  let addEntryService: AddEntryService;
  let addEntryStore: AddEntryStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddEntryService, AddEntryStore],
      imports: [ HttpClientTestingModule ]
    });

    addEntryService = TestBed.get(AddEntryService);
    addEntryStore = TestBed.get(AddEntryStore);
  });

  it('should be created', () => {
    expect(addEntryService).toBeDefined();
  });

});
