import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AddEntryService } from './add-entry.service';
import { AddEntryStore } from './add-entry.store';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AddEntryService', () => {
  let addEntryService: AddEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [AddEntryService, AddEntryStore, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });

    addEntryService = TestBed.inject(AddEntryService);
    TestBed.inject(AddEntryStore);
  });

  it('should be created', () => {
    expect(addEntryService).toBeDefined();
  });
});
