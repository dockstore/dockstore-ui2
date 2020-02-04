import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RequestsService } from './requests.service';
import { RequestsStore } from './requests.store';

describe('RequestsService', () => {
  let requestsService: RequestsService;
  let requestsStore: RequestsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestsService, RequestsStore],
      imports: [HttpClientTestingModule, MatSnackBarModule]
    });

    requestsService = TestBed.get(RequestsService);
    requestsStore = TestBed.get(RequestsStore);
  });

  it('should be created', () => {
    expect(requestsService).toBeDefined();
  });
});
